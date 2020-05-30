import { ActivationFn, INodeImpl } from "@plexius/flower-interfaces";
const activationFunction: ActivationFn = (inputs) => {
  const sum = inputs.get("a") + inputs.get("b");
  return Promise.resolve(new Map([["sum", sum]]));
};
const specification: INodeImpl = {
  activationFunction,
  inputs: {
    a: {
      label: "var a",
      type: "number",
    },
    b: {
      label: "var b",
      type: "number",
    },
  },
  outputs: {
    sum: {
      label: "a + b",
      type: "number",
    },
  },
  type: "addition",
};
export default specification;
