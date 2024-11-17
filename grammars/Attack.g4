grammar Attack;

attack:
	attackType ':' ' ' toHit ', ' distance ', ' targets ','? '.'? ' ' damage TEXT*?;

attackType: meleeRanged ' ' weaponSpell ' Attack';

meleeRanged: MELEE | RANGED | MELEE ' or ' RANGED;

weaponSpell: WEAPON | SPELL;

toHit: '+' NUMBER ' to hit';

distance: reach | range | reach ' or ' range;

reach: 'reach '? NUMBER ' ft.';

range: 'range ' NUMBER ('/' NUMBER)? ' ft.';

targets: NUMBER_TEXT ' target' 's'?;

damage: 'Hit:' ' ' NUMBER ' (' DICE ') ' DAMAGE_TYPE ' damage';

MARKUP: [_]+ -> channel(HIDDEN);

MELEE: 'Melee';

RANGED: 'Ranged';

WEAPON: 'Weapon';

SPELL: 'Spell';

DICE: NUMBER? 'd' NUMBER (' '? ('+' | '-') ' '? NUMBER)?;

DAMAGE_TYPE:
	'acid'
	| 'bludgeoning'
	| 'cold'
	| 'fire'
	| 'force'
	| 'lightning'
	| 'necrotic'
	| 'piercing'
	| 'poison'
	| 'psychic'
	| 'radiant'
	| 'slashing'
	| 'thunder';

NUMBER: [0-9]+;

NUMBER_TEXT:
	'one'
	| 'two'
	| 'three'
	| 'four'
	| 'five'
	| 'six'
	| 'seven'
	| 'eight'
	| 'nine';

TEXT: .;