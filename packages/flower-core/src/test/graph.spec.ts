import * as graph from '../lib/graph';
import { deepStrictEqual } from 'assert';
import * as fp from 'fp-ts';
import * as Codec from 'io-ts/Codec';

const node1 = { id: 'n1', impl: 'null' };
const node2 = { id: 'n2', impl: 'null' };
const node3 = { id: 'n3', impl: 'null' };
const node4 = { id: 'n4', impl: 'null' };
const node5 = { id: 'n5', impl: 'null' };
const edge1 = {
  from: { node: 'n1', port: 'null' },
  to: { node: 'n2', port: 'null' },
};
const edge2 = {
  from: { node: 'n1', port: 'null' },
  to: { node: 'n2', port: 'null' },
};
const edge3 = {
  from: { node: 'n1', port: 'null' },
  to: { node: 'n2', port: 'null' },
};

describe('index', () => {
  describe('Constructors', () => {
    describe('empty', () => {
      it('should return an empty graph', () => {
        deepStrictEqual(fp.function.pipe(graph.empty(), graph.entries), {
          nodes: [],
          edges: [],
        });
      });
    });
    // describe('fromGraphDefinition', () => {
    //   it('should return an graph from a graph definition', () => {
    //     deepStrictEqual(
    //       fp.function.pipe(
    //         graph.fromGraphDefinition(),
    //         graph.entries
    //       ),
    //       {
    //         nodes: [],
    //         edges: [],
    //       }
    //     );
    //   });
    // });
  });

  describe('Combinators', () => {
    describe('insertNode', () => {
      it('should add new nodes', () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty(),
            graph.insertNode(node1),
            graph.insertNode(node2),
            graph.entries
          ),
          {
            nodes: [["n1", node1], ["n2", node2]],
            edges: [],
          }
        );
      });

      it('should update an existing node', () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty(),
            graph.insertNode(node1),
            graph.insertNode(node1),
            graph.entries
          ),
          {
            nodes: [["n1", node1]],
            edges: [],
          }
        );
      });
    });

    describe('modifyAtEdge', () => {
      it('should modify an existing edge', () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty(),
            graph.insertNode(node1),
            graph.insertNode(node2),
            fp.option.of,
            fp.option.chain(graph.insertEdge('n1', 'n2', edge1)),
            fp.option.chain(graph.modifyAtEdge('n1', 'n2', (e) => edge2)),
            fp.option.map(graph.edgeEntries)
          ),
          fp.option.some([[{ from: 'n1', to: 'n2' }, edge2]])
        );
      });

      it('should not modify a non-existing edge', () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty(),
            graph.insertNode(node1),
            graph.insertNode(node2),
            fp.option.of,
            fp.option.chain(graph.insertEdge('n1', 'n2', edge1)),
            fp.option.chain(graph.modifyAtEdge('n2', 'n1', (e) => edge2)),
            fp.option.map(graph.edgeEntries)
          ),
          fp.option.none
        );
      });
    });

    describe('modifyAtNode', () => {
      it('should modify an existing node', () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty(),
            graph.insertNode(node1),
            graph.insertNode(node2),
            graph.modifyAtNode('n2', (n) => node3),
            fp.option.map(graph.nodeEntries)
          ),
          fp.option.some([['n1', node1], ['n2', node3]])
        );
      });

      it("shouldn't modify a non-existing node", () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty(),
            graph.insertNode(node1),
            graph.insertNode(node2),
            graph.modifyAtNode('n3', (n) => node1),
            fp.option.map(graph.nodeEntries)
          ),
          fp.option.none
        );
      });
    });
  });

  describe('insertEdge', () => {
    it('should insert an edge between existing nodes', () => {
      deepStrictEqual(
        fp.function.pipe(
          graph.empty(),
          graph.insertNode(node1),
          graph.insertNode(node2),
          graph.insertEdge('n1', 'n2', edge1),
          fp.option.map(graph.entries)
        ),
        fp.option.some({
          nodes: [['n1', node1], ['n2', node2]],
          edges: [[{ from: 'n1', to: 'n2' }, edge1]],
        })
      );
    });

    it('should insert an edges in both directions between two nodes', () => {
      deepStrictEqual(
        fp.function.pipe(
          graph.empty(),
          graph.insertNode(node1),
          graph.insertNode(node2),
          fp.option.of,
          fp.option.chain(graph.insertEdge('n1', 'n2', edge1)),
          fp.option.chain(graph.insertEdge('n2', 'n1', edge2)),
          fp.option.map(graph.entries)
        ),
        fp.option.some({
          nodes: [['n1', node1], ['n2', node2]],
          edges: [
            [{ from: 'n1', to: 'n2' }, edge1],
            [{ from: 'n2', to: 'n1' }, edge2],
          ],
        })
      );
    });

    it('should insert an edge from a node to itself', () => {
      deepStrictEqual(
        fp.function.pipe(
          graph.empty(),
          graph.insertNode(node1),
          graph.insertEdge('n1', 'n1', edge1),
          fp.option.map(graph.entries)
        ),
        fp.option.some({
          nodes: [['n1', node1]],
          edges: [[{ from: 'n1', to: 'n1' }, edge1]],
        })
      );
    });

    it('should not insert and edge to a non existent node', () => {
      deepStrictEqual(
        fp.function.pipe(
          graph.empty(),
          graph.insertNode(node1),
          graph.insertEdge('n1', 'n2', edge1),
          fp.option.map(graph.entries)
        ),
        fp.option.none
      );
    });

    it('prevents regression of incorrect incoming nodes', () =>
      deepStrictEqual(
        fp.function.pipe(
          graph.empty(),
          graph.insertNode(node1),
          graph.insertNode(node2),
          graph.insertNode(node3),
          graph.insertNode(node4),
          graph.insertNode(node5),
          fp.option.of,
          fp.option.chain(graph.insertEdge('n3', 'n1', edge1)),
          fp.option.chain(graph.insertEdge('n3', 'n2', edge2)),
          fp.option.chain(graph.insertEdge('n4', 'n3', edge3)),
          fp.option.chain(graph.insertEdge('n5', 'n3', edge3)),
          fp.option.chain((g) =>
            fp.function.pipe(
              g.nodes.get(Codec.string.encode('n3'), null),
              fp.option.fromNullable
            )
          ),
          fp.option.map((node) => ({
            data: node.node,
            incoming: node.incoming.toArray().sort(),
            outgoing: node.outgoing.toArray().sort(),
          }))
        ),
        fp.option.of({
          data: node3,
          incoming: ['n4', 'n5'],
          outgoing: ['n1', 'n2'],
        })
      ));
  });

  describe('mapEdge', () => {
    it("should map edge's type and values", () => {
      deepStrictEqual(
        fp.function.pipe(
          graph.empty(),
          graph.insertNode(node1),
          graph.insertNode(node2),
          graph.insertNode(node3),
          fp.option.of,
          fp.option.chain(graph.insertEdge('n1', 'n2', edge1)),
          fp.option.chain(graph.insertEdge('n2', 'n3', edge2)),
          fp.option.map((n) => `Edge ${n}`)
        ),
        fp.option.map(graph.entries)
      ),
        fp.option.some({
          nodes: [[node1], [node2], ['n3', 'Node 3']],
          edges: [
            [{ from: 'n1', to: 'n2' }, edge1],
            [{ from: 'n2', to: 'n3' }, edge2],
          ],
        });
    });
  });

  describe('mapNode', () => {
    it("should map nodes's type and values", () => {
      deepStrictEqual(
        fp.function.pipe(
          graph.empty(),
          graph.insertNode(node1),
          graph.insertNode(node2),
          fp.option.of,
          fp.option.chain(graph.insertEdge('n1', 'n2', edge1)),
          fp.option.map((n) => `Node ${n}`)
        ),
        fp.option.map(graph.entries)
      ),
        fp.option.some({
          nodes: [[node1], [node2]],
          edges: [[{ from: 'n1', to: 'n2' }, edge1]],
        });
    });
  });

  describe('nodeEntries', () => {
    it('should return all node entries (ids and values)', () => {
      deepStrictEqual(
        fp.function.pipe(
          graph.empty(),
          graph.insertNode(node1),
          graph.insertNode(node2),
          fp.option.of,
          fp.option.chain(graph.insertEdge('n1', 'n2', edge1)),
          fp.option.map(graph.nodeEntries)
        ),
        fp.option.some([['n1', node1], ['n2', node2]])
      );
    });
  });

  describe('edgeEntries', () => {
    it('should return all edge entries (edge ids and values)', () => {
      deepStrictEqual(
        fp.function.pipe(
          graph.empty(),
          graph.insertNode(node1),
          graph.insertNode(node2),
          graph.insertNode(node3),
          fp.option.of,
          fp.option.chain(graph.insertEdge('n1', 'n2', edge1)),
          fp.option.chain(graph.insertEdge('n2', 'n3', edge2)),
          fp.option.map((n) => `Node ${n}`)
        ),
        fp.option.map(graph.edgeEntries)
      ),
        fp.option.some([
          [{ from: 'n1', to: 'n2' }, edge1],
          [{ from: 'n2', to: 'n3' }, edge2],
        ]);
    });
  });

  describe('edgeEntries', () => {
    it('should return all node and edge entries', () => {
      deepStrictEqual(
        fp.function.pipe(
          graph.empty(),
          graph.insertNode(node1),
          graph.insertNode(node2),
          graph.insertNode(node3),
          fp.option.of,
          fp.option.chain(graph.insertEdge('n1', 'n2', edge1)),
          fp.option.chain(graph.insertEdge('n2', 'n3', edge2)),
          fp.option.map(graph.entries)
        ),
        fp.option.some({
          nodes: [['n1', node1], ['n2', node2], ['n3', node3]],
          edges: [
            [{ from: 'n1', to: 'n2' }, edge1],
            [{ from: 'n2', to: 'n3' }, edge2],
          ],
        })
      );
    });
  });

  describe('toDotFile', () => {
    it('should generate a valid dot file', () => {
      deepStrictEqual(
        fp.function.pipe(
          graph.empty(),
          graph.insertNode(node1),
          graph.insertNode(node2),
          graph.insertNode(node3),
          fp.option.of,
          fp.option.chain(graph.insertEdge('n1', 'n2', edge1)),
          fp.option.chain(graph.insertEdge('n2', 'n3', edge2)),
          fp.option.map(graph.toDotFile(fp.function.identity))
        ),
        fp.option.some(`digraph {
"n1" [label="Node 1"]
"n2" [label="Node 2"]
"n3" [label="Node 3"]
"n1" -> "n2" [label="Edge 1"]
"n2" -> "n3" [label="Edge 2"]
}`)
      );
    });
  });

  describe('Utils', () => {
    describe('lookupEdge', () => {
      it('should return an existing edge', () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty(),
            graph.insertNode(node1),
            graph.insertNode(node2),
            graph.insertNode(node3),
            fp.option.of,
            fp.option.chain(graph.insertEdge('n1', 'n2', edge1)),
            fp.option.chain(graph.insertEdge('n2', 'n3', edge2)),
            fp.option.chain(graph.lookupEdge('n1', 'n2'))
          ),
          fp.option.some(edge1)
        );
      });

      it('should return none for non-existing edge', () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty(),
            graph.insertNode(node1),
            graph.insertNode(node2),
            graph.insertNode(node3),
            fp.option.of,
            fp.option.chain(graph.insertEdge('n1', 'n2', edge1)),
            fp.option.chain(graph.insertEdge('n2', 'n3', edge2)),
            fp.option.chain(graph.lookupEdge('n3', 'n2'))
          ),
          fp.option.none
        );
      });
    });

    describe('lookupNode', () => {
      it('should return an existing node value', () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty(),
            graph.insertNode(node1),
            graph.lookupNode('n1')
          ),
          fp.option.some(node1)
        );
      });

      it('should lookup none for non-existing node', () => {
        deepStrictEqual(
          fp.function.pipe(
            graph.empty(),
            graph.insertNode(node1),
            graph.lookupNode('n2')
          ),
          fp.option.none
        );
      });
    });
  });
});
