import { PointAnnotation } from "~/core";
import AnnotationManager from "~/annotation/AnnotationManager";
import { range } from "~/utils";
import { createView3D } from "../../../test-utils";


describe("AnnotationManager", () => {
  describe("Initial State", () => {
    it("should have an empty list", async () => {
      const view3D = await createView3D();
      const manager = new AnnotationManager(view3D);

      expect(manager.list).to.be.empty;
    });

    it("should create a wrapper element with class 'view3d-annotation-wrapper' if not given", async () => {
      const view3D = await createView3D();
      const manager = new AnnotationManager(view3D);

      expect(manager.wrapper).not.to.be.undefined;
      expect(manager.wrapper).to.be.an.instanceOf(HTMLDivElement);
      expect(manager.wrapper.classList.contains("view3d-annotation-wrapper")).to.be.true;
      expect(manager.wrapper.parentElement).to.equal(view3D.rootEl);
    });
  });

  describe("add", () => {
    it("can add an annotation to the list", async () => {
      const view3D = await createView3D();
      const manager = new AnnotationManager(view3D);

      const annotation = new PointAnnotation(view3D);
      manager.add(annotation);

      expect(manager.list.length).to.equal(1);
      expect(manager.list[0]).to.equal(annotation);
    });

    it("can add multiple annotations", async () => {
      const view3D = await createView3D();
      const manager = new AnnotationManager(view3D);

      const annotations = range(5).map(() => new PointAnnotation(view3D));
      manager.add(...annotations);

      expect(manager.list.length).to.equal(5);
      expect(manager.list).to.deep.equal(annotations);
    });
  });
});
