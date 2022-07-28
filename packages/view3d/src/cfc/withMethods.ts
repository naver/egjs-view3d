import Component from "@egjs/component";
import View3D from "../View3D";

const withMethods = (prototype: any, attr: string) => {
  [Component.prototype, View3D.prototype].forEach(proto => {
    Object.getOwnPropertyNames(proto).filter(name => !prototype[name] && !name.startsWith("_") && name !== "constructor")
      .forEach((name: string) => {
        const descriptor = Object.getOwnPropertyDescriptor(proto, name)!;

        if (descriptor.value) {
          // Public Function
          Object.defineProperty(prototype, name, {
            value: function(...args) {
              return descriptor.value.call(this[attr], ...args);
            }
          });
        } else {
          const getterDescriptor: { get?: () => any; set?: (val: any) => void } = {};
          if (descriptor.get) {
            getterDescriptor.get = function() {
              return descriptor.get?.call(this[attr]);
            };
          }
          if (descriptor.set) {
            getterDescriptor.set = function(...args) {
              return descriptor.set?.call(this[attr], ...args);
            };
          }

          Object.defineProperty(prototype, name, getterDescriptor);
        }
      });
  });
};

export default withMethods;
