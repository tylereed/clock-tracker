export default interface Initiative {
  name: string;
  order: number;
  dex?: number;
  ac?: number;
  maxHp?: number;
  hp?: number;
  conditions?: string;
  get hasActions(): boolean;
  actions: Attack[];
}

export interface Attack {
  name: string;
  desc: string;
}