afterEach(() => {
  const elements = [].slice.call(document.querySelectorAll("._tempSandbox_"));
  elements.forEach(v => v.parentNode.removeChild(v));
});
