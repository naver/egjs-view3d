View3D will throw its own defined custom error with error code.
You can handle it with the `code` value of the error.
See [Error Codes](Constants.html#.ERROR_CODES) that can be thrown.

```ts
import View3D, { ERROR_CODES } from "@egjs/view3d";

try {
  const view3d = new View3D("#wrapper")
} catch (e) {
  if (e.code === ERROR_CODES.ELEMENT_NOT_FOUND) {
    console.error("Element not found")
  }
}
```
