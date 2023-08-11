import { createMachine, fromPromise } from 'xstate'

export const FailureMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDMCGBLANgVwE5gDoALVAOwk3VKgGkB7Ad1IFFdc7cBiCO0wqgG50A1v1JDRAWhLlMYScMalJYNhwDaABgC6iUAAc6sdABd0vPSAAeiAIwAmTQHYCADkcBmL14Cc9n04ANCAAnogeAGwALAQeAKy2cRF+8VH29hEAvpnBaFh4hDIUVFAAqqSKTKzsXDx8BIIiYhLyRXKS2BVKKmq4WrpIIIbGZhaDNggOzm6e3h5+AcFhCPbzBD62tlFx7ukBTppx2bkYOPjEZMXUACroALZgAPLYJtUc3LzNTQ3iTdKX7TMDzoLx6NX6lmGpnMpEsEymLncmjm838QVCdkSBCiTlsHhx9lshw8iQ8xxAeTO-AoYA+9Uaoh+EnQ8kpBQhgyho1h40QUR8rgIcX5UQiHlcrg89lcSSW4WisQScR2mlcovFavJbPO6BpdK+jIZLMk2rA6nsAwMRmhY1AE35guFPnVEqlMoicsmWJxeLStglTgiq3sWtOBQaerqBoNxtN6lslqG1u5cL5AqFIrFrulsoxKzWGy2ETxTil9icIfJpDoEDgllNkOTMNTCEkHrzbYImkcTlxcRJHiccR8flD+R1NMbI2bvIQaU9eLibn9+LVER2FbxY6pF1kJXoVV6U5tPLtiFcmzcUUHxfdxcSnq8mkVzu7B28cUrJ3HhQBJXKlQsEenJNra1jnpeao3v6ST3nEnqOEuGwpCOkSuD4miHNu4ZtCUtwPM8rzAVa05gRMF62Fe0F3ps8F5he2JOBsriaBEThqlEUSJNh5xgOQx4prOWw+B42LbPi0qaFsEquAhg4EOuRI4kO3ZxBW2TZEAA */
  "id": "failure",
  types: {} as {
    input: {
      error: Error
    },
    output: {},
    context: {
      error: Error | undefined
    },
  },
  "context": ({ input }) => ({
    error: input.error
  }),
  "initial": "idle",
  "states": {
    "idle": {
      on: {
        FAIL: "failing"
      }
    },

    "onKownError": {
      "invoke": {
        "src": "handleKownError",
        "id": "invoke-handle-kown-error",
        "onDone": [
          {
            "target": "end",
            "reenter": false
          }
        ]
      }
    },

    "onUnkownError": {
      "invoke": {
        "src": "handleUnkownError",
        "id": "invoke-handle-unkown-error",
        "onDone": [
          {
            "target": "end",
            "reenter": false
          }
        ]
      }
    },

    "onTimeOutError": {
      "invoke": {
        "src": "handleTimeOutError",
        "id": "invoke-handle-timeout-error",
        "onDone": [
          {
            "target": "end",
            "reenter": false
          }
        ]
      }
    },

    "end": {
      "type": "final"
    },

    failing: {
      invoke: {
        src: "failure",
        id: "invokie-failure",

        onDone: [{
          "target": "onUnkownError",
          "guard": "isUnkownError",
          "reenter": false,
        }, {
          "target": "onKownError",
          "guard": "isKnownError",
          "reenter": false
        }, {
          "target": "onTimeOutError",
          "guard": "isTimeOutError",
          "reenter": false
        }]
      }
    }
  }
})

export type FailureMachine = typeof FailureMachine;