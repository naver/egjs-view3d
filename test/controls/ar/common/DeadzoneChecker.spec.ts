import * as THREE from "three";

import DeadzoneChecker from "~/controls/ar/common/DeadzoneChecker";
import * as TOUCH from "~/consts/touch";

describe("DeadzoneChecker", () => {
  describe("Initial properties", () => {
    it("should have default size of 0.1", () => {
      expect(new DeadzoneChecker().size).to.equal(0.1);
    });

    it("should not in deadzone at initialization", () => {
      expect(new DeadzoneChecker().inDeadzone).to.be.false;
    });

    it("has default aspect of 1", () => {
      // Given
      const deadzoneChecker = new DeadzoneChecker();
      const input = new THREE.Vector2(5, 5);

      // When
      deadzoneChecker.applyScreenAspect([input]);

      // Then
      expect(input).to.deep.equal(new THREE.Vector2(5, 5));
    });
  });

  describe("Options", () => {
    it("can set size at initialization", () => {
      expect(new DeadzoneChecker({ size: 10 }).size).to.equal(10);
    });

    it("can change size at any time", () => {
      // Given
      const deadzoneChecker = new DeadzoneChecker({ size: 1 });

      // When
      deadzoneChecker.size = 100;

      // Then
      expect(deadzoneChecker.size).to.equal(100);
    });
  });

  describe("aspect", () => {
    it("should apply given aspect to coord.x if aspect is lower than 1", () => {
      // Given
      const deadzoneChecker = new DeadzoneChecker();
      const input = new THREE.Vector2(5, 5);

      // When
      deadzoneChecker.setAspect(0.5);
      deadzoneChecker.applyScreenAspect([input]);

      // Then
      expect(input).to.deep.equal(new THREE.Vector2(10, 5));
    });

    it("should apply given aspect to coord.y if aspect is bigger than 1", () => {
      // Given
      const deadzoneChecker = new DeadzoneChecker();
      const input = new THREE.Vector2(5, 5);

      // When
      deadzoneChecker.setAspect(2);
      deadzoneChecker.applyScreenAspect([input]);

      // Then
      expect(input).to.deep.equal(new THREE.Vector2(5, 10));
    });
  });

  describe("Detecting a gesture", () => {
    describe("One finger horizontal", () => {
      const correctTestingGestures = [TOUCH.GESTURE.ONE_FINGER_HORIZONTAL, TOUCH.GESTURE.ONE_FINGER];
      const inCorrectTestingGestures = [TOUCH.GESTURE.NONE, TOUCH.GESTURE.ONE_FINGER_VERTICAL, TOUCH.GESTURE.TWO_FINGER, TOUCH.GESTURE.PINCH];

      correctTestingGestures.forEach(gesture => {
        it(`should return TOUCH.GESTURE.ONE_FINGER_HORIZONTAL if testing gesture ${TOUCH.GESTURE[gesture]} is added before`, () => {
          // Given
          const deadzoneChecker = new DeadzoneChecker({ size: 0.1 });

          // When
          deadzoneChecker.addTestingGestures(gesture);
          deadzoneChecker.setFirstInput([new THREE.Vector2(0, 0)]);
          const result = deadzoneChecker.check([new THREE.Vector2(1, 0)]);

          // Then
          expect(result).to.equal(TOUCH.GESTURE.ONE_FINGER_HORIZONTAL);
        });

        it(`should return TOUCH.GESTURE.NONE if testing gesture ${TOUCH.GESTURE[gesture]} is added before and it's in deadzone`, () => {
          // Given
          const deadzoneChecker = new DeadzoneChecker({ size: 1 });

          // When
          deadzoneChecker.addTestingGestures(gesture);
          deadzoneChecker.setFirstInput([new THREE.Vector2(0, 0)]);
          const result = deadzoneChecker.check([new THREE.Vector2(1, 0)]);

          // Then
          expect(result).to.equal(TOUCH.GESTURE.NONE);
        });
      });

      inCorrectTestingGestures.forEach(gesture => {
        it(`should return TOUCH.GESTURE.NONE if testing gesture ${TOUCH.GESTURE[gesture]} is added before`, () => {
          // Given
          const deadzoneChecker = new DeadzoneChecker({ size: 0.1 });

          // When
          deadzoneChecker.addTestingGestures(gesture);
          deadzoneChecker.setFirstInput([new THREE.Vector2(0, 0)]);
          const result = deadzoneChecker.check([new THREE.Vector2(1, 0)]);

          // Then
          expect(result).to.equal(TOUCH.GESTURE.NONE);
        });
      });
    });

    describe("One finger vertical", () => {
      const correctTestingGestures = [TOUCH.GESTURE.ONE_FINGER_VERTICAL, TOUCH.GESTURE.ONE_FINGER];
      const inCorrectTestingGestures = [TOUCH.GESTURE.NONE, TOUCH.GESTURE.ONE_FINGER_HORIZONTAL, TOUCH.GESTURE.TWO_FINGER, TOUCH.GESTURE.PINCH];

      correctTestingGestures.forEach(gesture => {
        it(`should return TOUCH.GESTURE.ONE_FINGER_VERTICAL if testing gesture ${TOUCH.GESTURE[gesture]} is added before`, () => {
          // Given
          const deadzoneChecker = new DeadzoneChecker({ size: 0.1 });

          // When
          deadzoneChecker.addTestingGestures(gesture);
          deadzoneChecker.setFirstInput([new THREE.Vector2(0, 0)]);
          const result = deadzoneChecker.check([new THREE.Vector2(0, 1)]);

          // Then
          expect(result).to.equal(TOUCH.GESTURE.ONE_FINGER_VERTICAL);
        });

        it(`should return TOUCH.GESTURE.NONE if testing gesture ${TOUCH.GESTURE[gesture]} is added before and it's in deadzone`, () => {
          // Given
          const deadzoneChecker = new DeadzoneChecker({ size: 1 });

          // When
          deadzoneChecker.addTestingGestures(gesture);
          deadzoneChecker.setFirstInput([new THREE.Vector2(0, 0)]);
          const result = deadzoneChecker.check([new THREE.Vector2(0, 1)]);

          // Then
          expect(result).to.equal(TOUCH.GESTURE.NONE);
        });
      });

      inCorrectTestingGestures.forEach(gesture => {
        it(`should return TOUCH.GESTURE.NONE if testing gesture ${TOUCH.GESTURE[gesture]} is added before`, () => {
          // Given
          const deadzoneChecker = new DeadzoneChecker({ size: 0.1 });

          // When
          deadzoneChecker.addTestingGestures(gesture);
          deadzoneChecker.setFirstInput([new THREE.Vector2(0, 0)]);
          const result = deadzoneChecker.check([new THREE.Vector2(0, 1)]);

          // Then
          expect(result).to.equal(TOUCH.GESTURE.NONE);
        });
      });
    });

    describe("Two finger horizontal", () => {
      const correctTestingGestures = [TOUCH.GESTURE.TWO_FINGER_HORIZONTAL, TOUCH.GESTURE.TWO_FINGER];
      const inCorrectTestingGestures = [TOUCH.GESTURE.NONE, TOUCH.GESTURE.TWO_FINGER_VERTICAL, TOUCH.GESTURE.ONE_FINGER, TOUCH.GESTURE.PINCH];

      correctTestingGestures.forEach(gesture => {
        it(`should return TOUCH.GESTURE.TWO_FINGER_HORIZONTAL if testing gesture ${TOUCH.GESTURE[gesture]} is added before`, () => {
          // Given
          const deadzoneChecker = new DeadzoneChecker({ size: 0.1 });

          // When
          deadzoneChecker.addTestingGestures(gesture);
          deadzoneChecker.setFirstInput([new THREE.Vector2(0, 1), new THREE.Vector2(0, -1)]);
          const result = deadzoneChecker.check([new THREE.Vector2(1, 1), new THREE.Vector2(1, -1)]);

          // Then
          expect(result).to.equal(TOUCH.GESTURE.TWO_FINGER_HORIZONTAL);
        });

        it(`should return TOUCH.GESTURE.NONE if testing gesture ${TOUCH.GESTURE[gesture]} is added before and it's in deadzone`, () => {
          // Given
          const deadzoneChecker = new DeadzoneChecker({ size: 1 });

          // When
          deadzoneChecker.addTestingGestures(gesture);
          deadzoneChecker.setFirstInput([new THREE.Vector2(0, 1), new THREE.Vector2(0, -1)]);
          const result = deadzoneChecker.check([new THREE.Vector2(1, 1), new THREE.Vector2(1, -1)]);

          // Then
          expect(result).to.equal(TOUCH.GESTURE.NONE);
        });
      });

      inCorrectTestingGestures.forEach(gesture => {
        it(`should return TOUCH.GESTURE.NONE if testing gesture ${TOUCH.GESTURE[gesture]} is added before`, () => {
          // Given
          const deadzoneChecker = new DeadzoneChecker({ size: 0.1 });

          // When
          deadzoneChecker.addTestingGestures(gesture);
          deadzoneChecker.setFirstInput([new THREE.Vector2(0, 1), new THREE.Vector2(0, -1)]);
          const result = deadzoneChecker.check([new THREE.Vector2(1, 1), new THREE.Vector2(1, -1)]);

          // Then
          expect(result).to.equal(TOUCH.GESTURE.NONE);
        });
      });
    });

    describe("Two finger vertical", () => {
      const correctTestingGestures = [TOUCH.GESTURE.TWO_FINGER_VERTICAL, TOUCH.GESTURE.TWO_FINGER];
      const inCorrectTestingGestures = [TOUCH.GESTURE.NONE, TOUCH.GESTURE.TWO_FINGER_HORIZONTAL, TOUCH.GESTURE.ONE_FINGER, TOUCH.GESTURE.PINCH];

      correctTestingGestures.forEach(gesture => {
        it(`should return TOUCH.GESTURE.TWO_FINGER_VERTICAL if testing gesture ${TOUCH.GESTURE[gesture]} is added before`, () => {
          // Given
          const deadzoneChecker = new DeadzoneChecker({ size: 0.1 });

          // When
          deadzoneChecker.addTestingGestures(gesture);
          deadzoneChecker.setFirstInput([new THREE.Vector2(1, 0), new THREE.Vector2(-1, 0)]);
          const result = deadzoneChecker.check([new THREE.Vector2(1, 1), new THREE.Vector2(-1, 1)]);

          // Then
          expect(result).to.equal(TOUCH.GESTURE.TWO_FINGER_VERTICAL);
        });

        it(`should return TOUCH.GESTURE.NONE if testing gesture ${TOUCH.GESTURE[gesture]} is added before and it's in deadzone`, () => {
          // Given
          const deadzoneChecker = new DeadzoneChecker({ size: 1 });

          // When
          deadzoneChecker.addTestingGestures(gesture);
          deadzoneChecker.setFirstInput([new THREE.Vector2(1, 0), new THREE.Vector2(-1, 0)]);
          const result = deadzoneChecker.check([new THREE.Vector2(1, 1), new THREE.Vector2(-1, 1)]);

          // Then
          expect(result).to.equal(TOUCH.GESTURE.NONE);
        });
      });

      inCorrectTestingGestures.forEach(gesture => {
        it(`should return TOUCH.GESTURE.NONE if testing gesture ${TOUCH.GESTURE[gesture]} is added before`, () => {
          // Given
          const deadzoneChecker = new DeadzoneChecker({ size: 0.1 });

          // When
          deadzoneChecker.addTestingGestures(gesture);
          deadzoneChecker.setFirstInput([new THREE.Vector2(1, 0), new THREE.Vector2(-1, 0)]);
          const result = deadzoneChecker.check([new THREE.Vector2(1, 1), new THREE.Vector2(-1, 1)]);

          // Then
          expect(result).to.equal(TOUCH.GESTURE.NONE);
        });
      });
    });

    describe("Pinch", () => {
      const correctTestingGestures = [TOUCH.GESTURE.PINCH];
      const inCorrectTestingGestures = [TOUCH.GESTURE.NONE, TOUCH.GESTURE.ONE_FINGER, TOUCH.GESTURE.TWO_FINGER];

      correctTestingGestures.forEach(gesture => {
        it(`should return TOUCH.GESTURE.PINCH if testing gesture ${TOUCH.GESTURE[gesture]} is added before`, () => {
          // Given
          const deadzoneChecker = new DeadzoneChecker({ size: 0.1 });

          // When
          deadzoneChecker.addTestingGestures(gesture);
          deadzoneChecker.setFirstInput([new THREE.Vector2(0, 0), new THREE.Vector2(0, 0)]);
          const result = deadzoneChecker.check([new THREE.Vector2(-1, -1), new THREE.Vector2(1, 1)]);

          // Then
          expect(result).to.equal(TOUCH.GESTURE.PINCH);
        });

        it(`should return TOUCH.GESTURE.NONE if testing gesture ${TOUCH.GESTURE[gesture]} is added before and it's in deadzone`, () => {
          // Given
          const deadzoneChecker = new DeadzoneChecker({ size: 5 });

          // When
          deadzoneChecker.addTestingGestures(gesture);
          deadzoneChecker.setFirstInput([new THREE.Vector2(0, 0), new THREE.Vector2(0, 0)]);
          const result = deadzoneChecker.check([new THREE.Vector2(-1, -1), new THREE.Vector2(1, 1)]);

          // Then
          expect(result).to.equal(TOUCH.GESTURE.NONE);
        });
      });

      inCorrectTestingGestures.forEach(gesture => {
        it(`should return TOUCH.GESTURE.NONE if testing gesture ${TOUCH.GESTURE[gesture]} is added before`, () => {
          // Given
          const deadzoneChecker = new DeadzoneChecker({ size: 0.1 });

          // When
          deadzoneChecker.addTestingGestures(gesture);
          deadzoneChecker.setFirstInput([new THREE.Vector2(0, 0), new THREE.Vector2(0, 0)]);
          const result = deadzoneChecker.check([new THREE.Vector2(-1, -1), new THREE.Vector2(1, 1)]);

          // Then
          expect(result).to.equal(TOUCH.GESTURE.NONE);
        });
      });
    });
  });
});
