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
	public static readonly T__19 = 20;
	public static readonly T__20 = 21;
	public static readonly T__21 = 22;
	public static readonly T__22 = 23;
	public static readonly MARKUP = 24;
	public static readonly MELEE = 25;
	public static readonly RANGED = 26;
	public static readonly WEAPON = 27;
	public static readonly SPELL = 28;
	public static readonly DICE = 29;
	public static readonly DAMAGE_TYPE = 30;
	public static readonly NUMBER = 31;
	public static readonly NUMBER_TEXT = 32;
	public static readonly TEXT = 33;
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
	public static readonly RULE_hit = 9;
	public static readonly RULE_damage = 10;
	public static readonly RULE_plusDamage = 11;
	public static readonly RULE_versatileDamage = 12;
	public static readonly RULE_extraText = 13;
	public static readonly literalNames: (string | null)[] = [ null, "':'", 
                                                            "' '", "', '", 
                                                            "','", "'.'", 
                                                            "' Attack'", 
                                                            "' or '", "'+'", 
                                                            "' to hit'", 
                                                            "'reach '", 
                                                            "' ft.'", "'range '", 
                                                            "'/'", "'target'", 
                                                            "'targets'", 
                                                            "'Hit:'", "' ('", 
                                                            "') '", "' damage'", 
                                                            "' plus'", "', or '", 
                                                            "' if used with two hands'", 
                                                            "' to make a melee attack'", 
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
		"reach", "range", "targets", "hit", "damage", "plusDamage", "versatileDamage", 
		"extraText",
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
			this.state = 28;
			this.attackType();
			this.state = 29;
			this.match(AttackParser.T__0);
			this.state = 30;
			this.match(AttackParser.T__1);
			this.state = 31;
			this.toHit();
			this.state = 32;
			this.match(AttackParser.T__2);
			this.state = 33;
			this.distance();
			this.state = 34;
			this.match(AttackParser.T__2);
			this.state = 35;
			this.targets();
			this.state = 37;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===4) {
				{
				this.state = 36;
				this.match(AttackParser.T__3);
				}
			}

			this.state = 40;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===5) {
				{
				this.state = 39;
				this.match(AttackParser.T__4);
				}
			}

			this.state = 42;
			this.match(AttackParser.T__1);
			this.state = 43;
			this.hit();
			this.state = 44;
			this.extraText();
			this.state = 45;
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
			this.state = 47;
			this.meleeRanged();
			this.state = 48;
			this.match(AttackParser.T__1);
			this.state = 49;
			this.weaponSpell();
			this.state = 50;
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
			this.state = 57;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 2, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 52;
				this.match(AttackParser.MELEE);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 53;
				this.match(AttackParser.RANGED);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 54;
				this.match(AttackParser.MELEE);
				this.state = 55;
				this.match(AttackParser.T__6);
				this.state = 56;
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
			this.state = 59;
			_la = this._input.LA(1);
			if(!(_la===27 || _la===28)) {
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
			this.state = 61;
			this.match(AttackParser.T__7);
			this.state = 62;
			this.match(AttackParser.NUMBER);
			this.state = 63;
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
			this.state = 71;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 3, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 65;
				this.reach();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 66;
				this.range();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 67;
				this.reach();
				this.state = 68;
				this.match(AttackParser.T__6);
				this.state = 69;
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
			this.state = 74;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===10) {
				{
				this.state = 73;
				this.match(AttackParser.T__9);
				}
			}

			this.state = 76;
			this.match(AttackParser.NUMBER);
			this.state = 77;
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
			this.state = 79;
			this.match(AttackParser.T__11);
			this.state = 80;
			this.match(AttackParser.NUMBER);
			this.state = 83;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===13) {
				{
				this.state = 81;
				this.match(AttackParser.T__12);
				this.state = 82;
				this.match(AttackParser.NUMBER);
				}
			}

			this.state = 85;
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
			this.state = 87;
			this.match(AttackParser.NUMBER_TEXT);
			this.state = 88;
			this.match(AttackParser.T__1);
			this.state = 89;
			_la = this._input.LA(1);
			if(!(_la===14 || _la===15)) {
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
	public hit(): HitContext {
		let localctx: HitContext = new HitContext(this, this._ctx, this.state);
		this.enterRule(localctx, 18, AttackParser.RULE_hit);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 91;
			this.damage();
			this.state = 93;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===20) {
				{
				this.state = 92;
				this.plusDamage();
				}
			}

			this.state = 96;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===7 || _la===21) {
				{
				this.state = 95;
				this.versatileDamage();
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
		this.enterRule(localctx, 20, AttackParser.RULE_damage);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 98;
			this.match(AttackParser.T__15);
			this.state = 99;
			this.match(AttackParser.T__1);
			this.state = 100;
			this.match(AttackParser.NUMBER);
			this.state = 101;
			this.match(AttackParser.T__16);
			this.state = 102;
			this.match(AttackParser.DICE);
			this.state = 103;
			this.match(AttackParser.T__17);
			this.state = 104;
			this.match(AttackParser.DAMAGE_TYPE);
			this.state = 105;
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
	public plusDamage(): PlusDamageContext {
		let localctx: PlusDamageContext = new PlusDamageContext(this, this._ctx, this.state);
		this.enterRule(localctx, 22, AttackParser.RULE_plusDamage);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 107;
			this.match(AttackParser.T__19);
			this.state = 108;
			this.match(AttackParser.T__1);
			this.state = 109;
			this.match(AttackParser.NUMBER);
			this.state = 110;
			this.match(AttackParser.T__16);
			this.state = 111;
			this.match(AttackParser.DICE);
			this.state = 112;
			this.match(AttackParser.T__17);
			this.state = 113;
			this.match(AttackParser.DAMAGE_TYPE);
			this.state = 114;
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
	public versatileDamage(): VersatileDamageContext {
		let localctx: VersatileDamageContext = new VersatileDamageContext(this, this._ctx, this.state);
		this.enterRule(localctx, 24, AttackParser.RULE_versatileDamage);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 116;
			_la = this._input.LA(1);
			if(!(_la===7 || _la===21)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 117;
			this.match(AttackParser.NUMBER);
			this.state = 118;
			this.match(AttackParser.T__16);
			this.state = 119;
			this.match(AttackParser.DICE);
			this.state = 120;
			this.match(AttackParser.T__17);
			this.state = 121;
			this.match(AttackParser.DAMAGE_TYPE);
			this.state = 122;
			this.match(AttackParser.T__18);
			this.state = 124;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===20) {
				{
				this.state = 123;
				this.plusDamage();
				}
			}

			this.state = 126;
			this.match(AttackParser.T__21);
			this.state = 128;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===23) {
				{
				this.state = 127;
				this.match(AttackParser.T__22);
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
	public extraText(): ExtraTextContext {
		let localctx: ExtraTextContext = new ExtraTextContext(this, this._ctx, this.state);
		this.enterRule(localctx, 26, AttackParser.RULE_extraText);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 133;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 10, this._ctx);
			while (_alt !== 1 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1 + 1) {
					{
					{
					this.state = 130;
					this.match(AttackParser.TEXT);
					}
					}
				}
				this.state = 135;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 10, this._ctx);
			}
			this.state = 136;
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

	public static readonly _serializedATN: number[] = [4,1,33,139,2,0,7,0,2,
	1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,
	10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,
	0,3,0,38,8,0,1,0,3,0,41,8,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,2,
	1,2,1,2,1,2,1,2,3,2,58,8,2,1,3,1,3,1,4,1,4,1,4,1,4,1,5,1,5,1,5,1,5,1,5,
	1,5,3,5,72,8,5,1,6,3,6,75,8,6,1,6,1,6,1,6,1,7,1,7,1,7,1,7,3,7,84,8,7,1,
	7,1,7,1,8,1,8,1,8,1,8,1,9,1,9,3,9,94,8,9,1,9,3,9,97,8,9,1,10,1,10,1,10,
	1,10,1,10,1,10,1,10,1,10,1,10,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,
	11,1,12,1,12,1,12,1,12,1,12,1,12,1,12,1,12,3,12,125,8,12,1,12,1,12,3,12,
	129,8,12,1,13,5,13,132,8,13,10,13,12,13,135,9,13,1,13,1,13,1,13,1,133,0,
	14,0,2,4,6,8,10,12,14,16,18,20,22,24,26,0,3,1,0,27,28,1,0,14,15,2,0,7,7,
	21,21,137,0,28,1,0,0,0,2,47,1,0,0,0,4,57,1,0,0,0,6,59,1,0,0,0,8,61,1,0,
	0,0,10,71,1,0,0,0,12,74,1,0,0,0,14,79,1,0,0,0,16,87,1,0,0,0,18,91,1,0,0,
	0,20,98,1,0,0,0,22,107,1,0,0,0,24,116,1,0,0,0,26,133,1,0,0,0,28,29,3,2,
	1,0,29,30,5,1,0,0,30,31,5,2,0,0,31,32,3,8,4,0,32,33,5,3,0,0,33,34,3,10,
	5,0,34,35,5,3,0,0,35,37,3,16,8,0,36,38,5,4,0,0,37,36,1,0,0,0,37,38,1,0,
	0,0,38,40,1,0,0,0,39,41,5,5,0,0,40,39,1,0,0,0,40,41,1,0,0,0,41,42,1,0,0,
	0,42,43,5,2,0,0,43,44,3,18,9,0,44,45,3,26,13,0,45,46,5,0,0,1,46,1,1,0,0,
	0,47,48,3,4,2,0,48,49,5,2,0,0,49,50,3,6,3,0,50,51,5,6,0,0,51,3,1,0,0,0,
	52,58,5,25,0,0,53,58,5,26,0,0,54,55,5,25,0,0,55,56,5,7,0,0,56,58,5,26,0,
	0,57,52,1,0,0,0,57,53,1,0,0,0,57,54,1,0,0,0,58,5,1,0,0,0,59,60,7,0,0,0,
	60,7,1,0,0,0,61,62,5,8,0,0,62,63,5,31,0,0,63,64,5,9,0,0,64,9,1,0,0,0,65,
	72,3,12,6,0,66,72,3,14,7,0,67,68,3,12,6,0,68,69,5,7,0,0,69,70,3,14,7,0,
	70,72,1,0,0,0,71,65,1,0,0,0,71,66,1,0,0,0,71,67,1,0,0,0,72,11,1,0,0,0,73,
	75,5,10,0,0,74,73,1,0,0,0,74,75,1,0,0,0,75,76,1,0,0,0,76,77,5,31,0,0,77,
	78,5,11,0,0,78,13,1,0,0,0,79,80,5,12,0,0,80,83,5,31,0,0,81,82,5,13,0,0,
	82,84,5,31,0,0,83,81,1,0,0,0,83,84,1,0,0,0,84,85,1,0,0,0,85,86,5,11,0,0,
	86,15,1,0,0,0,87,88,5,32,0,0,88,89,5,2,0,0,89,90,7,1,0,0,90,17,1,0,0,0,
	91,93,3,20,10,0,92,94,3,22,11,0,93,92,1,0,0,0,93,94,1,0,0,0,94,96,1,0,0,
	0,95,97,3,24,12,0,96,95,1,0,0,0,96,97,1,0,0,0,97,19,1,0,0,0,98,99,5,16,
	0,0,99,100,5,2,0,0,100,101,5,31,0,0,101,102,5,17,0,0,102,103,5,29,0,0,103,
	104,5,18,0,0,104,105,5,30,0,0,105,106,5,19,0,0,106,21,1,0,0,0,107,108,5,
	20,0,0,108,109,5,2,0,0,109,110,5,31,0,0,110,111,5,17,0,0,111,112,5,29,0,
	0,112,113,5,18,0,0,113,114,5,30,0,0,114,115,5,19,0,0,115,23,1,0,0,0,116,
	117,7,2,0,0,117,118,5,31,0,0,118,119,5,17,0,0,119,120,5,29,0,0,120,121,
	5,18,0,0,121,122,5,30,0,0,122,124,5,19,0,0,123,125,3,22,11,0,124,123,1,
	0,0,0,124,125,1,0,0,0,125,126,1,0,0,0,126,128,5,22,0,0,127,129,5,23,0,0,
	128,127,1,0,0,0,128,129,1,0,0,0,129,25,1,0,0,0,130,132,5,33,0,0,131,130,
	1,0,0,0,132,135,1,0,0,0,133,134,1,0,0,0,133,131,1,0,0,0,134,136,1,0,0,0,
	135,133,1,0,0,0,136,137,5,5,0,0,137,27,1,0,0,0,11,37,40,57,71,74,83,93,
	96,124,128,133];

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
	public hit(): HitContext {
		return this.getTypedRuleContext(HitContext, 0) as HitContext;
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


export class HitContext extends ParserRuleContext {
	constructor(parser?: AttackParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public damage(): DamageContext {
		return this.getTypedRuleContext(DamageContext, 0) as DamageContext;
	}
	public plusDamage(): PlusDamageContext {
		return this.getTypedRuleContext(PlusDamageContext, 0) as PlusDamageContext;
	}
	public versatileDamage(): VersatileDamageContext {
		return this.getTypedRuleContext(VersatileDamageContext, 0) as VersatileDamageContext;
	}
    public get ruleIndex(): number {
    	return AttackParser.RULE_hit;
	}
	public enterRule(listener: AttackListener): void {
	    if(listener.enterHit) {
	 		listener.enterHit(this);
		}
	}
	public exitRule(listener: AttackListener): void {
	    if(listener.exitHit) {
	 		listener.exitHit(this);
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


export class PlusDamageContext extends ParserRuleContext {
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
    	return AttackParser.RULE_plusDamage;
	}
	public enterRule(listener: AttackListener): void {
	    if(listener.enterPlusDamage) {
	 		listener.enterPlusDamage(this);
		}
	}
	public exitRule(listener: AttackListener): void {
	    if(listener.exitPlusDamage) {
	 		listener.exitPlusDamage(this);
		}
	}
}


export class VersatileDamageContext extends ParserRuleContext {
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
	public plusDamage(): PlusDamageContext {
		return this.getTypedRuleContext(PlusDamageContext, 0) as PlusDamageContext;
	}
    public get ruleIndex(): number {
    	return AttackParser.RULE_versatileDamage;
	}
	public enterRule(listener: AttackListener): void {
	    if(listener.enterVersatileDamage) {
	 		listener.enterVersatileDamage(this);
		}
	}
	public exitRule(listener: AttackListener): void {
	    if(listener.exitVersatileDamage) {
	 		listener.exitVersatileDamage(this);
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
