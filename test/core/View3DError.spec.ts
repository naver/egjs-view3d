import View3DError from "~/View3DError";

describe("View3DError", () => {
  it("should include code in it", () => {
    // Given
    const testMessage = "I AM ERROR";
    const testCode = 123456789;

    // When
    const error = new View3DError(testMessage, testCode);

    // Then
    expect(error.code).to.equal(testCode);
  });

  it("should include inherited properties(message, stack) in it", () => {
    // Given
    const testMessage = "I AM ERROR";
    const testCode = 987654321;

    // When
    const error = new View3DError(testMessage, testCode);

    // Then
    expect(error.message).to.equal(testMessage);
    expect(error.stack).not.to.be.undefined;
  });
});
