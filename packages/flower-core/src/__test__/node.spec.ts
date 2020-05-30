import { INodeImpl, SideEffectsFn } from "@plexius/flower-interfaces";
import Node from '../node';

const testNodeImpl: INodeImpl = {
  type: 'test',
  activationFunction: () => Promise.resolve(new Map())
};

test('should create a node instance', () => {
  const node = new Node(testNodeImpl);
  expect(node).toBeInstanceOf(Node);
});

test('shoud set a new simple state inside a node', done => {
  const node = new Node(testNodeImpl);
  const newState = 1;
  node.setState(newState).subscribe(state => {
    expect(state).toBe(newState);
    done();
  });
});

test('shoud set a new state object inside a node', done => {
  const node = new Node(testNodeImpl);
  const newState = { active: true };
  node.setState(newState).subscribe(state => {
    expect(state).toBeInstanceOf(Object);
    expect(state).toStrictEqual(newState);
    done();
  });
});

test('shoud get the default node state as observable', done => {
  const node = new Node(testNodeImpl);
  node.getState$().subscribe(state => {
    expect(state).toBeNull();
    done();
  });
});

test('shoud patch the current state inside a node', done => {
  const node = new Node(testNodeImpl);
  const state = { primary: true };
  const newState = { secondary: true };
  node.setState(state);
  node.patchState(newState)
  node.getState$().subscribe(state => {
    expect(state).toStrictEqual({...state, ...newState});
    done();
  });
});

test('shoud set a new side-effects function of a node', done => {
  const node = new Node(testNodeImpl);
  const sideEffectsFn: SideEffectsFn = (props) => {
    props.setState({ newSideEffectsFn: true });
  };
  node.setSideEffectsFunction(sideEffectsFn);
  node.setState(false);
  node.getState$().subscribe((state) => {
    if (state) {
      expect(state).toStrictEqual({ newSideEffectsFn: true });
      done();
    } 
  });
});