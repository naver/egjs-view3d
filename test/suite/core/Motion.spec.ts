import Motion from "~/core/Motion";
import * as DEFAULT from "~/const/default";

describe("Motion", () => {
  describe("Initial state", () => {
    it("has initial state equal to given paramters", () => {
      const duration = 100;
      const range = { min: -1000, max: 1000 };
      const easing = (x: number) => x;

      const motion = new Motion({ duration, range, easing });

      expect(motion.range).to.equal(range);
      expect(motion.duration).to.equal(duration);
      expect(motion.val).to.equal(0);
    });

    it("has initial progress 0", () => {
      // Given & When
      const motion = new Motion({ duration: 100, range: { min: 0, max: 1 }, easing: (x: number) => x });

      expect(motion.progress).to.equal(0);
    });
  });

  describe("End point setting", () => {
    it("should set progress to 0 after calling it", () => {
      // Givne
      const motion = new Motion({ duration: 100, range: { min: 0, max: 100}, easing: x => x });

      motion.setEndDelta(100);
      motion.update(50);
      const progressBeforeCall = motion.progress;
      motion.setEndDelta(100);
      const progressAfterCall = motion.progress;

      expect(progressBeforeCall).not.to.equal(0);
      expect(progressAfterCall).to.equal(0);
    });

    it("should clamp new end to range maximum", () => {
      const range = { min: 0, max: 200 };
      const duration = 100;
      const motion = new Motion({ duration, range, easing: x => x });

      motion.setEndDelta(range.max + 100);
      const newEndPoint = motion.end;
      const progressBeforeUpdate = motion.progress;
      motion.update(duration + 100); // Make sure progress is 1
      const progressAfterUpdate = motion.progress;

      expect(progressBeforeUpdate).to.equal(0);
      expect(progressAfterUpdate).to.equal(1);
      expect(newEndPoint).to.equal(range.max);
    });

    it("should clamp new end to range minimum", () => {
      const range = { min: 0, max: 200 };
      const duration = 100;
      const motion = new Motion({ duration, range, easing: x => x });
      motion.reset(range.max);

      const rangeDiff = range.max - range.min;
      motion.setEndDelta(-(rangeDiff + 100));
      const newEndPoint = motion.end;
      const progressBeforeUpdate = motion.progress;
      motion.update(duration + 100); // Make sure progress is 1
      const progressAfterUpdate = motion.progress;

      expect(progressBeforeUpdate).to.equal(0);
      expect(progressAfterUpdate).to.equal(1);
      expect(newEndPoint).to.equal(range.min);
    });
  });

  describe("Update", () => {
    it("should return delta 0 when end delta is not set", () => {
      const motion = new Motion({ duration: 500, range: { min: 100, max: 200 } });

      const progressBeforeUpdate = motion.progress; // As setEndDelta is not called yet, progress is 1
      const delta = motion.update(100);
      const progressAfterUpdate = motion.progress;

      expect(progressBeforeUpdate).to.equal(0);
      expect(progressAfterUpdate).to.equal(0);
      expect(delta).to.equal(0);
    });

    it("should update progress by time, and value by easing", () => {
      const easing = DEFAULT.EASING;
      const motion = new Motion({ duration: 200, range: { min: 100, max: 200 }, easing });

      motion.reset(100);
      motion.setEndDelta(100);
      const valueBeforeUpdate = motion.val;
      const progressBeforeUpdate = motion.progress;
      motion.update(100); // progressed: 100, total: 200
      const valueAfterUpdate = motion.val;
      const progressAfterUpdate = motion.progress;

      const expectedProgress = 0.5;
      const expectedValue = motion.start + (motion.end - motion.start) * easing(expectedProgress);
      expect(progressBeforeUpdate).to.equal(0);
      expect(progressAfterUpdate).to.equal(expectedProgress);
      expect(valueBeforeUpdate).to.equal(motion.start);
      expect(valueAfterUpdate).to.equal(expectedValue);
    });
  });

  describe("Reset", () => {
    it("should reset internal values to given parameter", () => {
      const motion = new Motion({ duration: 100, range: { min: 0, max: 200 }, easing: x => x });

      const resetVal = 50;
      motion.reset(resetVal);

      expect(motion.start).to.equal(resetVal);
      expect(motion.end).to.equal(resetVal);
      expect(motion.val).to.equal(resetVal);
    });

    it("should clamp given parameter to its range", () => {
      const range = { min: 0, max: 200 };
      const motion = new Motion({ duration: 100, range, easing: x => x });

      const resetVal = range.min - 100; // Less than range min
      motion.reset(resetVal);

      expect(motion.start).to.equal(range.min);
      expect(motion.end).to.equal(range.min);
      expect(motion.val).to.equal(range.min);
    });
  });
});
