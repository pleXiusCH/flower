import { FlowerExecutionContext, FlowerScheduler } from '@flower/interfaces';
import { EmitNumberImplBuilder, AddAndLogGD } from '@flower/node-impls'
import { addGraphDefinition, addNodeImplementation, addScheduler, buildExecutionContext, createFlowerSession } from '../lib/flower-core'

describe('flower-core', () =>  {

  it('Should generate a flower session', () => {
    const flower = createFlowerSession()
    console.log("createFlowerSession", flower)
  })

  it('Should load valid node implementation to session', () => {
    const flower = createFlowerSession()
    const newFlower = addNodeImplementation(flower)(EmitNumberImplBuilder)
    // expect(newFlower.nodeInplementations.length).toEqual(1)
    console.log("addNodeImplementation", newFlower)
  })

  it.todo('Should reject invalid node implementation')

  it('Should load valid graph definition to env', () => {
    const flower = createFlowerSession()
    const newFlower = addGraphDefinition(flower)(AddAndLogGD)
    // expect(newFlower.graphDefinitions.length).toEqual(1)
    console.log("addGraphDefinition", newFlower)
  })

  it.todo('Should reject invalid graph definition')

  it('Should register a valid scheduler', () => {
    const flower = createFlowerSession()
    const scheduler: FlowerScheduler = {
      schedule: (execContext: FlowerExecutionContext) => {
        console.log("scheduling ", execContext)
      }
    }
    const newFlower = addScheduler(flower)(scheduler)
    console.log("addScheduler", newFlower)
  })

  it('Should generate an graph execution context from definition', () => {
    const scheduler: FlowerScheduler = {
      schedule: (execContext: FlowerExecutionContext) => {
        console.log("scheduling ", execContext)
      }
    }
    const flower = addScheduler(createFlowerSession())(scheduler)
    const newFlower = buildExecutionContext(flower)(AddAndLogGD)
    console.log("buildExecutionContext", newFlower)
  })

  it.todo('Should generate an graph execution context from definition and override node states')
  
  it.todo('Should schedule an execution context with a given schedule strategy')
});