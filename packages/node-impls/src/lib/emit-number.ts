import { NodeImplBuilder } from "@flower/interfaces"

export class EmitNumberCustomElement extends HTMLElement {
  number = 0;
  numberInput = document.createElement('input');

  constructor() {
    super();
    this.numberInput.setAttribute("type", "number");
    this.number = parseFloat(this.getAttribute('number') || '0');
    this.numberInput.value = this.number.toString();
  }

  connectedCallback() {
    this.initShadowDom();
  }

  initShadowDom() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(this.numberInput);
  }
}

export const EmitNumberImplBuilder: NodeImplBuilder<number> = (defaultState = 0) => ({
  name: 'EmitNumber',
  internalState: defaultState,
  activation: (internalState) => ([['num', internalState]]),
  interface: {
    tag: 'edit-number-interface',
    customElement: EmitNumberCustomElement
  },
  outputs: [{ name: 'num', type: 'number' }]
})