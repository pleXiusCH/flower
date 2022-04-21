import { NodeImplBuilder } from '@flower/interfaces';
import {
  html,
  css,
  LitElement,
  PropertyDeclarations,
} from 'lit';

export class MessageInterface extends LitElement {
  static styles = css``;

  static properties: PropertyDeclarations = {
    nodeState: {
      type: String,
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

export const MessageImplBuilder: NodeImplBuilder<string> = (
  defaultState = "My message..."
) => ({
  name: 'Message',
  internalState: defaultState,
  activation: (internalState) => [['num', internalState]],
  interface: {
    tag: 'message-interface',
    customElement: MessageInterface,
  },
  inputs: [{ id: 'convo', dataType: 'Convo', label: 'Convo' }],
  outputs: [{ id: 'action', dataType: 'string', label: 'Action' }],
});
