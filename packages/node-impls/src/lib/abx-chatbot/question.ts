import { NodeImplBuilder } from '@flower/interfaces';
import { html, css, LitElement, PropertyDeclarations, PropertyValues } from 'lit';

type NodeState = {
  text: string
  replies: Reply[]
}

type Reply = {
  reply: string
  goto: string
}

const _defaultState = {
  text: 'question?',
  replies: [
    {
      reply: 'answer!',
      goto: 'complete',
    },
  ],
}; 

export class QuestionInterface extends LitElement {
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
      <p>${this.nodeState.text}</p>
      <div>
        ${this.nodeState.replies.map(entry => html`
          <div>${entry.reply}</div>
        `)}
      </div>
    `;
  }
}

export const QuestionImplBuilder: NodeImplBuilder<NodeState> = (
  defaultState = _defaultState
) => ({
  name: 'Question',
  internalState: defaultState,
  activation: (internalState) => [['convo', internalState]],
  interface: {
    tag: 'question-interface',
    customElement: QuestionInterface,
  },
  inputs: [{ id: 'convo', dataType: 'Convo', label: 'Convo' }],
  outputs: [{ id: 'action', dataType: 'string', label: 'Action' }],
});
