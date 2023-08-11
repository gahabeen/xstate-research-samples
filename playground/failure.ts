import { Failure } from '../src';

class TaskFailure extends Failure {

  async failure() {
    console.log('failure');
  }

  async onKnownError() {
    console.log('onKnownError');
  }

  isKnownError({ context }) {
    return context.error.message === 'Too bad';
  }
}

const failure = new TaskFailure({ error: new Error(`Too bad`) });


failure.start();