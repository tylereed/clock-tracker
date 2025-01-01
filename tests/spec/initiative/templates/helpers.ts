import { expect } from "vitest";
import { defaultMonster } from "../defaultMonster";

export const jsonMonster = JSON.stringify(defaultMonster);

export function assertAction(actions: { name: string, desc: string }[], name: string, expected: string) {
  const [action] = actions.filter(x => x.name === name);
  expect.soft(action, "Could not find action names " + name).not.toBeNull();
  expect.soft(action?.desc).toBe(expected);
}

export function assertHasActions(actions: { name: string, desc: string }[], ...names: string[]) {
  for (const name of names) {
    expect.soft(actions.filter(x => x.name === name)).toHaveLength(1);
  }
}