import EventEmitter from "~/core/EventEmitter";
import sinon from "sinon";
import { range } from "~/utils";

describe("EventEmitter", () => {
  describe("Listening events", () => {
    it("can emit event", () => {
      // Given
      const emitter = new EventEmitter<{ evt: void; }>();
      const spy = sinon.spy();
      emitter.on("evt", spy);

      // When
      emitter.emit("evt");

      // Then
      expect(spy.calledOnce).to.be.true;
    });

    it("can emit event with correct parameters", () => {
      // Given
      const emitter = new EventEmitter<{
        evt: (arg0: string, arg1: number, arg2: { a: number, b: string; }) => void;
      }>();
      const spy = sinon.spy();
      emitter.on("evt", spy);

      // When
      const arg0 = "SOME_STRING";
      const arg1 = Math.random();
      const arg2 = { a: Math.random(), b: "MEANINGLESS_STRING" };
      emitter.emit("evt", arg0, arg1, arg2);

      // Then
      expect(spy.calledOnceWith(arg0, arg1, arg2));
    });

    it("can attach multiple listeners to a single event", () => {
      // Given
      const emitter = new EventEmitter<{ evt: void; }>();
      const spies = range(100).map(() => sinon.spy());
      spies.forEach(spy => {
        emitter.on("evt", spy);
      });

      // When
      emitter.emit("evt");

      // Then
      expect(spies.every(spy => spy.calledOnce)).to.be.true;
    });

    it("can't attach same listener multiple to a single event", () => {
      // Given
      const emitter = new EventEmitter<{ evt: void; }>();
      const spy = sinon.spy();

      range(100).forEach(() => {
        emitter.on("evt", spy);
      });

      // When
      emitter.emit("evt");

      // Then
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe("Detaching listeners", () => {
    it("can detach event before emitting event", () => {
      // Given
      const emitter = new EventEmitter<{ evt: void; }>();
      const spy = sinon.spy();
      emitter.on("evt", spy);

      emitter.off("evt", spy);

      // When
      emitter.emit("evt");

      // Then
      expect(spy.called).to.be.false;
    });

    it("can detach event before emitting event", () => {
      // Given
      const emitter = new EventEmitter<{ evt: void; }>();
      const spy = sinon.spy();
      emitter.on("evt", spy);

      emitter.off("evt", spy);

      // When
      emitter.emit("evt");

      // Then
      expect(spy.called).to.be.false;
    });

    it("does not have effect when target event does not attached previously", () => {
      // Given
      const emitter = new EventEmitter<{ evt: void; }>();
      const spy = sinon.spy();
      emitter.emit("evt");

      // When
      emitter.on("evt", spy);

      // Then
      expect(spy.called).to.be.false;
    });

    it("can detach all events with given event name when no callback is provided", () => {
      // Given
      const emitter = new EventEmitter<{ evt: void; }>();
      const spies = range(100).map(() => sinon.spy());
      spies.forEach(spy => emitter.on("evt", spy));

      // When
      emitter.off("evt");
      emitter.emit("evt");

      // Then
      expect(spies.some(spy => spy.called)).to.be.false;
    });

    it("can detach all events when no event name is provided", () => {
      // Given
      const emitter = new EventEmitter<{
        evt0: void;
        evt1: void;
        evt2: void;
        evt3: void;
        evt4: void;
      }>();
      const spies = range(100).map(() => sinon.spy());
      spies.forEach((spy, i) => emitter.on(`evt${i % 5}` as any, spy));

      // When
      emitter.off();
      range(5).forEach(i => {
        emitter.emit(`evt${i}` as any);
      });

      // Then
      expect(spies.some(spy => spy.called)).to.be.false;
    });
  });
});
