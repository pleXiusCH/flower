import { NodeImplBuilder } from '@flower/interfaces';
import {
  html,
  css,
  LitElement,
  PropertyDeclarations,
} from 'lit';

export class ConvoInterface extends LitElement {
  static styles = css``;

  static properties: PropertyDeclarations = {
    nodeState: {
      type: Object,
    },
  };

  render() {
    return html`
      <textarea>
        ${this.getAttribute("nodeState")}
      </textarea>
    `;
  }
}

export const ConvoImplBuilder: NodeImplBuilder<unknown> = (
  defaultState = {}
) => ({
  name: 'Convo',
  internalState: defaultState,
  activation: (internalState) => [['convo', internalState]],
  interface: {
    tag: 'convo-interface',
    customElement: ConvoInterface,
  },
  outputs: [{ id: 'convo', dataType: 'Convo', label: 'Convo' }],
});
