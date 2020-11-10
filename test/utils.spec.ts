import {
  getCanvas,
  range,
  toRadian,
  clamp,
  findIndex,
} from "~/utils";
import * as ERROR from "~/consts/error";

describe("Utils", () => {
  describe("getCanvas", () => {
    it("can return canvas element in document if parameter is proper query string", () => {
      // Given
      document.body.innerHTML = `<canvas id="view3d-canvas"></canvas>`;

      // When
      const canvas = getCanvas("#view3d-canvas");

      // Then
      expect(canvas).not.toBeNull();
    });

    it("can return canvas element in document if parameter is proper HTML canvas element", () => {
      // Given
      document.body.innerHTML = `<canvas id="view3d-canvas"></canvas>`;

      // When
      const canvas = getCanvas(document.querySelector("#view3d-canvas") as HTMLElement);

      // Then
      expect(canvas).not.toBeNull();
    });

    it("should throw an 'Element not found' error when there's no element found with given query string", () => {
      // Given
      document.body.innerHTML = "";

      try {
        // When
        getCanvas("#some-element");
        expect(true).toBeFalsy(); // it should fail when it doesn't throw an error
      } catch (e) {
        // Then
        expect(e.code).toBe(ERROR.CODES.ELEMENT_NOT_FOUND);
      }
    });

    it("should throw an 'Wrong type' error if given argument's type is wrong", () => {
      // Given
      const someWrongTypes = [undefined, null, NaN, {a: 1}, () => ""];

      someWrongTypes.forEach(wrongType => {
        try {
          // When
          getCanvas(wrongType as any);
          expect(true).toBeFalsy(); // it should fail when it doesn't throw an error
        } catch (e) {
          // Then
          expect(e.code).toBe(ERROR.CODES.WRONG_TYPE);
        }
      });
    });

    it("should throw an 'Element is not canvas' error when found element is not a canvas element", () => {
      // Given
      document.body.innerHTML = `<div id="view3d-canvas"></div>`;

      try {
        // When
        getCanvas(document.querySelector("#view3d-canvas") as HTMLElement);
        expect(true).toBeFalsy(); // it should fail when it doesn't throw an error
      } catch (e) {
        // Then
        expect(e.code).toBe(ERROR.CODES.ELEMENT_NOT_CANVAS);
      }
    });
  });

  describe("range", () => {
    it("should return value correctly", () => {
      // Given
      const expected = [0, 1, 2, 3, 4];

      // When
      const real = [...range(5)];

      // Then
      expect(real).toStrictEqual(expected);
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
      expect(real).toStrictEqual(expected);
    });
  });

  describe("clamp", () => {
    it("should clamp value to minimum if the given value is equal or smaller than range minimum", () => {
      // Given
      const values = [0, -1, -4, -100, -1000];

      // When
      const clamped = values.map(val => clamp(val, 0, 100));

      // Then
      expect(clamped.every(val => val === 0)).toBeTruthy();
    });

    it("should clamp value to maximum if the given value is equal or bigger than range maximum", () => {
      // Given
      const values = [100, 101, 104, 200, 1000];

      // When
      const clamped = values.map(val => clamp(val, 0, 100));

      // Then
      expect(clamped.every(val => val === 100)).toBeTruthy();
    });

    it("should return original value when it's between range minimum and maximum", () => {
      // Given
      const values = [-100, -1, 0, 1, 100];

      // When
      const clamped = values.map(val => clamp(val, -100, 100));

      // Then
      expect(values).toStrictEqual(clamped);
    });
  });

  describe("findIndex", () => {
    it("can find correct index in the array", () => {
      // Given
      const array = [1, 2, 3, 4, 5];

      // When
      const index = findIndex(2, array);

      // Then
      expect(index).toBe(1);
    });

    it("should return index of first element found", () => {
      // Given
      const array = [1, 2, 2, 2, 2];

      // When
      const index = findIndex(2, array);

      // Then
      expect(index).toBe(1);
    });

    it("should return -1 when it couldn't find element", () => {
      // Given
      const array = [0, 1, 2, 3, 4];

      // When
      const index = findIndex(5, array);

      // Then
      expect(index).toBe(-1);
    });
  });
});
