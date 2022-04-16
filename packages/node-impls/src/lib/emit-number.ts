import { NodeImplBuilder } from '@flower/interfaces';
import {
  html,
  css,
  LitElement,
  PropertyDeclarations,
} from 'lit';

export class EmitNumberInterface extends LitElement {
  static styles = css``;

  static properties: PropertyDeclarations = {
    nodeState: {
      type: Number,
    },
  };

  render() {
    return html`
      <input type="number" value="${this.getAttribute("nodeState")}" />
    `;
  }
}

export const EmitNumberImplBuilder: NodeImplBuilder<number> = (
  defaultState = 0
) => ({
  name: 'EmitNumber',
  internalState: defaultState,
  activation: (internalState) => [['num', internalState]],
  interface: {
    tag: 'edit-number-interface',
    customElement: EmitNumberInterface,
  },
  outputs: [{ id: 'num', dataType: 'number', label: 'Number' }],
});
