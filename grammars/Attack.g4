grammar Attack;

attack:
	attackType ':' ' ' toHit ', ' distance ', ' targets ','? '.'? ' ' hit extraText EOF;

attackType: meleeRanged ' ' weaponSpell ' Attack';

meleeRanged: MELEE | RANGED | MELEE ' or ' RANGED;

weaponSpell: WEAPON | SPELL;

toHit: '+' NUMBER ' to hit';

distance: reach | range | reach ' or ' range;

reach: 'reach '? NUMBER ' ft.';

range: 'range ' NUMBER ('/' NUMBER)? ' ft.';

targets: NUMBER_TEXT ' ' ('target' | 'targets');

hit: damage plusDamage? versatileDamage?;

damage: 'Hit:' ' ' NUMBER ' (' DICE ') ' DAMAGE_TYPE ' damage';

plusDamage:
	' plus' ' ' NUMBER ' (' DICE ') ' DAMAGE_TYPE ' damage';

versatileDamage: (' or ' | ', or ') NUMBER ' (' DICE ') ' DAMAGE_TYPE ' damage' (
		plusDamage
	)? ' if used with two hands' ' to make a melee attack'?;

extraText: TEXT*? '.';

MARKUP: '_'+ -> skip;

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

TEXT: (
		.
		| NUMBER
		| NUMBER_TEXT
		| DAMAGE_TYPE
		| DICE
		| SPELL
		| WEAPON
		| RANGED
		| MELEE
		| ' '
		| 'target'
		| 'targets'
		| ' damage'
		| ' plus'
	);