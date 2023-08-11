import { EventFrom, InputFrom, Interpreter, fromPromise, interpret } from "xstate";
import { createTaskMachine } from '../machines/task';

type FromPromiseParameter = Parameters<Parameters<typeof fromPromise>[0]>[0];

export class Task<Input = Record<string, any>, Output = Record<string, any>, TaskMachine extends ReturnType<typeof createTaskMachine<Input, Output>> = ReturnType<typeof createTaskMachine<Input, Output>>> {
  private machine: TaskMachine;
  public actor: Interpreter<TaskMachine, EventFrom<TaskMachine>>;

  constructor(input?: InputFrom<TaskMachine>) {
    const self = this;

    const delays = {
      beforeTaskTimeout: input.delays?.beforeTaskTimeout || 30000,
      taskTimeout: input.delays?.taskTimeout || 30000,
      afterTaskTimeout: input.delays?.afterTaskTimeout || 30000,
      afterTaskFailedTimeout: input.delays?.afterTaskFailedTimeout || 30000,
    }

    this.machine = createTaskMachine<Input, Output>().provide({
      actors: {
        beforeTask: fromPromise(async (arg) => {
          return self.beforeTask(arg);
        }),
        task: fromPromise(async (arg) => {
          return self.task(arg);
        }),
        afterTask: fromPromise(async (arg) => {
          return self.afterTask(arg);
        }),
        failure: fromPromise(async (arg) => {
          return self.afterTaskFailed(arg);
        }),
      },
    }) as TaskMachine;

    this.actor = interpret(this.machine, {
      input: {
        ...input && {},
        delays
      } as any
    });
  }

  async beforeTask(_: FromPromiseParameter) { }
  async task(_: FromPromiseParameter) { }
  async afterTask(_: FromPromiseParameter) { }
  async afterTaskFailed(_: FromPromiseParameter) { }

  start() {
    this.actor.start();

    // @ts-ignore
    // Can't figure out how to fix it properly, somehow the typing fails
    this.actor.send({ type: "START" });
  }
}
