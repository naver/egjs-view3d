const viewer = document.querySelector("model-viewer");

console.time("load");
const start = Date.now();
viewer.addEventListener("load", () => {
  console.timeEnd("load");
  const end = Date.now();
  document.querySelector("#result").innerHTML = `${end - start}ms`;
});
