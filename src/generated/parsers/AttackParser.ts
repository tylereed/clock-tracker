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
	public static readonly MELEE = 18;
	public static readonly RANGED = 19;
	public static readonly WEAPON = 20;
	public static readonly SPELL = 21;
	public static readonly DICE = 22;
	public static readonly DAMAGE_TYPE = 23;
	public static readonly NUMBER = 24;
	public static readonly NUMBER_TEXT = 25;
	public static readonly TEXT = 26;
	public static readonly MARKUP = 27;
	public static override readonly EOF = Token.EOF;
	public static readonly RULE_attack = 0;
	public static readonly RULE_attackType = 1;
	public static readonly RULE_meleeRanged = 2;
	public static readonly RULE_weaponSpell = 3;
	public static readonly RULE_toHit = 4;
	public static readonly RULE_reach = 5;
	public static readonly RULE_targets = 6;
	public static readonly RULE_damage = 7;
	public static readonly literalNames: (string | null)[] = [ null, "': '", 
                                                            "', '", "','", 
                                                            "'.'", "' '", 
                                                            "' Attack'", 
                                                            "' or '", "'+'", 
                                                            "' to hit'", 
                                                            "'reach '", 
                                                            "' ft.'", "' target'", 
                                                            "'s'", "'Hit: '", 
                                                            "' ('", "') '", 
                                                            "' damage'", 
                                                            "'Melee'", "'Ranged'", 
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
                                                             "MELEE", "RANGED", 
                                                             "WEAPON", "SPELL", 
                                                             "DICE", "DAMAGE_TYPE", 
                                                             "NUMBER", "NUMBER_TEXT", 
                                                             "TEXT", "MARKUP" ];
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"attack", "attackType", "meleeRanged", "weaponSpell", "toHit", "reach", 
		"targets", "damage",
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
			this.state = 16;
			this.attackType();
			this.state = 17;
			this.match(AttackParser.T__0);
			this.state = 18;
			this.toHit();
			this.state = 19;
			this.match(AttackParser.T__1);
			this.state = 23;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===10 || _la===24) {
				{
				this.state = 20;
				this.reach();
				this.state = 21;
				this.match(AttackParser.T__1);
				}
			}

			this.state = 25;
			this.targets();
			this.state = 27;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===3) {
				{
				this.state = 26;
				this.match(AttackParser.T__2);
				}
			}

			this.state = 30;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===4) {
				{
				this.state = 29;
				this.match(AttackParser.T__3);
				}
			}

			this.state = 32;
			this.match(AttackParser.T__4);
			this.state = 33;
			this.damage();
			this.state = 37;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 3, this._ctx);
			while (_alt !== 1 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1 + 1) {
					{
					{
					this.state = 34;
					this.match(AttackParser.TEXT);
					}
					}
				}
				this.state = 39;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 3, this._ctx);
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
			this.state = 40;
			this.meleeRanged();
			this.state = 41;
			this.match(AttackParser.T__4);
			this.state = 42;
			this.weaponSpell();
			this.state = 43;
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
			this.state = 50;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 4, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 45;
				this.match(AttackParser.MELEE);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 46;
				this.match(AttackParser.RANGED);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 47;
				this.match(AttackParser.MELEE);
				this.state = 48;
				this.match(AttackParser.T__6);
				this.state = 49;
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
			this.state = 52;
			_la = this._input.LA(1);
			if(!(_la===20 || _la===21)) {
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
			this.state = 54;
			this.match(AttackParser.T__7);
			this.state = 55;
			this.match(AttackParser.NUMBER);
			this.state = 56;
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
	public reach(): ReachContext {
		let localctx: ReachContext = new ReachContext(this, this._ctx, this.state);
		this.enterRule(localctx, 10, AttackParser.RULE_reach);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 59;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===10) {
				{
				this.state = 58;
				this.match(AttackParser.T__9);
				}
			}

			this.state = 61;
			this.match(AttackParser.NUMBER);
			this.state = 62;
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
		this.enterRule(localctx, 12, AttackParser.RULE_targets);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 64;
			this.match(AttackParser.NUMBER_TEXT);
			this.state = 65;
			this.match(AttackParser.T__11);
			this.state = 67;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===13) {
				{
				this.state = 66;
				this.match(AttackParser.T__12);
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
		this.enterRule(localctx, 14, AttackParser.RULE_damage);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 69;
			this.match(AttackParser.T__13);
			this.state = 70;
			this.match(AttackParser.NUMBER);
			this.state = 71;
			this.match(AttackParser.T__14);
			this.state = 72;
			this.match(AttackParser.DICE);
			this.state = 73;
			this.match(AttackParser.T__15);
			this.state = 74;
			this.match(AttackParser.DAMAGE_TYPE);
			this.state = 75;
			this.match(AttackParser.T__16);
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

	public static readonly _serializedATN: number[] = [4,1,27,78,2,0,7,0,2,
	1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,1,0,1,0,1,0,1,0,1,
	0,1,0,1,0,3,0,24,8,0,1,0,1,0,3,0,28,8,0,1,0,3,0,31,8,0,1,0,1,0,1,0,5,0,
	36,8,0,10,0,12,0,39,9,0,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,2,1,2,1,2,3,2,51,
	8,2,1,3,1,3,1,4,1,4,1,4,1,4,1,5,3,5,60,8,5,1,5,1,5,1,5,1,6,1,6,1,6,3,6,
	68,8,6,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,7,1,37,0,8,0,2,4,6,8,10,12,14,
	0,1,1,0,20,21,77,0,16,1,0,0,0,2,40,1,0,0,0,4,50,1,0,0,0,6,52,1,0,0,0,8,
	54,1,0,0,0,10,59,1,0,0,0,12,64,1,0,0,0,14,69,1,0,0,0,16,17,3,2,1,0,17,18,
	5,1,0,0,18,19,3,8,4,0,19,23,5,2,0,0,20,21,3,10,5,0,21,22,5,2,0,0,22,24,
	1,0,0,0,23,20,1,0,0,0,23,24,1,0,0,0,24,25,1,0,0,0,25,27,3,12,6,0,26,28,
	5,3,0,0,27,26,1,0,0,0,27,28,1,0,0,0,28,30,1,0,0,0,29,31,5,4,0,0,30,29,1,
	0,0,0,30,31,1,0,0,0,31,32,1,0,0,0,32,33,5,5,0,0,33,37,3,14,7,0,34,36,5,
	26,0,0,35,34,1,0,0,0,36,39,1,0,0,0,37,38,1,0,0,0,37,35,1,0,0,0,38,1,1,0,
	0,0,39,37,1,0,0,0,40,41,3,4,2,0,41,42,5,5,0,0,42,43,3,6,3,0,43,44,5,6,0,
	0,44,3,1,0,0,0,45,51,5,18,0,0,46,51,5,19,0,0,47,48,5,18,0,0,48,49,5,7,0,
	0,49,51,5,19,0,0,50,45,1,0,0,0,50,46,1,0,0,0,50,47,1,0,0,0,51,5,1,0,0,0,
	52,53,7,0,0,0,53,7,1,0,0,0,54,55,5,8,0,0,55,56,5,24,0,0,56,57,5,9,0,0,57,
	9,1,0,0,0,58,60,5,10,0,0,59,58,1,0,0,0,59,60,1,0,0,0,60,61,1,0,0,0,61,62,
	5,24,0,0,62,63,5,11,0,0,63,11,1,0,0,0,64,65,5,25,0,0,65,67,5,12,0,0,66,
	68,5,13,0,0,67,66,1,0,0,0,67,68,1,0,0,0,68,13,1,0,0,0,69,70,5,14,0,0,70,
	71,5,24,0,0,71,72,5,15,0,0,72,73,5,22,0,0,73,74,5,16,0,0,74,75,5,23,0,0,
	75,76,5,17,0,0,76,15,1,0,0,0,7,23,27,30,37,50,59,67];

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
	public targets(): TargetsContext {
		return this.getTypedRuleContext(TargetsContext, 0) as TargetsContext;
	}
	public damage(): DamageContext {
		return this.getTypedRuleContext(DamageContext, 0) as DamageContext;
	}
	public reach(): ReachContext {
		return this.getTypedRuleContext(ReachContext, 0) as ReachContext;
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
