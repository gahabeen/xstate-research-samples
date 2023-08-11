import { Task } from '../src';

class TestTask extends Task {

  async beforeTask() {
    console.log('1. do some stuff before the task');
  }

  async task() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('2. task');
  }

  async afterTask() {
    console.log('3. do some stuff afther the task');
  }

  async afterTaskFailed() {
    console.log('4. do some stuff afther the task failed');
  }
}


const task = new TestTask({
  delays: {
    taskTimeout: 100,
  }
});

task.actor.subscribe({
  next: (state) => { console.log('now', state.value); },
  complete: () => { console.log(`Game machine ${task.actor.id} completed`); },
  error: (error) => { console.error(`ERROR`, error) },
})

task.start();