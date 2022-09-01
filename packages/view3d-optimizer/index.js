#!/usr/bin/env node
/*
 * Copyright (c) 2022 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

/* eslint-disable no-console */
const path = require("path");
const { performance } = require("perf_hooks");

const fs = require("fs-extra");
const chalk = require("chalk/source/");
const { Command, Option } = require("commander");
const { exec } = require("child-process-promise");
const probe = require("probe-image-size");

const program = new Command();

program
  .requiredOption("-i, --input <path>", "path to the input gltf/glb file")
  .option("-o, --output <path>", "path to the generated output files")
  .option("-d, --draco", "apply Draco mesh compression")
  .option("-m, --meshopt", "apply Meshopt mesh compression")
  .option("-tc, --basisu", "apply KTX2 basisu supercompression (ETC1S)")
  .option("-w, --webp", "include webp textures")
  .addOption(new Option("-t0, --texture-lod-0 [size]", "apply minimum texture LOD with the given size"))
  .addOption(new Option("-t1, --texture-lod-1 [size]", "apply threshold texture LOD with the given size"))
  .addOption(new Option("-tm, --max-texture-size [size]", "restrict max texture size"))
  .option("--force-jpg", "force convert png images to jpg")
  .option("-s, --silent", "run silently without log");

program.parse(process.argv);

const options = program.opts();

const modelName = path.basename(options.input, path.extname(options.input));
const cwd = process.cwd();
const tmpFile = path.resolve(cwd, "temp.glb");
const outDir = options.output
  ? path.resolve(cwd, options.output)
  : path.resolve(path.dirname(options.input), modelName);
const outName = `${modelName}.gltf`;

const run = async (cmd, taskDesc) => {
  if (!options.silent) {
    process.stdout.write(`- ${chalk.yellow(taskDesc)}...`);
  }

  const startTime = performance.now();
  const tasks = (Array.isArray(cmd) ? cmd : [cmd]).map(task => exec(task));
  await Promise.all(tasks).catch(err => {
    process.stdout.write("\n");
    err.stdout && console.error(chalk.red(err.stdout));
    err.stderr && console.error(chalk.red(err.stderr));
    process.exit(1);
  });
  const endTime = performance.now();

  if (!options.silent) {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`- ${taskDesc}... ${chalk.green("DONE!")} (${chalk.blue(`${((endTime - startTime) / 1000).toFixed(2)}s`)})\n`)
  }
}

const main = async () => {
  await exec(`npx gltfpack -i ${options.input} -o ${tmpFile}`);

  if (options.maxTextureSize) {
    const maxSize = parseFloat(options.maxTextureSize);
    if (isNaN(maxSize)) {
      console.error(chalk.red("Failed to parse the maximum texture size"));
      process.exit(1);
    }

    await run(`npx gltf-transform resize --width ${maxSize} --height ${maxSize} ${tmpFile} ${tmpFile}`, `Resizing maximum texture size to ${maxSize}`);
  }

  if (options.basisu || options.meshopt) {
    const params = [];
    const descs = [];
    if (options.basisu) {
      params.push("-tc");
      descs.push("BasisU (ETC1S) texture compression");
    }
    if (options.meshopt) {
      params.push("-cc");
      descs.push("Meshopt compression");
    }

    await run(`npx gltfpack -i ${tmpFile} -o ${tmpFile} ${params.join(" ")}`, `Applying ${descs.join(" & ")}`);
  }

  if (options.draco) {
    await run(`npx gltf-pipeline -i ${tmpFile} -o ${tmpFile} -d -s --keepUnusedElements`, "Applying Draco compression");
  }

  // Copy final gltf files
  fs.ensureDirSync(outDir);
  const finalGLTF = `${outDir}/${outName}`;
  await exec(`npx gltf-transform copy ${tmpFile} ${finalGLTF}`);
  fs.rmSync(tmpFile);

  if (options.forceJpg) {
    const gltf = fs.readJSONSync(finalGLTF);
    const images = [...gltf.images].filter(image => image.uri);
    const imageURIs = images.map(img => path.resolve(outDir, img.uri));

    const tasks = imageURIs.map(img => {
      return `npx mozjpeg -outfile ${outDir}/${path.basename(img, path.extname(img))}.jpg ${img} && rm ${img}`;
    });

    await run(tasks, "Converting images to jpg");
    images.forEach(image => {
      image.mimeType = "image/jpeg";
      image.uri = `${path.basename(image.uri, path.extname(image.uri))}.jpg`;
    });

    // Save modified gltf
    fs.writeJSONSync(finalGLTF, gltf);
  }

  if (options.textureLod0) {
    const minSize = parseFloat(options.textureLod0);
    if (isNaN(minSize)) {
      console.error(chalk.red("Failed to parse the texture-lod-0 texture size"));
      process.exit(1);
    }

    const gltf = fs.readJSONSync(finalGLTF);
    const textures = [...gltf.textures];
    const images = textures
      .map(texture => gltf.images[texture.source])
      .filter(img => !!img.uri);
    const jpgImages = images
      .filter(img => img.mimeType ? img.mimeType === "image/jpeg" : /jpe?g$/.test(img.uri))
      .map(img => path.resolve(outDir, img.uri));
    const pngImages = images
      .filter(img => img.mimeType ? img.mimeType === "image/png" : img.uri.endsWith("png"))
      .map(img => path.resolve(outDir, img.uri));

    const commonConfig = `--resize "{\"width\": ${minSize}, \"height\": ${minSize}}" --suffix "_${minSize}" --output-dir "${outDir}"`;

    const tasks = [];
    if (jpgImages.length > 0) tasks.push(`npx squoosh-cli --mozjpeg auto ${commonConfig} ${jpgImages.join(" ")}`);
    if (pngImages.length > 0) tasks.push(`npx squoosh-cli --oxipng auto ${commonConfig} ${pngImages.join(" ")}`);

    if (tasks.length > 0) {
      await run(tasks, `Applying texture LOD (${minSize})`);

      for (const texture of textures) {
        const origImage = images[texture.source];
        const origSize = await probe(fs.createReadStream(path.resolve(outDir, origImage.uri)));
        const newTextureIndex = gltf.textures.length;

        // Copy current texture
        gltf.textures.push({
          ...texture
        });

        texture.source += textures.length;

        if (!texture.extras) texture.extras = {};

        texture.extras["view3d-lod"] = {
          levels: [{
            size: Math.max(origSize.width, origSize.height),
            index: newTextureIndex
          }]
        };

        const newImage = {};

        if (origImage.mimeType) newImage.mimeType = origImage.mimeType;

        const extName = path.extname(origImage.uri);
        const fileName = path.basename(origImage.uri, extName);

        newImage.uri = `${fileName}_${minSize}${extName}`;

        gltf.images.push(newImage);
      };

      // Save modified gltf
      fs.writeJSONSync(finalGLTF, gltf);
    }
  }

  if (options.textureLod1) {
    const thresholdSize = parseFloat(options.textureLod1);
    if (isNaN(thresholdSize)) {
      console.error(chalk.red("Failed to parse the texture-lod-1 texture size"));
      process.exit(1);
    }

    const gltf = fs.readJSONSync(finalGLTF);
    const textures = [...gltf.textures];
    const images = textures
      .map(texture => gltf.images[texture.source])
      .filter(img => !!img.uri);
    const jpgImages = [];
    const pngImages = [];

    const commonConfig = `--resize "{\"width\": ${thresholdSize}, \"height\": ${thresholdSize}}" --suffix "_${thresholdSize}" --output-dir "${outDir}"`;

    for (const texture of textures) {
      const origImage = images[texture.source];
      const origSize = await probe(fs.createReadStream(path.resolve(outDir, origImage.uri)));

      if (Math.max(origSize.width, origSize.height) <= thresholdSize) break;

      const newTextureIndex = gltf.textures.length;

      gltf.textures.push({
        sampler: texture.sampler,
        source: newTextureIndex
      });

      if (!texture.extras) texture.extras = {};
      if (!texture.extras["view3d-lod"]) texture.extras["view3d-lod"] = { levels: [] };

      texture.extras["view3d-lod"].levels.push({
        size: thresholdSize,
        index: newTextureIndex
      });

      const newImage = {};

      if (origImage.mimeType) newImage.mimeType = origImage.mimeType;

      const extName = path.extname(origImage.uri);
      const fileName = path.basename(origImage.uri, extName);

      newImage.uri = `${fileName}_${thresholdSize}${extName}`;

      gltf.images.push(newImage);

      if (origImage.mimeType ? origImage.mimeType === "image/jpeg" : /jpe?g$/.test(origImage.uri)) {
        jpgImages.push(origImage);
      }
      if (origImage.mimeType ? origImage.mimeType === "image/png" : origImage.uri.endsWith("png")) {
        pngImages.push(origImage);
      }
    };

    const tasks = [];
    if (jpgImages.length > 0) tasks.push(`npx squoosh-cli --mozjpeg auto ${commonConfig} ${jpgImages.map(img => path.resolve(outDir, img.uri)).join(" ")}`);
    if (pngImages.length > 0) tasks.push(`npx squoosh-cli --oxipng auto ${commonConfig} ${pngImages.map(img => path.resolve(outDir, img.uri)).join(" ")}`);

    await run(tasks, `Applying texture LOD (${thresholdSize})`);

    // Save modified gltf
    fs.writeJSONSync(finalGLTF, gltf);
  }

  if (options.webp) {
    const webpExtension = "EXT_texture_webp";
    const gltf = fs.readJSONSync(finalGLTF);
    const images = [...gltf.images];
    const textures = [...gltf.textures];
    const nonWebPTextures = textures
      .filter(texture => {
        const img = images[texture.source];

        if (!img || !img.uri) return false;

        return img.mimeType !== "image/webp" && !img.uri.endsWith("webp");
      });

    const textureImages = nonWebPTextures
      .sort((a, b) => a.source - b.source)
      .map(texture => images[texture.source]);

    // Convert images to webp
    if (textureImages.length > 0) {
      const imagePaths = textureImages.map(img => path.resolve(outDir, img.uri));
      await run(`npx squoosh-cli --webp "{}" --output-dir ${outDir} ${imagePaths.join(" ")}`, "Applying webp extension");

      gltf.images.push(...textureImages.map(img => {
        const fileName = path.basename(img.uri, path.extname(img.uri));

        return {
          mimeType: "image/webp",
          uri: `${fileName}.webp`
        }
      }));
    }

    nonWebPTextures.forEach(texture => {
      if (!texture.extensions) texture.extensions = {};

      texture.extensions[webpExtension] = {
        source: textures.length + texture.source
      }
    });

    if (nonWebPTextures.length > 0) {
      if (!gltf.extensionsUsed) gltf.extensionsUsed = [];

      gltf.extensionsUsed.push(webpExtension);
    }

    // Save modified gltf
    fs.writeJSONSync(finalGLTF, gltf);
  }

  if (!options.silent) {
    console.log(`Saved files at "${chalk.blue(outDir)}"`);
  }
}

main();
