export const getValidVueProps = (propsObj: any) => {
  return Object.keys(propsObj).reduce((props, propName) => {
    if (propsObj[propName] != null) {
      props[propName] = propsObj[propName];
    }

    return props;
  }, {});
};
