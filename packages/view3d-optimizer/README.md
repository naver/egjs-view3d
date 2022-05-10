# view3d-optimizer

glTF optimizer designed for the 3D model viewer [View3D](https://github.com/naver/egjs-view3d)

Note: this tool is not a general solution for optimizing 3D models.

## Options
- "-i, --input <path>", "path to the input gltf/glb file"
- "-o, --output <path>", "path to the generated output files"
- "-d, --draco", "apply Draco mesh compression"
- "-m, --meshopt", "apply Meshopt compression"
- "-tc, --basisu", "apply KTX2 basisu supercompression (ETC1S)"
- "-w, --webp", "include webp textures"
- "-t0, --texture-lod-0 [size]", "apply minimum texture LOD with the given size"
- "-t1, --texture-lod-1 [size]", "apply threshold texture LOD with the given size"
- "-tm, --max-texture-size [size]", "restrict max texture size"
- "--force-jpg", "force convert png images to jpg"
- "-s, --silent", "run silently without log"

## Examples

```sh
# This will generate directory named "model" in cwd
# The generated model will have textures resized to 256, and will load texture of 2048 & 4096 later
# Also, Draco mesh compressio is applied
view3d-optimizer -i model.glb -d -t0 256 -t1 2048 -tm 4096
```

## NOTICE
This tool is mostly just a collection of other tools.

Check out these awesome tools that were actually used.
- [gltf-pipeline](https://github.com/CesiumGS/gltf-pipeline)
- [gltf-transform](https://github.com/donmccurdy/glTF-Transform)
- [squoosh](https://github.com/GoogleChromeLabs/squoosh)

## License
```
Copyright (c) 2022-present NAVER Corp.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
