import * as THREE from "three";
import * as sinon from "sinon";
import Controller from "~/core/camera/Controller";
import Camera from "~/core/camera/Camera";
import RotateControl from "~/controls/RotateControl";
import TranslateControl from "~/controls/TranslateControl";
import DistanceControl from "~/controls/DistanceControl";

describe("Controller", () => {
  describe("initial properties", () => {
    it("should have no controls added", () => {
      const canvas = document.createElement("canvas");
      const controller = new Controller(canvas, new Camera(canvas));
      expect(controller.controls).to.be.deep.equal([]);
    });
  });

  describe("clear", () => {
    it("can clear all controls added", () => {
      // Given
      const canvas = document.createElement("canvas");
      const controller = new Controller(canvas, new Camera(canvas));
      controller.add(new RotateControl());
      controller.add(new TranslateControl());
      controller.add(new DistanceControl());

      // When
      controller.clear();

      // Then
      expect(controller.controls).to.be.empty;
    });

    it("should call control's destroy() before removing it", () => {
      // Given
      const canvas = document.createElement("canvas");
      const controller = new Controller(canvas, new Camera(canvas));
      const control = new RotateControl();
      const destroySpy = sinon.spy(control, "destroy");
      controller.add(control);

      // When
      controller.clear();

      // Then
      expect(destroySpy.calledOnce).to.be.true;
    });
  });

  describe("add", () => {
    it("can add camera control", () => {
      // Given
      const canvas = document.createElement("canvas");
      const controller = new Controller(canvas, new Camera(canvas));
      const control = new RotateControl()

      // When
      controller.add(control);

      // Then
      expect(controller.controls).to.deep.equal([control]);
    });
  });

  describe("remove", () => {
    it("can remove single control from it", () => {
      // Given
      const canvas = document.createElement("canvas");
      const controller = new Controller(canvas, new Camera(canvas));
      const removingControl = new RotateControl();
      controller.add(removingControl);
      controller.add(new TranslateControl());
      controller.add(new DistanceControl());

      // When
      controller.remove(removingControl);

      // Then
      expect(controller.controls.length).to.equal(2);
      expect(controller.controls.find(control => control === removingControl)).to.be.undefined;
    });
  });

  describe("enableAll", () => {
    it("should call enable of all controls attached", () => {
      // Given
      const canvas = document.createElement("canvas");
      const controller = new Controller(canvas, new Camera(canvas));
      const controls = [
        new RotateControl(),
        new TranslateControl(),
        new DistanceControl(),
      ];
      controls.forEach(control => controller.add(control));
      const spies = controls.map(control => sinon.spy(control, "enable"));

      // When
      controller.enableAll();

      // Then
      expect(spies.every(spy => spy.calledOnce)).to.be.true;
    });

    it("should call syncToCamera after it", () => {
      // Given
      const canvas = document.createElement("canvas");
      const controller = new Controller(canvas, new Camera(canvas));
      const spy = sinon.spy(controller, "syncToCamera");

      // When
      controller.enableAll();

      // Then
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe("disableAll", () => {
    it("should call disable of all controls attached", () => {
      // Given
      const canvas = document.createElement("canvas");
      const controller = new Controller(canvas, new Camera(canvas));
      const controls = [
        new RotateControl(),
        new TranslateControl(),
        new DistanceControl(),
      ];
      controls.forEach(control => controller.add(control));
      const spies = controls.map(control => sinon.spy(control, "disable"));

      // When
      controller.disableAll();

      // Then
      expect(spies.every(spy => spy.calledOnce)).to.be.true;
    });
  });

  describe("resize", () => {
    it("should call resize of all controls attached", () => {
      // Given
      const canvas = document.createElement("canvas");
      const controller = new Controller(canvas, new Camera(canvas));
      const controls = [
        new RotateControl(),
        new TranslateControl(),
        new DistanceControl(),
      ];
      controls.forEach(control => controller.add(control));
      const spies = controls.map(control => sinon.spy(control, "resize"));
      const size = new THREE.Vector2(5498, 9684);

      // When
      controller.resize(size);

      // Then
      expect(spies.every(spy => spy.calledOnceWith(size))).to.be.true;
    });
  });

  describe("syncToCamera", () => {
    it("should call sync of all controls attached", () => {
      // Given
      const canvas = document.createElement("canvas");
      const controller = new Controller(canvas, new Camera(canvas));
      const controls = [
        new RotateControl(),
        new TranslateControl(),
        new DistanceControl(),
      ];
      controls.forEach(control => controller.add(control));
      const spies = controls.map(control => sinon.spy(control, "sync"));

      // When
      controller.syncToCamera();

      // Then
      expect(spies.every(spy => spy.calledOnce)).to.be.true;
    });
  });

  describe("update", () => {
    it("should update of all controls attached with delta in milisecond", () => {
      // Given
      const canvas = document.createElement("canvas");
      const camera = new Camera(canvas);
      const controller = new Controller(canvas, camera);
      const controls = [
        new RotateControl(),
        new TranslateControl(),
        new DistanceControl(),
      ];
      controls.forEach(control => controller.add(control));
      const spies = controls.map(control => sinon.spy(control, "update"));
      const time = 1234;

      // When
      controller.update(time);

      // Then
      expect(spies.every(spy => spy.calledOnceWith(camera, time * 1000))).to.be.true;
    });
  });
});
