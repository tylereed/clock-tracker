import { ref } from "vue";

export interface Command {
  execute(): void;
  undo(): void;
}

export class Executor {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  readonly canUndo = ref(false);
  readonly canRedo = ref(false);

  private readonly afterExecute: (() => void) | undefined;

  constructor(afterExecute?: () => void) {
    this.afterExecute = afterExecute;
  }

  runCommand(command: Command): void;
  runCommand(command: () => void, undo: () => void): void;
  runCommand(param: Command | (() => void), undo?: () => void): void {
    let command: Command;
    if (undo) {
      command = {
        execute: param as () => void,
        undo: undo
      }
    } else {
      command = param as Command;
    }

    command.execute();
    this.undoStack.push(command);
    this.redoStack = [];
    this.canUndo.value = true;
    this.canRedo.value = false;

    this.afterExecute?.call(undefined);
  }

  undo(): void {
    if (this.undoStack.length) {
      const command = this.undoStack.pop()!;
      command.undo();
      this.redoStack.push(command);
      this.canUndo.value = this.undoStack.length > 0;
      this.canRedo.value = this.redoStack.length > 0;

      this.afterExecute?.call(undefined);
    }
  }

  redo(): void {
    if (this.redoStack.length) {
      const command = this.redoStack.pop()!;
      command.execute();
      this.undoStack.push(command);
      this.canUndo.value = this.undoStack.length > 0;
      this.canRedo.value = this.redoStack.length > 0;

      this.afterExecute?.call(undefined);
    }
  }
}