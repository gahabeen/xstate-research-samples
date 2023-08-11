import { assign, createMachine } from "xstate";

export const createTaskMachine = <Input extends Record<string, any>, Output extends Record<string, any>>() => createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBcCGsDWA6AlhANmAMQDKAKgIIBKZA2gAwC6ioADgPaw7I7sB2LEAA9EARgBMAViwA2ACySAHAGZx9ZZPX1RigDQgAnmPEB2LHOX0AnFfrbtMySdEBfF-rSYssNACcefFBEEPxguHwAbuwYYTiR0WAAtABGYABm7L5JnhgMzEggHFw8-IIiCJIyZnLiVjIacqKSknIy+kYIreJYluKiciYD9EomVW4e6Ng+qP5xQWC+vplYrPioyBm+ALbhUTEp6ZnZk3mCRdy8AgXlldW19S1NLW2GiIqi5iZWoo6K3yNOcYgHLePwBIJCabIMKoNLQ3wAClSmzAZEmZBwWzA7AArsgAJREEHTWaBU4Fc4lK6gG5Vcz3BpPVrtYyKLBWZRyP6tSSiCTKKxAkG+HF8PhzYKhXYJaX7HLkticC6la5idQycwyGTWbXiRSKcQDFkIWrSGQ6Z4ckyKFqKIWTLAisUShZLXwrNYbTI7OJ7Y6YBWFJVUspq5Qa1raur0PUGo2vToybq9fqDEzDRSjEz2rxO8WBIiQtDQrCw+EInIYrG4glEh15uaBymXUMIUTqzVR3X6w0mY2aKxYExOTNSZSc6w2nPYNKoHD4HFZSV8WLxGKypKz+eLsBN4Mt1Um+jyLDvQ1ahRqJNyY1yKzdGRWNOaYbH9TTrBbhdL13LVbrTYfTXTc52-XcmDOfcVRpRArzkU8JEjS9j0NW8Biwc8rAsRR6GtbRMw-MA+AgCUQhXDcN0SMsFkSeUIIpKDqWEMRJCkLBJx7KpLANcRjUNNkflMJwdDHTRxEI4iXUWP9PUAyjqN8WiTnoxVigPGC21Y6QOINLj6B441OWUdjBj1O8BVEUZJAkkiCyLdYYThBYEQUtFMCrbE8UJEEiNsqA9zU6DmM0tidPEPSDITU1ZAtccbA5ZplDcdwQD4dgIDgQQckgwKmPKRIXg6Ar2LsUqytK-oPzwQgcuVPLEBqY0JDMb4viTa0rFYmQVA-ElwVqkND3EZQ7jqDkkyTeK9ATb5zDkexw0kOprXkD8G0CAb1OCr54IFJR+S+EanFvEbTxjJpH05TrsxSkEvx3TagvKSycNkBRFEcPVOqqXiE0vdlWKkGw-hMU0bLmR76rbPpqm69NkP0yQ+OcLA+RtBRlAkfSdA-MiwEh1txHCs1jwedqNHDW8TBa+bMZEnRqc5ZKXCAA */
    id: "task",
    types: {} as {
      input: {
        delays?: {
          beforeTaskTimeout?: number,
          taskTimeout?: number,
          afterTaskTimeout?: number,
          afterTaskFailedTimeout?: number,
        }
      } & Input,
      output: {
        context: {
          startedAt: number,
          endedAt: number,
        }
      } & Output,
      context: {
        time: {
          startedAt: number,
          endedAt: number,
        },
        delays: {
          beforeTaskTimeout: number,
          taskTimeout: number,
          afterTaskTimeout: number,
          afterTaskFailedTimeout: number,
        }
      },
    },
    context: ({ input }) => ({
      time: {
        startedAt: undefined,
        endedAt: undefined,
      },
      delays: {
        beforeTaskTimeout: input?.delays?.beforeTaskTimeout,
        taskTimeout: input?.delays?.taskTimeout,
        afterTaskTimeout: input?.delays?.afterTaskTimeout,
        afterTaskFailedTimeout: input?.delays?.afterTaskFailedTimeout,
      }
    }),
    output: ({ context }) => ({
      context: {
        startedAt: context.time.startedAt,
        endedAt: context.time.endedAt,
      }
    }),
    initial: "idle",
    states: {
      idle: {
        on: {
          START: {
            target: "starting",
            reenter: false,
          },
        },
      },

      starting: {
        entry: ['onEntryStarting'],
        invoke: {
          src: "beforeTask",
          input: ({ context }) => context,
          id: "invoke-before-task",
          onDone: [
            {
              target: "running",
              reenter: false,
            },
          ],
          onError: [
            {
              target: "failure",
              reenter: false,
            },
          ],
        },
        after: {
          beforeTaskTimeout: {
            target: "#task.failure",
            guard: ({ context }) => context.delays.beforeTaskTimeout > 0,
          }
        },
      },

      running: {
        invoke: {
          src: "task",
          input: ({ context, }) => context,
          id: "invoke-task",
          onDone: [
            {
              target: "ending",
              reenter: false,
            },
          ],
          onError: [
            {
              target: "failure",
              reenter: false,
            },
          ],
        },
        after: {
          taskTimeout: {
            target: "#task.failure",
            guard: ({ context }) => context.delays.taskTimeout > 0,
          }
        },
      },

      failure: {
        invoke: {
          src: "failure",
          input: ({ context }) => context,
          id: "invoke-failure",
          onDone: [
            {
              target: "done",
              reenter: false,
            },
          ],
          onError: [
            {
              target: "done",
              reenter: false,
            },
          ],
        },
      },

      ending: {
        invoke: {
          src: "afterTask",
          input: ({ context }) => context,
          id: "invoke-after-task",
          onDone: [
            {
              target: "done",
              reenter: false,
            },
          ],
          onError: [
            {
              target: "failure",
              reenter: false,
            },
          ],
        },
        after: {
          afterTaskTimeout: {
            target: "#task.failure",
            guard: ({ context }) => context.delays.afterTaskTimeout > 0,
            actions: [],
          }
        },
      },

      done: {
        type: "final",
        entry: ['onEntryDone'],
      }
    },
  },
  {
    delays: {
      beforeTaskTimeout: ({ context }) => context.delays.beforeTaskTimeout,
      taskTimeout: ({ context }) => context.delays.taskTimeout,
      afterTaskTimeout: ({ context }) => context.delays.afterTaskTimeout,
      afterTaskFailedTimeout: ({ context }) => context.delays.afterTaskFailedTimeout,
    },
    actions: {
      onEntryStarting: assign(({ context }) => {
        return {
          time: {
            startedAt: new Date().getTime(),
            endedAt: context.time.endedAt,
          }
        };
      }),
      onEntryDone: assign(({ context }) => {
        return {
          time: {
            startedAt: context.time.startedAt,
            endedAt: new Date().getTime(),
          }
        };
      }),
    }
  }
);