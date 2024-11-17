// Generated from grammars/Attack.g4 by ANTLR 4.13.2
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import {
	ATN,
	ATNDeserializer, DecisionState, DFA, FailedPredicateException,
	RecognitionException, NoViableAltException, BailErrorStrategy,
	Parser, ParserATNSimulator,
	RuleContext, ParserRuleContext, PredictionMode, PredictionContextCache,
	TerminalNode, RuleNode,
	Token, TokenStream,
	Interval, IntervalSet
} from 'antlr4';
import AttackListener from "./AttackListener.js";
// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;

export default class AttackParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly T__3 = 4;
	public static readonly T__4 = 5;
	public static readonly T__5 = 6;
	public static readonly T__6 = 7;
	public static readonly T__7 = 8;
	public static readonly T__8 = 9;
	public static readonly T__9 = 10;
	public static readonly T__10 = 11;
	public static readonly T__11 = 12;
	public static readonly T__12 = 13;
	public static readonly T__13 = 14;
	public static readonly T__14 = 15;
	public static readonly T__15 = 16;
	public static readonly T__16 = 17;
	public static readonly T__17 = 18;
	public static readonly T__18 = 19;
	public static readonly MARKUP = 20;
	public static readonly MELEE = 21;
	public static readonly RANGED = 22;
	public static readonly WEAPON = 23;
	public static readonly SPELL = 24;
	public static readonly DICE = 25;
	public static readonly DAMAGE_TYPE = 26;
	public static readonly NUMBER = 27;
	public static readonly NUMBER_TEXT = 28;
	public static readonly TEXT = 29;
	public static override readonly EOF = Token.EOF;
	public static readonly RULE_attack = 0;
	public static readonly RULE_attackType = 1;
	public static readonly RULE_meleeRanged = 2;
	public static readonly RULE_weaponSpell = 3;
	public static readonly RULE_toHit = 4;
	public static readonly RULE_distance = 5;
	public static readonly RULE_reach = 6;
	public static readonly RULE_range = 7;
	public static readonly RULE_targets = 8;
	public static readonly RULE_damage = 9;
	public static readonly literalNames: (string | null)[] = [ null, "':'", 
                                                            "' '", "', '", 
                                                            "','", "'.'", 
                                                            "' Attack'", 
                                                            "' or '", "'+'", 
                                                            "' to hit'", 
                                                            "'reach '", 
                                                            "' ft.'", "'range '", 
                                                            "'/'", "' target'", 
                                                            "'s'", "'Hit:'", 
                                                            "' ('", "') '", 
                                                            "' damage'", 
                                                            null, "'Melee'", 
                                                            "'Ranged'", 
                                                            "'Weapon'", 
                                                            "'Spell'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, null, 
                                                             null, null, 
                                                             null, null, 
                                                             null, null, 
                                                             null, null, 
                                                             null, null, 
                                                             null, null, 
                                                             null, null, 
                                                             null, null, 
                                                             null, null, 
                                                             "MARKUP", "MELEE", 
                                                             "RANGED", "WEAPON", 
                                                             "SPELL", "DICE", 
                                                             "DAMAGE_TYPE", 
                                                             "NUMBER", "NUMBER_TEXT", 
                                                             "TEXT" ];
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"attack", "attackType", "meleeRanged", "weaponSpell", "toHit", "distance", 
		"reach", "range", "targets", "damage",
	];
	public get grammarFileName(): string { return "Attack.g4"; }
	public get literalNames(): (string | null)[] { return AttackParser.literalNames; }
	public get symbolicNames(): (string | null)[] { return AttackParser.symbolicNames; }
	public get ruleNames(): string[] { return AttackParser.ruleNames; }
	public get serializedATN(): number[] { return AttackParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(this, AttackParser._ATN, AttackParser.DecisionsToDFA, new PredictionContextCache());
	}
	// @RuleVersion(0)
	public attack(): AttackContext {
		let localctx: AttackContext = new AttackContext(this, this._ctx, this.state);
		this.enterRule(localctx, 0, AttackParser.RULE_attack);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 20;
			this.attackType();
			this.state = 21;
			this.match(AttackParser.T__0);
			this.state = 22;
			this.match(AttackParser.T__1);
			this.state = 23;
			this.toHit();
			this.state = 24;
			this.match(AttackParser.T__2);
			this.state = 25;
			this.distance();
			this.state = 26;
			this.match(AttackParser.T__2);
			this.state = 27;
			this.targets();
			this.state = 29;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===4) {
				{
				this.state = 28;
				this.match(AttackParser.T__3);
				}
			}

			this.state = 32;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===5) {
				{
				this.state = 31;
				this.match(AttackParser.T__4);
				}
			}

			this.state = 34;
			this.match(AttackParser.T__1);
			this.state = 35;
			this.damage();
			this.state = 39;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 2, this._ctx);
			while (_alt !== 1 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1 + 1) {
					{
					{
					this.state = 36;
					this.match(AttackParser.TEXT);
					}
					}
				}
				this.state = 41;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 2, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public attackType(): AttackTypeContext {
		let localctx: AttackTypeContext = new AttackTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 2, AttackParser.RULE_attackType);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 42;
			this.meleeRanged();
			this.state = 43;
			this.match(AttackParser.T__1);
			this.state = 44;
			this.weaponSpell();
			this.state = 45;
			this.match(AttackParser.T__5);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public meleeRanged(): MeleeRangedContext {
		let localctx: MeleeRangedContext = new MeleeRangedContext(this, this._ctx, this.state);
		this.enterRule(localctx, 4, AttackParser.RULE_meleeRanged);
		try {
			this.state = 52;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 3, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 47;
				this.match(AttackParser.MELEE);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 48;
				this.match(AttackParser.RANGED);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 49;
				this.match(AttackParser.MELEE);
				this.state = 50;
				this.match(AttackParser.T__6);
				this.state = 51;
				this.match(AttackParser.RANGED);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public weaponSpell(): WeaponSpellContext {
		let localctx: WeaponSpellContext = new WeaponSpellContext(this, this._ctx, this.state);
		this.enterRule(localctx, 6, AttackParser.RULE_weaponSpell);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 54;
			_la = this._input.LA(1);
			if(!(_la===23 || _la===24)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public toHit(): ToHitContext {
		let localctx: ToHitContext = new ToHitContext(this, this._ctx, this.state);
		this.enterRule(localctx, 8, AttackParser.RULE_toHit);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 56;
			this.match(AttackParser.T__7);
			this.state = 57;
			this.match(AttackParser.NUMBER);
			this.state = 58;
			this.match(AttackParser.T__8);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public distance(): DistanceContext {
		let localctx: DistanceContext = new DistanceContext(this, this._ctx, this.state);
		this.enterRule(localctx, 10, AttackParser.RULE_distance);
		try {
			this.state = 66;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 4, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 60;
				this.reach();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 61;
				this.range();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 62;
				this.reach();
				this.state = 63;
				this.match(AttackParser.T__6);
				this.state = 64;
				this.range();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public reach(): ReachContext {
		let localctx: ReachContext = new ReachContext(this, this._ctx, this.state);
		this.enterRule(localctx, 12, AttackParser.RULE_reach);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 69;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===10) {
				{
				this.state = 68;
				this.match(AttackParser.T__9);
				}
			}

			this.state = 71;
			this.match(AttackParser.NUMBER);
			this.state = 72;
			this.match(AttackParser.T__10);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public range(): RangeContext {
		let localctx: RangeContext = new RangeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 14, AttackParser.RULE_range);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 74;
			this.match(AttackParser.T__11);
			this.state = 75;
			this.match(AttackParser.NUMBER);
			this.state = 78;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===13) {
				{
				this.state = 76;
				this.match(AttackParser.T__12);
				this.state = 77;
				this.match(AttackParser.NUMBER);
				}
			}

			this.state = 80;
			this.match(AttackParser.T__10);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public targets(): TargetsContext {
		let localctx: TargetsContext = new TargetsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 16, AttackParser.RULE_targets);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 82;
			this.match(AttackParser.NUMBER_TEXT);
			this.state = 83;
			this.match(AttackParser.T__13);
			this.state = 85;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===15) {
				{
				this.state = 84;
				this.match(AttackParser.T__14);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public damage(): DamageContext {
		let localctx: DamageContext = new DamageContext(this, this._ctx, this.state);
		this.enterRule(localctx, 18, AttackParser.RULE_damage);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 87;
			this.match(AttackParser.T__15);
			this.state = 88;
			this.match(AttackParser.T__1);
			this.state = 89;
			this.match(AttackParser.NUMBER);
			this.state = 90;
			this.match(AttackParser.T__16);
			this.state = 91;
			this.match(AttackParser.DICE);
			this.state = 92;
			this.match(AttackParser.T__17);
			this.state = 93;
			this.match(AttackParser.DAMAGE_TYPE);
			this.state = 94;
			this.match(AttackParser.T__18);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public static readonly _serializedATN: number[] = [4,1,29,97,2,0,7,0,2,
	1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,1,
	0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,3,0,30,8,0,1,0,3,0,33,8,0,1,0,1,0,1,0,
	5,0,38,8,0,10,0,12,0,41,9,0,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,2,1,2,1,2,3,2,
	53,8,2,1,3,1,3,1,4,1,4,1,4,1,4,1,5,1,5,1,5,1,5,1,5,1,5,3,5,67,8,5,1,6,3,
	6,70,8,6,1,6,1,6,1,6,1,7,1,7,1,7,1,7,3,7,79,8,7,1,7,1,7,1,8,1,8,1,8,3,8,
	86,8,8,1,9,1,9,1,9,1,9,1,9,1,9,1,9,1,9,1,9,1,9,1,39,0,10,0,2,4,6,8,10,12,
	14,16,18,0,1,1,0,23,24,96,0,20,1,0,0,0,2,42,1,0,0,0,4,52,1,0,0,0,6,54,1,
	0,0,0,8,56,1,0,0,0,10,66,1,0,0,0,12,69,1,0,0,0,14,74,1,0,0,0,16,82,1,0,
	0,0,18,87,1,0,0,0,20,21,3,2,1,0,21,22,5,1,0,0,22,23,5,2,0,0,23,24,3,8,4,
	0,24,25,5,3,0,0,25,26,3,10,5,0,26,27,5,3,0,0,27,29,3,16,8,0,28,30,5,4,0,
	0,29,28,1,0,0,0,29,30,1,0,0,0,30,32,1,0,0,0,31,33,5,5,0,0,32,31,1,0,0,0,
	32,33,1,0,0,0,33,34,1,0,0,0,34,35,5,2,0,0,35,39,3,18,9,0,36,38,5,29,0,0,
	37,36,1,0,0,0,38,41,1,0,0,0,39,40,1,0,0,0,39,37,1,0,0,0,40,1,1,0,0,0,41,
	39,1,0,0,0,42,43,3,4,2,0,43,44,5,2,0,0,44,45,3,6,3,0,45,46,5,6,0,0,46,3,
	1,0,0,0,47,53,5,21,0,0,48,53,5,22,0,0,49,50,5,21,0,0,50,51,5,7,0,0,51,53,
	5,22,0,0,52,47,1,0,0,0,52,48,1,0,0,0,52,49,1,0,0,0,53,5,1,0,0,0,54,55,7,
	0,0,0,55,7,1,0,0,0,56,57,5,8,0,0,57,58,5,27,0,0,58,59,5,9,0,0,59,9,1,0,
	0,0,60,67,3,12,6,0,61,67,3,14,7,0,62,63,3,12,6,0,63,64,5,7,0,0,64,65,3,
	14,7,0,65,67,1,0,0,0,66,60,1,0,0,0,66,61,1,0,0,0,66,62,1,0,0,0,67,11,1,
	0,0,0,68,70,5,10,0,0,69,68,1,0,0,0,69,70,1,0,0,0,70,71,1,0,0,0,71,72,5,
	27,0,0,72,73,5,11,0,0,73,13,1,0,0,0,74,75,5,12,0,0,75,78,5,27,0,0,76,77,
	5,13,0,0,77,79,5,27,0,0,78,76,1,0,0,0,78,79,1,0,0,0,79,80,1,0,0,0,80,81,
	5,11,0,0,81,15,1,0,0,0,82,83,5,28,0,0,83,85,5,14,0,0,84,86,5,15,0,0,85,
	84,1,0,0,0,85,86,1,0,0,0,86,17,1,0,0,0,87,88,5,16,0,0,88,89,5,2,0,0,89,
	90,5,27,0,0,90,91,5,17,0,0,91,92,5,25,0,0,92,93,5,18,0,0,93,94,5,26,0,0,
	94,95,5,19,0,0,95,19,1,0,0,0,8,29,32,39,52,66,69,78,85];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!AttackParser.__ATN) {
			AttackParser.__ATN = new ATNDeserializer().deserialize(AttackParser._serializedATN);
		}

		return AttackParser.__ATN;
	}


	static DecisionsToDFA = AttackParser._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );

}

export class AttackContext extends ParserRuleContext {
	constructor(parser?: AttackParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public attackType(): AttackTypeContext {
		return this.getTypedRuleContext(AttackTypeContext, 0) as AttackTypeContext;
	}
	public toHit(): ToHitContext {
		return this.getTypedRuleContext(ToHitContext, 0) as ToHitContext;
	}
	public distance(): DistanceContext {
		return this.getTypedRuleContext(DistanceContext, 0) as DistanceContext;
	}
	public targets(): TargetsContext {
		return this.getTypedRuleContext(TargetsContext, 0) as TargetsContext;
	}
	public damage(): DamageContext {
		return this.getTypedRuleContext(DamageContext, 0) as DamageContext;
	}
	public TEXT_list(): TerminalNode[] {
	    	return this.getTokens(AttackParser.TEXT);
	}
	public TEXT(i: number): TerminalNode {
		return this.getToken(AttackParser.TEXT, i);
	}
    public get ruleIndex(): number {
    	return AttackParser.RULE_attack;
	}
	public enterRule(listener: AttackListener): void {
	    if(listener.enterAttack) {
	 		listener.enterAttack(this);
		}
	}
	public exitRule(listener: AttackListener): void {
	    if(listener.exitAttack) {
	 		listener.exitAttack(this);
		}
	}
}


export class AttackTypeContext extends ParserRuleContext {
	constructor(parser?: AttackParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public meleeRanged(): MeleeRangedContext {
		return this.getTypedRuleContext(MeleeRangedContext, 0) as MeleeRangedContext;
	}
	public weaponSpell(): WeaponSpellContext {
		return this.getTypedRuleContext(WeaponSpellContext, 0) as WeaponSpellContext;
	}
    public get ruleIndex(): number {
    	return AttackParser.RULE_attackType;
	}
	public enterRule(listener: AttackListener): void {
	    if(listener.enterAttackType) {
	 		listener.enterAttackType(this);
		}
	}
	public exitRule(listener: AttackListener): void {
	    if(listener.exitAttackType) {
	 		listener.exitAttackType(this);
		}
	}
}


export class MeleeRangedContext extends ParserRuleContext {
	constructor(parser?: AttackParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public MELEE(): TerminalNode {
		return this.getToken(AttackParser.MELEE, 0);
	}
	public RANGED(): TerminalNode {
		return this.getToken(AttackParser.RANGED, 0);
	}
    public get ruleIndex(): number {
    	return AttackParser.RULE_meleeRanged;
	}
	public enterRule(listener: AttackListener): void {
	    if(listener.enterMeleeRanged) {
	 		listener.enterMeleeRanged(this);
		}
	}
	public exitRule(listener: AttackListener): void {
	    if(listener.exitMeleeRanged) {
	 		listener.exitMeleeRanged(this);
		}
	}
}


export class WeaponSpellContext extends ParserRuleContext {
	constructor(parser?: AttackParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WEAPON(): TerminalNode {
		return this.getToken(AttackParser.WEAPON, 0);
	}
	public SPELL(): TerminalNode {
		return this.getToken(AttackParser.SPELL, 0);
	}
    public get ruleIndex(): number {
    	return AttackParser.RULE_weaponSpell;
	}
	public enterRule(listener: AttackListener): void {
	    if(listener.enterWeaponSpell) {
	 		listener.enterWeaponSpell(this);
		}
	}
	public exitRule(listener: AttackListener): void {
	    if(listener.exitWeaponSpell) {
	 		listener.exitWeaponSpell(this);
		}
	}
}


export class ToHitContext extends ParserRuleContext {
	constructor(parser?: AttackParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NUMBER(): TerminalNode {
		return this.getToken(AttackParser.NUMBER, 0);
	}
    public get ruleIndex(): number {
    	return AttackParser.RULE_toHit;
	}
	public enterRule(listener: AttackListener): void {
	    if(listener.enterToHit) {
	 		listener.enterToHit(this);
		}
	}
	public exitRule(listener: AttackListener): void {
	    if(listener.exitToHit) {
	 		listener.exitToHit(this);
		}
	}
}


export class DistanceContext extends ParserRuleContext {
	constructor(parser?: AttackParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public reach(): ReachContext {
		return this.getTypedRuleContext(ReachContext, 0) as ReachContext;
	}
	public range(): RangeContext {
		return this.getTypedRuleContext(RangeContext, 0) as RangeContext;
	}
    public get ruleIndex(): number {
    	return AttackParser.RULE_distance;
	}
	public enterRule(listener: AttackListener): void {
	    if(listener.enterDistance) {
	 		listener.enterDistance(this);
		}
	}
	public exitRule(listener: AttackListener): void {
	    if(listener.exitDistance) {
	 		listener.exitDistance(this);
		}
	}
}


export class ReachContext extends ParserRuleContext {
	constructor(parser?: AttackParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NUMBER(): TerminalNode {
		return this.getToken(AttackParser.NUMBER, 0);
	}
    public get ruleIndex(): number {
    	return AttackParser.RULE_reach;
	}
	public enterRule(listener: AttackListener): void {
	    if(listener.enterReach) {
	 		listener.enterReach(this);
		}
	}
	public exitRule(listener: AttackListener): void {
	    if(listener.exitReach) {
	 		listener.exitReach(this);
		}
	}
}


export class RangeContext extends ParserRuleContext {
	constructor(parser?: AttackParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NUMBER_list(): TerminalNode[] {
	    	return this.getTokens(AttackParser.NUMBER);
	}
	public NUMBER(i: number): TerminalNode {
		return this.getToken(AttackParser.NUMBER, i);
	}
    public get ruleIndex(): number {
    	return AttackParser.RULE_range;
	}
	public enterRule(listener: AttackListener): void {
	    if(listener.enterRange) {
	 		listener.enterRange(this);
		}
	}
	public exitRule(listener: AttackListener): void {
	    if(listener.exitRange) {
	 		listener.exitRange(this);
		}
	}
}


export class TargetsContext extends ParserRuleContext {
	constructor(parser?: AttackParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NUMBER_TEXT(): TerminalNode {
		return this.getToken(AttackParser.NUMBER_TEXT, 0);
	}
    public get ruleIndex(): number {
    	return AttackParser.RULE_targets;
	}
	public enterRule(listener: AttackListener): void {
	    if(listener.enterTargets) {
	 		listener.enterTargets(this);
		}
	}
	public exitRule(listener: AttackListener): void {
	    if(listener.exitTargets) {
	 		listener.exitTargets(this);
		}
	}
}


export class DamageContext extends ParserRuleContext {
	constructor(parser?: AttackParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NUMBER(): TerminalNode {
		return this.getToken(AttackParser.NUMBER, 0);
	}
	public DICE(): TerminalNode {
		return this.getToken(AttackParser.DICE, 0);
	}
	public DAMAGE_TYPE(): TerminalNode {
		return this.getToken(AttackParser.DAMAGE_TYPE, 0);
	}
    public get ruleIndex(): number {
    	return AttackParser.RULE_damage;
	}
	public enterRule(listener: AttackListener): void {
	    if(listener.enterDamage) {
	 		listener.enterDamage(this);
		}
	}
	public exitRule(listener: AttackListener): void {
	    if(listener.exitDamage) {
	 		listener.exitDamage(this);
		}
	}
}
