import { html, render } from "lit-html";
import { ActivationFn, INodeImpl, SideEffectsFn } from "@plexius/flower-interfaces";

const activationFunction: ActivationFn = () => {
  return Promise.resolve(new Map());
};

const sideEffectsFunction: SideEffectsFn = (props) => {
  try {
    let template = props.state && props.state.htmlTemplate;
    if (!template) {
      template = (data: any) => html`
        <textarea>${JSON.stringify(data)}</textarea>
      `;
      props.patchState({ htmlTemplate: template });
    }
    if (props.state && props.state.renderTarget) {
      render(template(props.inputs.get("data")), props.state.renderTarget);
    }
  } catch (err) {
    console.error(err);
  }
};

const specification: INodeImpl = {
  type: "tap",
  activationFunction,
  sideEffectsFunction,
  inputs: {
    data: {
      label: "data",
      type: "any",
    },
  },
  outputs: {},
};
export default specification;
