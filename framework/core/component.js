import { patch } from "./vDom";

export const createComponent = ({
  template,
  state = {},
  methods = {},
  onLoad = () => null
}) => {
  let previous;

  const mappedMethods = props =>
    Object.keys(methods).reduce(
      (acc, key) => ({
        ...acc,
        [key]: (...args) => {
          state = { ...methods[key](state, ...args) };
          const newNode = template({
            ...state,
            ...props,
            methods: mappedMethods(props)
          });
          patch(previous.element, newNode.element);
          previous = newNode;
        }
      }),
      {}
    );

  return (props = {}) => {
    const methods = mappedMethods(props);
    previous = template({ ...state, ...props, methods });

    if (onLoad) {
      onLoad(methods);
    }

    return previous;
  };
};
