
import { createView3D } from "../../test-utils";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { SSRPass } from "three/examples/jsm/postprocessing/SSRPass";
import { SSR } from "~/effect";

describe("EffectManager", () => {
  describe("setCustomEffect", () => {
    it("should be changed effectComposer to return a setCustomEffect.", async () => {
      const view3D = await createView3D({ src: "/alarm.glb" });

      const effectComposer: any = () => { };

      view3D.setCustomEffect(() => {
        return effectComposer;
      });

      view3D.once("load", () => {
        expect(view3D.effect.effectComposer === effectComposer).to.be.true;
      });

    });

    it("should be called again if the model changes.", async () => {
      const view3D = await createView3D({ src: '/alarm.glb' });

      const setCustomEffectSpy = Cypress.sinon.spy();

      let lastModelSrc = "";

      view3D.setCustomEffect(({ model, camera, scene, canvasSize, renderer }) => {
        const effectComposer = new EffectComposer(renderer);

        lastModelSrc = model.src;

        effectComposer.addPass(new SSRPass({
          camera,
          renderer,
          scene,
          selects: model.meshes,
          groundReflector: null
        }));

        setCustomEffectSpy();
        return new EffectComposer(renderer);
      });

      await view3D.load("/cube.glb");

      expect(setCustomEffectSpy.calledTwice).to.be.true;
      expect(lastModelSrc === "/cube.glb").to.be.true;
    })
  });

  describe("loadEffects", () => {
    it("should have pass in the effectComposer", async () => {
      const view3D = await createView3D({ src: "/alarm.glb" });

      let passName = "";

      view3D.once("loadFinish", () => {
        const effectComposer = view3D.effect.effectComposer;
        passName = effectComposer.passes[1].constructor.name;
      });

      view3D.loadEffects(new SSR());

      await view3D.load("/alarm.glb");

      expect(passName === "SSRPass").to.be.true;
    });

    it("should be called again if the model changes.", async () => {
      const view3D = await createView3D({ src: '/alarm.glb' });
      const setCustomEffectSpy = Cypress.sinon.spy();

      let lastModelSrc = "";

      view3D.loadEffects(
        ({ model }) => {
          lastModelSrc = model.src;
          setCustomEffectSpy();
          return new SSR();
        }
      );

      await view3D.load("/cube.glb");

      expect(setCustomEffectSpy.calledTwice).to.be.true;
      expect(lastModelSrc === "/cube.glb").to.be.true;
    });
  });
});










