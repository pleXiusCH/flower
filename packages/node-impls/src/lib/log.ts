import { NodeImplBuilder } from '@flower/interfaces'

export const LogImplBuilder: NodeImplBuilder = () => ({
  name: 'Log',
  inputs: [{ name: 'in', type: 'string | number | object' }],
  sideEffect: (_, inputs) => new Promise((resolve, reject) => {
    try {
      const logData = JSON.stringify(inputs[0][1])
      const failPercent = 20;
      const randomNr = Math.floor(Math.random() * 100) + 1;
      if (randomNr <= failPercent) {
        throw new Error(`Could not access log output.`)
      } else {
        setTimeout(() => {
          console.log(`[${Date.now()}]\tLog Node:\t${logData}`)
          resolve(null)
        }, 300)
      }
    } catch(e) {
      reject(e)
    }
  })
})