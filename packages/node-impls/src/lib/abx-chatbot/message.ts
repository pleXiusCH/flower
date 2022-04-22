import { NodeImplBuilder } from '@flower/interfaces';
import {
  html,
  css,
  LitElement,
  PropertyDeclarations,
  PropertyValues,
} from 'lit';

const _defaultState = "Message.."

export class MessageInterface extends LitElement {
  static styles = css``;

  static properties: PropertyDeclarations = {
    nodestate: {},
  };

  private nodeState = _defaultState;

  updated(changed: PropertyValues) {
    if (
      changed.has('nodestate') &&
      typeof this.getAttribute('nodestate') === 'string'
    ) {
      this.nodeState = JSON.parse(this.getAttribute('nodestate') || "");
      this.requestUpdate();
    }
  }

  render() {
    return html`
      <textarea>
        ${this.nodeState}
      </textarea>
    `;
  }
}

export const MessageImplBuilder: NodeImplBuilder<string> = (
  defaultState = _defaultState
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
