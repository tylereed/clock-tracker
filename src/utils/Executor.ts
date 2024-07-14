import { ref } from "vue";

export interface Command {
  execute(): void | Promise<void>;
  undo(): void | Promise<void>;
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

  async invertCommand(param: Command) {
    this.runCommand(param.undo, param.execute);
  }

  runCommand(command: Command): void;
  runCommand(command: () => void | Promise<void>, undo: () => void | Promise<void>): void;
  async runCommand(param: Command | (() => void | Promise<void>), undo?: () => void | Promise<void>): Promise<void> {
    let command: Command;
    if (undo) {
      command = {
        execute: param as () => void | Promise<void>,
        undo: undo
      }
    } else {
      command = param as Command;
    }

    await command.execute();
    this.pushUndo(command);
  }

  pushUndo(command: Command) {
    this.undoStack.push(command);
    this.redoStack = [];
    this.canUndo.value = true;
    this.canRedo.value = false;

    this.afterExecute?.call(undefined);
  }

  async undo(): Promise<void> {
    if (this.undoStack.length) {
      const command = this.undoStack.pop()!;
      await command.undo();
      this.redoStack.push(command);
      this.canUndo.value = this.undoStack.length > 0;
      this.canRedo.value = this.redoStack.length > 0;

      this.afterExecute?.call(undefined);
    }
  }

  async redo(): Promise<void> {
    if (this.redoStack.length) {
      const command = this.redoStack.pop()!;
      await command.execute();
      this.undoStack.push(command);
      this.canUndo.value = this.undoStack.length > 0;
      this.canRedo.value = this.redoStack.length > 0;

      this.afterExecute?.call(undefined);
    }
  }
}