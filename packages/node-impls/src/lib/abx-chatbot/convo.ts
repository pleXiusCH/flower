import { NodeImplBuilder } from '@flower/interfaces';
import {
  html,
  css,
  LitElement,
  PropertyDeclarations,
  PropertyValues,
} from 'lit';

export interface NodeState {
  analytics: boolean
  rating: boolean
  quickReply: string
  intents: string[]
}

const _defaultState = {
  analytics: true,
  rating: false,
  quickReply: "quick reply",
  intents: [
    "INTENT"
  ],
}

export class ConvoInterface extends LitElement {
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
      <div>
        <label for="test">Analytics: </label>
        <input id="test" type="checkbox" checked="${this.nodeState.analytics}">
      </div>
      <div>
        <label for="test">Rating: </label>
        <input id="test" type="checkbox" checked="${this.nodeState.rating}">
      </div>
    `;
  }
}

export const ConvoImplBuilder: NodeImplBuilder<NodeState> = (
  defaultState = _defaultState
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
