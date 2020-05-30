import { ActivationFn, INodeImpl, SideEffectsFn } from "@plexius/flower-interfaces";
import { html, render, TemplateResult } from "lit-html";

export interface EmitNumberState {
  emitValue: number;
  htmlTemplate?: (value: number) => TemplateResult;
  renderTarget?: HTMLElement;
}

const activationFunction: ActivationFn<EmitNumberState> = (inputs, state) => {
  // console.log("activation emit", state);
  return Promise.resolve(new Map([["number", state.emitValue]]));
};

const sideEffectsFunction: SideEffectsFn<EmitNumberState> = (props) => {
  let template = props.state && props.state.htmlTemplate;
  if (!template) {
    const changeHandler = (e: Event & { target: { value: string } }) => {
      props.patchState({ emitValue: Number.parseFloat(e.target.value) });
    };
    template = (value: number) => html`
      <input type="number" value=${value} @change=${changeHandler} />
    `;
    props.patchState({ htmlTemplate: template });
  }
  try {
    if (props.state.renderTarget) {
      render(template(props.state.emitValue), props.state.renderTarget);
    }
  } catch (err) {
    console.warn(err);
  }
};

const specification: INodeImpl<EmitNumberState> = {
  type: "emit-number",
  activationFunction,
  sideEffectsFunction,
  initialState: {
    emitValue: 1,
  },
  outputs: {
    number: {
      label: "number",
      type: "number",
    },
  },
};
export default specification;
