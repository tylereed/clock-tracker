import { DocumentSlug, MonsterO5e } from "../../../src/utils/Open5e";


export const defaultMonster: MonsterO5e = {
  "slug": "unit_test_monster",
  "desc": "Fake monster for unit tests",
  "name": "Unit Test Monster",
  "size": "Huge",
  "type": "Aberration",
  "subtype": "",
  "alignment": "chaotic evil",
  "armor_class": 14,
  "armor_desc": "natural armor",
  "hit_points": 115,
  "hit_dice": "10d12+50",
  "speed": {
    "swim": 40,
    "burrow": 20,
    "walk": 30
  },
  "strength": 21,
  "dexterity": 8,
  "constitution": 20,
  "intelligence": 7,
  "wisdom": 14,
  "charisma": 10,
  "perception": 5,
  "skills": {
    "athletics": 10,
    "perception": 5,
    "stealth": 2
  },
  "damage_vulnerabilities": "",
  "damage_resistances": "acid; bludgeoning, piercing, and slashing from nonmagical attacks",
  "damage_immunities": "cold",
  "condition_immunities": "paralyzed, restrained",
  "senses": "darkvision 60 ft., tremorsense 30 ft., passive Perception 15",
  "languages": "understands Common but can't speak",
  "challenge_rating": "7",
  "cr": 7.0,
  "actions": [{
    "name": "Multiattack",
    "desc": "The unit test creature make a bite and a claw attack."
  },
  {
    "name": "Bite",
    "desc": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) piercing damage.",
    "attack_bonus": 8,
    "damage_dice": "2d6+5"
  },
  {
    "name": "Claw",
    "desc": "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 18 (3d8 + 5) bludgeoning damage.",
    "attack_bonus": 8,
    "damage_dice": "3d8+5"
  }],
  "legendary_desc": "",
  "spell_list": [],
  "page_no": 0,
  "environments": [],
  "document__slug": "unit_test" as DocumentSlug,
  "document__title": "Unit Test Document",
  "document__license_url": "http://example.com",
  "document__url": "http://example.com"
};