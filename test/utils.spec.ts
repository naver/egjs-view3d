import * as THREE from "three";

import { cleanup, createSandbox } from "./test-utils";

import View3DError from "~/View3DError";
import {
  getCanvas,
  range,
  toRadian,
  clamp,
  findIndex,
  getElement,
  mix,
  circulate,
  merge,
  getBoxPoints,
  toPowerOfTwo
} from "~/utils";
import ERROR from "~/consts/error";

describe("Utils", () => {
  describe("getElement", () => {
    let wrapper: HTMLElement;

    beforeEach(() => {
      wrapper = createSandbox("#wrapper");
    });

    afterEach(() => {
      cleanup();
    });

    it("should search from the document with selector if the parent element is not given", () => {
      // Given
      const findingEl = document.createElement("div");
      findingEl.id = "target";

      // When
      document.body.appendChild(findingEl);

      // Then
      try {
        expect(getElement("#target")).to.equal(findingEl);
      } catch (e) {
        expect(true).to.be.false; // Shouldn't reach here
      } finally {
        findingEl.remove();
      }
    });

    it("should search with the selector from the parent element if parent element is given", () => {
      // Given
      const findingEl = document.createElement("div");
      const fakeEl = document.createElement("div");
      findingEl.className = "target";
      fakeEl.className = "target";

      // When
      document.body.insertBefore(fakeEl, wrapper);
      wrapper.appendChild(findingEl);

      // Then
      try {
        expect(() => getElement(".target")).not.to.throw();
        expect(getElement(".target", wrapper)).to.equal(findingEl);
      } catch (e) {
        expect(true).to.be.false; // Shouldn't reach here
      } finally {
        fakeEl.remove();
        findingEl.remove();
      }
    });

    it("will return element itself if HTMLelemnt is given", () => {
      // Given
      const testingEl = document.createElement("div");

      // When
      wrapper.appendChild(testingEl);

      // Then
      expect(() => getElement(testingEl)).not.to.throw();
      expect(getElement(testingEl)).to.equal(testingEl);
    });

    it("will throw View3DError if element with given selector not found", () => {
      expect(() => getElement("#el-that-definitely-not-exist"))
        .to.throw(View3DError)
        .with.property("code", ERROR.CODES.ELEMENT_NOT_FOUND);
    });

    it("will throw View3DError if element with given selector not found inside given parent", () => {
      // Given
      const targetEl = document.createElement("div");
      targetEl.id = "target";

      // When
      document.body.appendChild(targetEl);

      // Then
      expect(() => getElement("#target", wrapper))
        .to.throw(View3DError)
        .with.property("code", ERROR.CODES.ELEMENT_NOT_FOUND);
    });

    it("will return null if given parameter is null", () => {
      expect(getElement(null)).not.to.throw;
      expect(getElement(null)).to.be.null;
    });
  });

  describe("getCanvas", () => {
    it("can return canvas element in document if parameter is proper query string", () => {
      // Given
      document.body.innerHTML = "<canvas id=\"view3d-canvas\"></canvas>";

      // When
      const canvas = getCanvas("#view3d-canvas");

      // Then
      expect(canvas).not.to.be.null;
    });

    it("can return canvas element in document if parameter is proper HTML canvas element", () => {
      // Given
      document.body.innerHTML = "<canvas id=\"view3d-canvas\"></canvas>";

      // When
      const canvas = getCanvas(document.querySelector("#view3d-canvas") as HTMLElement);

      // Then
      expect(canvas).not.to.be.null;
    });

    it("should throw an 'Element not found' error when there's no element found with given query string", () => {
      // Given
      document.body.innerHTML = "";

      try {
        // When
        getCanvas("#some-element");
        expect(true).to.be.false; // it should fail when it doesn't throw an error
      } catch (e) {
        // Then
        expect(e.code).to.equal(ERROR.CODES.ELEMENT_NOT_FOUND);
      }
    });

    it("should throw an 'Wrong type' error if given argument's type is wrong", () => {
      // Given
      const someWrongTypes = [undefined, null, NaN, {a: 1}, () => ""];

      someWrongTypes.forEach(wrongType => {
        try {
          // When
          getCanvas(wrongType as any);
          expect(true).to.be.false; // it should fail when it doesn't throw an error
        } catch (e) {
          // Then
          expect(e.code).to.equal(ERROR.CODES.WRONG_TYPE);
        }
      });
    });

    it("should throw an 'Element is not canvas' error when found element is not a canvas element", () => {
      // Given
      document.body.innerHTML = "<div id=\"view3d-canvas\"></div>";

      try {
        // When
        getCanvas(document.querySelector("#view3d-canvas") as HTMLElement);
        expect(true).to.be.false; // it should fail when it doesn't throw an error
      } catch (e) {
        // Then
        expect(e.code).to.equal(ERROR.CODES.ELEMENT_NOT_CANVAS);
      }
    });
  });

  describe("range", () => {
    it("should return 0 to n - 1", () => {
      expect(range(5)).deep.equals([0, 1, 2, 3, 4]);
      expect(range(100).every((val, idx) => val === idx)).to.be.true;
    });

    it("should return an empty array if end value is not given", () => {
      // @ts-ignore
      expect(range()).to.deep.equal([]);
    });

    it("should return an empty array if end value is less than 1", () => {
      expect(range(0)).to.deep.equal([]);
      expect(range(-1)).to.deep.equal([]);
      expect(range(-100)).to.deep.equal([]);
    });
  });

  describe("toRadian", () => {
    it("should return correct value", () => {
      // Given
      const given = [0, 45, 90, 180];
      const expected = [0, Math.PI / 4, Math.PI / 2, Math.PI];

      // When
      const real = given.map(val => toRadian(val));

      // Then
      expect(real).to.deep.equal(expected);
    });
  });

  describe("clamp", () => {
    it("should clamp value to minimum if the given value is equal or smaller than range minimum", () => {
      // Given
      const values = [0, -1, -4, -100, -1000];

      // When
      const clamped = values.map(val => clamp(val, 0, 100));

      // Then
      expect(clamped.every(val => val === 0)).to.be.true;
    });

    it("should clamp value to maximum if the given value is equal or bigger than range maximum", () => {
      // Given
      const values = [100, 101, 104, 200, 1000];

      // When
      const clamped = values.map(val => clamp(val, 0, 100));

      // Then
      expect(clamped.every(val => val === 100)).to.be.true;
    });

    it("should return original value when it's between range minimum and maximum", () => {
      // Given
      const values = [-100, -1, 0, 1, 100];

      // When
      const clamped = values.map(val => clamp(val, -100, 100));

      // Then
      expect(values).to.deep.equal(clamped);
    });
  });

  describe("findIndex", () => {
    it("can find correct index in the array", () => {
      // Given
      const array = [1, 2, 3, 4, 5];

      // When
      const index = findIndex(2, array);

      // Then
      expect(index).to.equal(1);
    });

    it("should return index of first element found", () => {
      // Given
      const array = [1, 2, 2, 2, 2];

      // When
      const index = findIndex(2, array);

      // Then
      expect(index).to.equal(1);
    });

    it("should return -1 when it couldn't find element", () => {
      // Given
      const array = [0, 1, 2, 3, 4];

      // When
      const index = findIndex(5, array);

      // Then
      expect(index).to.equal(-1);
    });
  });

  describe("mix", () => {
    it("should return a if t = 0", () => {
      expect(mix(1, 2, 0)).to.equal(1);
      expect(mix(3, 5, 0)).to.equal(3);
      expect(mix(-1, 0, 0)).to.equal(-1);
      expect(mix(0, 2, 0)).to.equal(0);
      expect(mix(4, -2, 0)).to.equal(4);
    });

    it("should return b if t = 1", () => {
      expect(mix(1, 2, 1)).to.equal(2);
      expect(mix(3, 5, 1)).to.equal(5);
      expect(mix(-1, 0, 1)).to.equal(0);
      expect(mix(0, 2, 1)).to.equal(2);
      expect(mix(4, -2, 1)).to.equal(-2);
    });

    it("should return (a + b) / 2 if t = 0.5", () => {
      expect(mix(1, 2, 0.5)).to.equal(1.5);
      expect(mix(3, 5, 0.5)).to.equal(4);
      expect(mix(-1, 0, 0.5)).to.equal(-0.5);
      expect(mix(0, 2, 0.5)).to.equal(1);
      expect(mix(4, -2, 0.5)).to.equal(1);
    });
  });

  describe("circulate", () => {
    it("should return value itself if it's between min and max value", () => {
      expect(circulate(0, -5, 5)).to.equal(0);
      expect(circulate(0, 0, 5)).to.equal(0);
      expect(circulate(0, -5, 0)).to.equal(0);
      expect(circulate(0, 0, 0)).to.equal(0);
      expect(circulate(4, 0, 5)).to.equal(4);
      expect(circulate(5, -5, 5)).to.equal(5);
      expect(circulate(-5, -5, 5)).to.equal(-5);
    });

    it("should return circulated value if it's lower than minimum value", () => {
      expect(circulate(-10, -5, 5)).to.equal(0);
      expect(circulate(-5, 0, 5)).to.equal(5);
      expect(circulate(-6, -5, 0)).to.equal(-1);
      expect(circulate(-10, -5, 0)).to.equal(0);
      expect(circulate(-1, 0, 5)).to.equal(4);
    });

    it("should return circulated value if it's lower than minimum value", () => {
      expect(circulate(10, -5, 5)).to.equal(0);
      expect(circulate(10, 0, 5)).to.equal(0);
      expect(circulate(5, -5, 0)).to.equal(-5);
      expect(circulate(10, -5, 0)).to.equal(-5);
      expect(circulate(6, 0, 5)).to.equal(1);
      expect(circulate(7, -1, 5)).to.equal(1);
    });
  });

  describe("merge", () => {
    it("should return same reference of the given object", () => {
      const obj = {};
      const merged = merge(obj, { a: 1 });

      expect(merged).equals(obj);
    });

    it("should add value", () => {
      const obj = {};
      const merged = merge(obj, { a: 1 }) as { a: number };

      expect(merged.a).to.equal(1);
    });

    it("should overwrite value", () => {
      const obj = { a : 1 };
      const merged = merge(obj, { a: 2 }) as { a: number };

      expect(merged.a).to.equal(2);
    });
  });

  describe("getBoxPoints", () => {
    it("should return 8 points", () => {
      const box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      expect(getBoxPoints(box).length).to.equal(8);
    });

    it("should return all points of the given box", () => {
      const box = new THREE.Box3(
        new THREE.Vector3(-1, -1, -1),
        new THREE.Vector3(1, 1, 1),
      );
      const boxPoints = getBoxPoints(box);

      expect(boxPoints[0]).to.deep.equal(new THREE.Vector3(-1, -1, -1));
      expect(boxPoints[1]).to.deep.equal(new THREE.Vector3(-1, -1, 1));
      expect(boxPoints[2]).to.deep.equal(new THREE.Vector3(-1, 1, -1));
      expect(boxPoints[3]).to.deep.equal(new THREE.Vector3(-1, 1, 1));
      expect(boxPoints[4]).to.deep.equal(new THREE.Vector3(1, -1, -1));
      expect(boxPoints[5]).to.deep.equal(new THREE.Vector3(1, -1, 1));
      expect(boxPoints[6]).to.deep.equal(new THREE.Vector3(1, 1, -1));
      expect(boxPoints[7]).to.deep.equal(new THREE.Vector3(1, 1, 1));
    });
  });

  describe("toPowerOfTwo", () => {
    it("should return given number itself if it's already power of two", () => {
      const values = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
      values.forEach(val => {
        expect(toPowerOfTwo(val)).to.equal(val);
      });
    });

    it("should return bigger power of two number than given number", () => {
      const values = [3, 5, 15, 24, 53, 127];
      const expected = [4, 8, 16, 32, 64, 128];
      values.forEach((val, idx) => {
        expect(toPowerOfTwo(val)).to.equal(expected[idx]);
      });
    });
  });
});
