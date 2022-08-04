import * as THREE from "three";

import { createSandbox } from "../test-utils";

import {
  getNullableElement,
  range,
  toRadian,
  clamp,
  getElement,
  lerp,
  circulate,
  merge,
  getBoxPoints,
  toPowerOfTwo
} from "~/utils";
import ERROR from "~/const/error";

describe("Utils", () => {
  describe("getNullableElement", () => {
    it("should search from the document with selector if the parent element is not given", () => {
      const sandbox = createSandbox("target");

      expect(getNullableElement("#target")).to.equal(sandbox);
    });

    it("should search with the selector inside the parent element if the parent element is given", () => {
      const wrapper = createSandbox();
      const child = document.createElement("div");

      wrapper.id = "target";
      child.id = "target";

      wrapper.appendChild(child);

      expect(getNullableElement("#target", wrapper)).to.equal(child);
    });

    it("will return element itself if HTMLelemnt is given", () => {
      const wrapper = createSandbox();
      const testingEl = document.createElement("div");

      wrapper.appendChild(testingEl);

      expect(getNullableElement(testingEl)).to.equal(testingEl);
    });

    it("will return null if element with given selector not found", () => {
      const query = "#el-that-definitely-not-exist";

      expect(getNullableElement(query)).to.be.null;
    });

    it("will return null if element with given selector not found inside given parent", () => {
      const query = "#el-that-definitely-not-exist";
      const wrapper = createSandbox();

      expect(getNullableElement(query, wrapper)).to.be.null;
    });

    it("will return null if given parameter is null", () => {
      expect(getNullableElement(null)).not.to.throw;
      expect(getNullableElement(null)).to.be.null;
    });
  });

  describe("getElement", () => {
    it("should throw an 'Wrong type' error if given argument's type is wrong", () => {
      const someWrongTypes = [undefined, null, NaN, {a: 1}, () => ""];

      someWrongTypes.forEach(wrongType => {
        expect(() => getElement(wrongType as any))
          .to.throw()
          .with.property("code", ERROR.CODES.WRONG_TYPE);
      });
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
      const given = [0, 45, 90, 180];
      const expected = [0, Math.PI / 4, Math.PI / 2, Math.PI];
      const real = given.map(val => toRadian(val));

      expect(real).to.deep.equal(expected);
    });
  });

  describe("clamp", () => {
    it("should clamp value to minimum if the given value is equal or smaller than range minimum", () => {
      const values = [0, -1, -4, -100, -1000];
      const clamped = values.map(val => clamp(val, 0, 100));

      expect(clamped.every(val => val === 0)).to.be.true;
    });

    it("should clamp value to maximum if the given value is equal or bigger than range maximum", () => {
      const values = [100, 101, 104, 200, 1000];
      const clamped = values.map(val => clamp(val, 0, 100));

      expect(clamped.every(val => val === 100)).to.be.true;
    });

    it("should return original value when it's between range minimum and maximum", () => {
      const values = [-100, -1, 0, 1, 100];
      const clamped = values.map(val => clamp(val, -100, 100));

      expect(values).to.deep.equal(clamped);
    });
  });

  describe("lerp", () => {
    it("should return a if t = 0", () => {
      expect(lerp(1, 2, 0)).to.equal(1);
      expect(lerp(3, 5, 0)).to.equal(3);
      expect(lerp(-1, 0, 0)).to.equal(-1);
      expect(lerp(0, 2, 0)).to.equal(0);
      expect(lerp(4, -2, 0)).to.equal(4);
    });

    it("should return b if t = 1", () => {
      expect(lerp(1, 2, 1)).to.equal(2);
      expect(lerp(3, 5, 1)).to.equal(5);
      expect(lerp(-1, 0, 1)).to.equal(0);
      expect(lerp(0, 2, 1)).to.equal(2);
      expect(lerp(4, -2, 1)).to.equal(-2);
    });

    it("should return (a + b) / 2 if t = 0.5", () => {
      expect(lerp(1, 2, 0.5)).to.equal(1.5);
      expect(lerp(3, 5, 0.5)).to.equal(4);
      expect(lerp(-1, 0, 0.5)).to.equal(-0.5);
      expect(lerp(0, 2, 0.5)).to.equal(1);
      expect(lerp(4, -2, 0.5)).to.equal(1);
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
