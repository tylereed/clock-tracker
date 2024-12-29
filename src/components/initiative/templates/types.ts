export const templates = ["Squad", "Skeleton", "Zombie", "Merfolk", "Sahuagin", "Half-Dragon"] as const;
export type TemplateType = typeof templates[number];

export type TemplateOptions = ZombieOptions | MerfolkOptions | HalfDragonOptions;

export interface ZombieOptions {
  undeadFortitude: boolean,
  infectiousBite: boolean,
  vileDischarge: boolean,
  vigorMortis: boolean
};

export interface MerfolkOptions {
  includeTrident: boolean
}

export const dragonTypes = ["Amethyst", "Black", "Blue", "Brass", "Bronze", "Copper", "Earth", "Emerald", "Gold",
  "Green", "Red", "River", "Sapphire", "Shadow", "Silver", "White"] as const;
export type DragonType = typeof dragonTypes[number];

export interface HalfDragonOptions {
  type: DragonType
}