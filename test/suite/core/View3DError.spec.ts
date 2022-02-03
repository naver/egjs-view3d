import View3DError from "~/core/View3DError";

describe("View3DError", () => {
  it("should include code in it", () => {
    const testMessage = "I AM ERROR";
    const testCode = 123456789;

    const error = new View3DError(testMessage, testCode);

    expect(error.code).to.equal(testCode);
  });

  it("should include inherited properties(message, stack) in it", () => {
    const testMessage = "I AM ERROR";
    const testCode = 987654321;

    const error = new View3DError(testMessage, testCode);

    expect(error.message).to.equal(testMessage);
    expect(error.stack).not.to.be.undefined;
  });
});
