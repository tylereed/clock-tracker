export default interface Initiative {
  name: string;
  order: number;
  dex?: number;
  ac?: number;
  maxHp?: number;
  hp?: number;
  conditions?: string;
  actions?: Actions[];
  bonusAction?: Actions[];
}

export interface Actions {
  name: string;
  desc: string;
}