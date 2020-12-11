import * as THREE from "three";
import AutoDirectionalLight from "~/environments/AutoDirectionalLight";
import Model from "~/core/Model";

describe("AutoDirectionalLight", () => {
  describe("default properties", () => {
    it("should have directional light & its target on objects", () => {
      const light = new AutoDirectionalLight();

      expect(light.objects).to.deep.equal([light.light, light.light.target]);
      expect(light.objects[0]).to.be.instanceOf(THREE.DirectionalLight);
    });

    it("should have three.js directional light", () => {
      expect(new AutoDirectionalLight().light).to.be.instanceOf(THREE.DirectionalLight);
    });

    it("should have default position on (0, 1, 0)", () => {
      expect(new AutoDirectionalLight().position).to.be.deep.equal(new THREE.Vector3(0, 1, 0));
    });

    it("should have default direction as normalized (-1, -1, -1) vector", () => {
      expect(new AutoDirectionalLight().direction).to.be.deep.equal(new THREE.Vector3(-1, -1, -1).normalize());
    });

    it("should have shadow enabled by default", () => {
      expect(new AutoDirectionalLight().light.castShadow).to.be.true;
    });
  });

  describe("options", () => {
    it("can set color", () => {
      // Given
      const expected = "#3f2497";

      // When
      const light = new AutoDirectionalLight(expected);

      // Then
      expect(light.light.color).to.be.deep.equal(new THREE.Color(expected));
    });

    it("can set intensity", () => {
      // Given
      const expected = 4.5;

      // When
      const light = new AutoDirectionalLight(0xffffff, expected);

      // Then
      expect(light.light.intensity).to.be.deep.equal(expected);
    });

    it("can set direction(normalized)", () => {
      // Given
      const expected = new THREE.Vector3(2, -4, 7);

      // When
      const light = new AutoDirectionalLight(0xffffff, 1, { direction: expected });

      // Then
      expect(light.direction).to.be.deep.equal(expected.normalize());
    });
  });

  describe("shadows", () => {
    it("can disable shadow", () => {
      // Given
      const light = new AutoDirectionalLight();

      // When
      light.disableShadow();

      // Then
      expect(light.light.castShadow).to.be.false;
    });

    it("can re-enable shadow", () => {
      // Given
      const light = new AutoDirectionalLight();

      // When
      light.disableShadow();
      light.enableShadow();

      // Then
      expect(light.light.castShadow).to.be.true;
    });
  });

  describe("auto direction", () => {
    it("should look at model's bbox center", () => {
      // Given
      const light = new AutoDirectionalLight();
      const lightTarget = light.objects[1];
      const obj = new THREE.Object3D()
        .add(new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)).translateX(-1).translateY(-1).translateZ(-1))
        .add(new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)).translateX(1).translateY(1).translateZ(1));
      const model = new Model({ scenes: [obj], animations: [] });

      // When
      light.fit(model)

      // Then
      const modelBboxCenter = model.bbox.getCenter(new THREE.Vector3());
      expect(lightTarget.position).to.be.deep.equal(modelBboxCenter);
    });

    it("should set position where it should look at model's bbox center with given direction", () => {
      // Given
      const light = new AutoDirectionalLight();
      const obj = new THREE.Object3D()
        .add(new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)).translateX(-1).translateY(-1).translateZ(-1))
        .add(new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2)).translateX(1).translateY(1).translateZ(1));
      const model = new Model({ scenes: [obj], animations: [] });

      // When
      light.fit(model)

      // Then
      const modelBboxCenter = model.bbox.getCenter(new THREE.Vector3());
      const viewingDirection = new THREE.Vector3().subVectors(modelBboxCenter, light.position).normalize();
      expect(viewingDirection.dot(light.direction)).to.be.closeTo(1, 0.0001);
    });
  });
});
