import { NodeImplBuilder } from '@flower/interfaces';
import { html, css, LitElement, PropertyDeclarations } from 'lit';

type NodeState = {
  text: string
  replies: Reply[]
}

type Reply = {
  reply: string
  goto: string
}

export class QuestionInterface extends LitElement {
  static styles = css``;

  static properties: PropertyDeclarations = {
    nodeState: {
      type: Object,
    },
  };

  render() {
    console.log("THIS", this);
    return html` <p>${this.getAttribute("nodeState")}</p> `;
  }
}

export const QuestionImplBuilder: NodeImplBuilder<NodeState> = (
  defaultState = {
    text: 'question?',
    replies: [
      {
        reply: 'answer!',
        goto: 'complete',
      },
    ],
  }
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
