grammar Attack;

attack: attack_type ': ' TEXT+;

attack_type: melee_ranged ' ' weapon_spell ' Attack';

melee_ranged: MELEE | RANGED | MELEE ' or ' RANGED;

weapon_spell: WEAPON | SPELL;

TEXT: .;

MELEE: 'Melee';

RANGED: 'Ranged';

WEAPON: 'Weapon';

SPELL: 'Spell';

MARKUP: '_' -> skip;