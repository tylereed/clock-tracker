export default interface Initiative {
  name: string;
  dex: number;
  order: number;
  ac: number;
  maxHp: number;
  hp: number;
  conditions?: string;
}