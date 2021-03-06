import Flower from "../flower";
import Graph from "../graph";
import { createAdditionGraph } from "./utilities";

let flower: Flower;
beforeEach(() => {
  flower = new Flower();
});

test('should add empty graph', () => {
  expect(flower.getGraphs()).toBeInstanceOf(Map);
  expect(flower.getGraphs().size).toBe(0);
  const graph = flower.addGraph();
  expect(flower.getGraphs().size).toBe(1);
  expect(graph instanceof Graph).toBeTruthy();
});

test('should add graph instance', () => {
  const [additionGraph] = createAdditionGraph();
  expect(flower.getGraphs().size).toBe(0)
  const flowerGraph = flower.addGraph(additionGraph);
  expect(flower.getGraphs().size).toBe(1);
  expect(flowerGraph).toEqual(additionGraph);
});

test('should get graph by uuid or throw', () => {
  const graph = flower.addGraph();
  expect(graph).toBeInstanceOf(Graph);
  expect(flower.getGraph(graph!.getUuid())).toStrictEqual(graph);
  expect(() => flower.getGraph('foo')).toThrow(/no graph present/i);
});

test('should remove graph by uuid or throw', () => {
  const [additionGraph] = createAdditionGraph();
  const graph = flower.addGraph(additionGraph);
  expect(graph).toBeInstanceOf(Graph);
  expect(flower.getGraphs().size).toBe(1);
  expect(() => flower.removeGraph('foo')).toThrow(/no graph present/i);
  expect(flower.removeGraph(graph!.getUuid())).toBeTruthy();
  expect(flower.getGraphs().size).toBe(0);
});

test('should execute an active graph by uuid or throw', async () => {
  const graph = flower.addGraph();
  expect(flower.getGraphs().size).toBe(1);
  await graph?.execute();
});

test('should log activity', () => {
  flower.addGraph();
  expect(flower.getGraphs().size).toBe(1);
});