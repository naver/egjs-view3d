import View3DError from "~/View3DError";

describe("View3DError", () => {
  it("should include code in it", () => {
    // Given
    const testMessage = "I AM ERROR";
    const testCode = 426;

    // When
    const error = new View3DError(testMessage, testCode);

    // Then
    expect(error.code).toBe(testCode);
  });

  it("should include inherited properties(message, stack) in it", () => {
    // Given
    const testMessage = "I AM ERROR";
    const testCode = 426;

    // When
    const error = new View3DError(testMessage, testCode);

    // Then
    expect(error.message).toBe(testMessage);
    expect(error.stack).not.toBeUndefined();
  });
});
