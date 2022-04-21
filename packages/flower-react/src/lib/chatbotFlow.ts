import ReactFlow, { Node, Edge, Position } from 'react-flow-renderer';

import { ConvoImplBuilder, MessageImplBuilder, QuestionImplBuilder } from '@flower/node-impls';

export const initialNodes: Node[] = [
  {
    id: '0',
    data: {
      threadName: 'entry',
      nodeImplementation: ConvoImplBuilder(),
    },
    type: 'chatbotNode',
    position: { x: 0, y: 0 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '1',
    data: {
      threadName: 'greeting',
      nodeImplementation: MessageImplBuilder('Foo'),
    },
    type: 'chatbotNode',
    position: { x: 400, y: 0 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '2',
    data: {
      threadName: 'ask_question',
      nodeImplementation: QuestionImplBuilder({
        text: "U feel good?",
        replies: [
          {
            reply: "Ya man!",
            goto: "feel_good"
          },
          {
            reply: "Nah!",
            goto: "feel_bad"
          }
        ]
      }),
    },
    type: 'chatbotNode',
    position: { x: 800, y: 0 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
];

export const initialEdges: Edge[] = [
  {
    id: 'e1',
    source: '0',
    sourceHandle: 'convo',
    target: '1',
    targetHandle: 'convo',
  },
  {
    id: 'e2',
    source: '1',
    sourceHandle: 'action',
    target: '2',
    targetHandle: 'convo',
  },
];
