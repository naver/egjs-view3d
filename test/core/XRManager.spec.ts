import * as sinon from "sinon";
import View3D from "~/View3D";
import XRManager from "~/core/XRManager";
import XRSessionMock from "../xr/XRSessionMock";

describe("XRManager", () => {
  describe("Default properties", () => {
    it("has no sessions attached to it", () => {
      expect(new XRManager(new View3D(document.createElement("canvas"))).sessions).to.deep.equal([]);
    });

    it("has current session as null", () => {
      expect(new XRManager(new View3D(document.createElement("canvas"))).currentSession).to.be.null;
    });
  });

  describe("isAvailable", () => {
    it("is not available when there's no sessions attached to it", async () => {
      // Given
      const manager = new XRManager(new View3D(document.createElement("canvas")));

      // When
      const isAvailable = await manager.isAvailable();

      // Then
      expect(isAvailable).to.be.false;
    });

    it("is available when a single session is available", async () => {
      // Given
      const manager = new XRManager(new View3D(document.createElement("canvas")));
      manager.addSession(new XRSessionMock({ isAvailable: false }));
      manager.addSession(new XRSessionMock({ isAvailable: true }));
      manager.addSession(new XRSessionMock({ isAvailable: false }));

      // When
      const isAvailable = await manager.isAvailable();

      // Then
      expect(isAvailable).to.be.true;
    });

    it("is not available when all sessions are not available", async () => {
      // Given
      const manager = new XRManager(new View3D(document.createElement("canvas")));
      manager.addSession(new XRSessionMock({ isAvailable: false }));
      manager.addSession(new XRSessionMock({ isAvailable: false }));
      manager.addSession(new XRSessionMock({ isAvailable: false }));

      // When
      const isAvailable = await manager.isAvailable();

      // Then
      expect(isAvailable).to.be.false;
    });
  });

  it("should have session added in property sessions", () => {
    // Given
    const manager = new XRManager(new View3D(document.createElement("canvas")));
    const session = new XRSessionMock({ isAvailable: false });

    // When
    manager.addSession(session);

    // Then
    expect(manager.sessions).to.include(session);
  });

  describe("enter", () => {
    it("should be rejected with one error when there're no sessions", async () => {
      // Given
      const manager = new XRManager(new View3D(document.createElement("canvas")));

      // When
      await manager.enter()
        .then(() => {
          // Should not reach here
          expect("Success").to.be.false;
        })
        .catch(e => {
          // Then
          expect(e.length).to.equal(1);
          expect(e[0]).to.be.instanceOf(Error);
        });
    });

    it("should be rejected when all sessions are not available", async () => {
      // Given
      const manager = new XRManager(new View3D(document.createElement("canvas")));
      manager.addSession(new XRSessionMock({ isAvailable: false }));
      manager.addSession(new XRSessionMock({ isAvailable: false }));
      manager.addSession(new XRSessionMock({ isAvailable: false }));

      // When
      await manager.enter()
        .then(() => {
          // Should not reach here
          expect("Success").to.be.false;
        })
        .catch(e => {
          // Then
          expect(e.length).to.equal(1);
          expect(e[0]).to.be.instanceOf(Error);
        });
    });

    it("should be rejected with failed reasons when all sessions failed to enter", async () => {
      // Given
      const manager = new XRManager(new View3D(document.createElement("canvas")));
      manager.addSession(new XRSessionMock({ canEnter: false }));
      manager.addSession(new XRSessionMock({ canEnter: false }));
      manager.addSession(new XRSessionMock({ canEnter: false }));

      // When
      await manager.enter()
        .then(() => {
          // Should not reach here
          expect("Success").to.be.false;
        })
        .catch(e => {
          // Then
          expect(e.length).to.equal(3);
        });
    });

    it("should call enter of first session that is available", async () => {
      // Given
      const manager = new XRManager(new View3D(document.createElement("canvas")));
      const session1 = new XRSessionMock({ isAvailable: false });
      const session2 = new XRSessionMock({ isAvailable: true });
      const session3 = new XRSessionMock({ isAvailable: false });
      const enterSpies = [sinon.spy(session1, "enter"), sinon.spy(session2, "enter"), sinon.spy(session3, "enter")];

      manager.addSession(session1);
      manager.addSession(session2);
      manager.addSession(session3);

      // When
      await manager.enter();

      // Then
      expect(enterSpies[0].called).to.be.false;
      expect(enterSpies[1].calledOnce).to.be.true;
      expect(enterSpies[2].called).to.be.false;
    });
  });

  describe("exit", () => {
    it("should call exit of current entering session", async () => {
      // Given
      const manager = new XRManager(new View3D(document.createElement("canvas")));
      const session = new XRSessionMock({ isAvailable: true });

      manager.addSession(session);
      await manager.enter();

      // When
      const exitSpy = sinon.spy(session, "exit");
      manager.exit();

      // Then
      expect(exitSpy.calledOnce).to.be.true;
    });
  });
});
