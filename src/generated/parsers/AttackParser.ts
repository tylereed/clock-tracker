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
	public static readonly RULE_extraText = 10;
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
		"reach", "range", "targets", "damage", "extraText",
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
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 22;
			this.attackType();
			this.state = 23;
			this.match(AttackParser.T__0);
			this.state = 24;
			this.match(AttackParser.T__1);
			this.state = 25;
			this.toHit();
			this.state = 26;
			this.match(AttackParser.T__2);
			this.state = 27;
			this.distance();
			this.state = 28;
			this.match(AttackParser.T__2);
			this.state = 29;
			this.targets();
			this.state = 31;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===4) {
				{
				this.state = 30;
				this.match(AttackParser.T__3);
				}
			}

			this.state = 34;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===5) {
				{
				this.state = 33;
				this.match(AttackParser.T__4);
				}
			}

			this.state = 36;
			this.match(AttackParser.T__1);
			this.state = 37;
			this.damage();
			this.state = 38;
			this.extraText();
			this.state = 39;
			this.match(AttackParser.EOF);
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
			this.state = 41;
			this.meleeRanged();
			this.state = 42;
			this.match(AttackParser.T__1);
			this.state = 43;
			this.weaponSpell();
			this.state = 44;
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
			this.state = 51;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 2, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 46;
				this.match(AttackParser.MELEE);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 47;
				this.match(AttackParser.RANGED);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 48;
				this.match(AttackParser.MELEE);
				this.state = 49;
				this.match(AttackParser.T__6);
				this.state = 50;
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
			this.state = 53;
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
			this.state = 55;
			this.match(AttackParser.T__7);
			this.state = 56;
			this.match(AttackParser.NUMBER);
			this.state = 57;
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
			this.state = 65;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 3, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 59;
				this.reach();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 60;
				this.range();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 61;
				this.reach();
				this.state = 62;
				this.match(AttackParser.T__6);
				this.state = 63;
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
			this.state = 68;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===10) {
				{
				this.state = 67;
				this.match(AttackParser.T__9);
				}
			}

			this.state = 70;
			this.match(AttackParser.NUMBER);
			this.state = 71;
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
			this.state = 73;
			this.match(AttackParser.T__11);
			this.state = 74;
			this.match(AttackParser.NUMBER);
			this.state = 77;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===13) {
				{
				this.state = 75;
				this.match(AttackParser.T__12);
				this.state = 76;
				this.match(AttackParser.NUMBER);
				}
			}

			this.state = 79;
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
			this.state = 81;
			this.match(AttackParser.NUMBER_TEXT);
			this.state = 82;
			this.match(AttackParser.T__13);
			this.state = 84;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===15) {
				{
				this.state = 83;
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
			this.state = 86;
			this.match(AttackParser.T__15);
			this.state = 87;
			this.match(AttackParser.T__1);
			this.state = 88;
			this.match(AttackParser.NUMBER);
			this.state = 89;
			this.match(AttackParser.T__16);
			this.state = 90;
			this.match(AttackParser.DICE);
			this.state = 91;
			this.match(AttackParser.T__17);
			this.state = 92;
			this.match(AttackParser.DAMAGE_TYPE);
			this.state = 93;
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
	// @RuleVersion(0)
	public extraText(): ExtraTextContext {
		let localctx: ExtraTextContext = new ExtraTextContext(this, this._ctx, this.state);
		this.enterRule(localctx, 20, AttackParser.RULE_extraText);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 98;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 7, this._ctx);
			while (_alt !== 1 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1 + 1) {
					{
					{
					this.state = 95;
					this.match(AttackParser.TEXT);
					}
					}
				}
				this.state = 100;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 7, this._ctx);
			}
			this.state = 101;
			this.match(AttackParser.T__4);
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

	public static readonly _serializedATN: number[] = [4,1,29,104,2,0,7,0,2,
	1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,
	10,7,10,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,3,0,32,8,0,1,0,3,0,35,8,0,1,
	0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,2,1,2,1,2,3,2,52,8,2,1,
	3,1,3,1,4,1,4,1,4,1,4,1,5,1,5,1,5,1,5,1,5,1,5,3,5,66,8,5,1,6,3,6,69,8,6,
	1,6,1,6,1,6,1,7,1,7,1,7,1,7,3,7,78,8,7,1,7,1,7,1,8,1,8,1,8,3,8,85,8,8,1,
	9,1,9,1,9,1,9,1,9,1,9,1,9,1,9,1,9,1,10,5,10,97,8,10,10,10,12,10,100,9,10,
	1,10,1,10,1,10,1,98,0,11,0,2,4,6,8,10,12,14,16,18,20,0,1,1,0,23,24,102,
	0,22,1,0,0,0,2,41,1,0,0,0,4,51,1,0,0,0,6,53,1,0,0,0,8,55,1,0,0,0,10,65,
	1,0,0,0,12,68,1,0,0,0,14,73,1,0,0,0,16,81,1,0,0,0,18,86,1,0,0,0,20,98,1,
	0,0,0,22,23,3,2,1,0,23,24,5,1,0,0,24,25,5,2,0,0,25,26,3,8,4,0,26,27,5,3,
	0,0,27,28,3,10,5,0,28,29,5,3,0,0,29,31,3,16,8,0,30,32,5,4,0,0,31,30,1,0,
	0,0,31,32,1,0,0,0,32,34,1,0,0,0,33,35,5,5,0,0,34,33,1,0,0,0,34,35,1,0,0,
	0,35,36,1,0,0,0,36,37,5,2,0,0,37,38,3,18,9,0,38,39,3,20,10,0,39,40,5,0,
	0,1,40,1,1,0,0,0,41,42,3,4,2,0,42,43,5,2,0,0,43,44,3,6,3,0,44,45,5,6,0,
	0,45,3,1,0,0,0,46,52,5,21,0,0,47,52,5,22,0,0,48,49,5,21,0,0,49,50,5,7,0,
	0,50,52,5,22,0,0,51,46,1,0,0,0,51,47,1,0,0,0,51,48,1,0,0,0,52,5,1,0,0,0,
	53,54,7,0,0,0,54,7,1,0,0,0,55,56,5,8,0,0,56,57,5,27,0,0,57,58,5,9,0,0,58,
	9,1,0,0,0,59,66,3,12,6,0,60,66,3,14,7,0,61,62,3,12,6,0,62,63,5,7,0,0,63,
	64,3,14,7,0,64,66,1,0,0,0,65,59,1,0,0,0,65,60,1,0,0,0,65,61,1,0,0,0,66,
	11,1,0,0,0,67,69,5,10,0,0,68,67,1,0,0,0,68,69,1,0,0,0,69,70,1,0,0,0,70,
	71,5,27,0,0,71,72,5,11,0,0,72,13,1,0,0,0,73,74,5,12,0,0,74,77,5,27,0,0,
	75,76,5,13,0,0,76,78,5,27,0,0,77,75,1,0,0,0,77,78,1,0,0,0,78,79,1,0,0,0,
	79,80,5,11,0,0,80,15,1,0,0,0,81,82,5,28,0,0,82,84,5,14,0,0,83,85,5,15,0,
	0,84,83,1,0,0,0,84,85,1,0,0,0,85,17,1,0,0,0,86,87,5,16,0,0,87,88,5,2,0,
	0,88,89,5,27,0,0,89,90,5,17,0,0,90,91,5,25,0,0,91,92,5,18,0,0,92,93,5,26,
	0,0,93,94,5,19,0,0,94,19,1,0,0,0,95,97,5,29,0,0,96,95,1,0,0,0,97,100,1,
	0,0,0,98,99,1,0,0,0,98,96,1,0,0,0,99,101,1,0,0,0,100,98,1,0,0,0,101,102,
	5,5,0,0,102,21,1,0,0,0,8,31,34,51,65,68,77,84,98];

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
	public extraText(): ExtraTextContext {
		return this.getTypedRuleContext(ExtraTextContext, 0) as ExtraTextContext;
	}
	public EOF(): TerminalNode {
		return this.getToken(AttackParser.EOF, 0);
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


export class ExtraTextContext extends ParserRuleContext {
	constructor(parser?: AttackParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public TEXT_list(): TerminalNode[] {
	    	return this.getTokens(AttackParser.TEXT);
	}
	public TEXT(i: number): TerminalNode {
		return this.getToken(AttackParser.TEXT, i);
	}
    public get ruleIndex(): number {
    	return AttackParser.RULE_extraText;
	}
	public enterRule(listener: AttackListener): void {
	    if(listener.enterExtraText) {
	 		listener.enterExtraText(this);
		}
	}
	public exitRule(listener: AttackListener): void {
	    if(listener.exitExtraText) {
	 		listener.exitExtraText(this);
		}
	}
}
