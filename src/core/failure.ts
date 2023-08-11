import { ContextFrom, EventFrom, GuardPredicate, InterpreterFrom, fromPromise, interpret } from "xstate";
import { FailureMachine } from '../machines/failure';

export class Failure {
  private machine: FailureMachine;
  public actor: InterpreterFrom<FailureMachine>;

  constructor({ error }: { error?: Error }) {
    const self = this;

    this.machine = FailureMachine.provide({

      actors: {
        "failure": fromPromise(async (arg) => {
          return self.failure(arg);
        }),
        "onUnkownError": fromPromise(async (arg) => {
          return self.onUnkownError(arg);
        }),
        "onKnownError": fromPromise(async (arg) => {
          return self.onKnownError(arg);
        }),
        "onTimeOutError": fromPromise(async (arg) => {
          return self.onTimeOutError(arg)
        })
      },

      guards: {
        "isKnownError": (arg) => self.isKnownError(arg),
        "isUnkownError": (arg) => self.isUnkownError(arg),
        "isTimeOutError": (arg) => self.isTimeOutError(arg),
      },

    });

    this.actor = interpret(this.machine, {
      input: { error }
    });
  }

  async failure(_: Parameters<Parameters<typeof fromPromise>[0]>[0]) { }
  async onUnkownError(_: Parameters<Parameters<typeof fromPromise>[0]>[0]) { }
  async onKnownError(_: Parameters<Parameters<typeof fromPromise>[0]>[0]) { }
  async onTimeOutError(_: Parameters<Parameters<typeof fromPromise>[0]>[0]) { }

  isKnownError(_: Parameters<GuardPredicate<ContextFrom<FailureMachine>, EventFrom<FailureMachine>>>[0]) { return false; }
  isUnkownError(_: Parameters<GuardPredicate<ContextFrom<FailureMachine>, EventFrom<FailureMachine>>>[0]) { return false; }
  isTimeOutError(_: Parameters<GuardPredicate<ContextFrom<FailureMachine>, EventFrom<FailureMachine>>>[0]) { return false; }

  start() {
    this.actor.start();
    this.actor.send({ type: "FAIL" });
  }
}
