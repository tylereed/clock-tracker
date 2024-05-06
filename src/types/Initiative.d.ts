export default interface Initiative {
  name: string;
  order: number;
  ac: number;
  maxHp: number;
  hp: number;
  conditions?: string;
}