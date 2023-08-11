# xstate-research-samples

> This is just a play repository sharing some of my research on XState, mostly leaning towards backend applications and workflow management (embedded within a single service).

# Structure

- `src/core` contains classes as interfaces for the state machines
- `src/machines` contains the state machines
- `playground` contains a bunch of examples of how to use the state machines

# Explored concepts

- **Task**: handle and async operation with hooks and error handling
- **Failure**: common actor to handle failures
- **Workflow**: handle a list of tasks (in parallel) with hooks and error handling