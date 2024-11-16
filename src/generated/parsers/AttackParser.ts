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
	public static readonly TEXT = 5;
	public static readonly MELEE = 6;
	public static readonly RANGED = 7;
	public static readonly WEAPON = 8;
	public static readonly SPELL = 9;
	public static readonly MARKUP = 10;
	public static override readonly EOF = Token.EOF;
	public static readonly RULE_attack = 0;
	public static readonly RULE_attack_type = 1;
	public static readonly RULE_melee_ranged = 2;
	public static readonly RULE_weapon_spell = 3;
	public static readonly literalNames: (string | null)[] = [ null, "': '", 
                                                            "' '", "' Attack'", 
                                                            "' or '", null, 
                                                            "'Melee'", "'Ranged'", 
                                                            "'Weapon'", 
                                                            "'Spell'", "'_'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, null, 
                                                             null, null, 
                                                             null, "TEXT", 
                                                             "MELEE", "RANGED", 
                                                             "WEAPON", "SPELL", 
                                                             "MARKUP" ];
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"attack", "attack_type", "melee_ranged", "weapon_spell",
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
			this.state = 8;
			this.attack_type();
			this.state = 9;
			this.match(AttackParser.T__0);
			this.state = 11;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 10;
				this.match(AttackParser.TEXT);
				}
				}
				this.state = 13;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la===5);
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
	public attack_type(): Attack_typeContext {
		let localctx: Attack_typeContext = new Attack_typeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 2, AttackParser.RULE_attack_type);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 15;
			this.melee_ranged();
			this.state = 16;
			this.match(AttackParser.T__1);
			this.state = 17;
			this.weapon_spell();
			this.state = 18;
			this.match(AttackParser.T__2);
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
	public melee_ranged(): Melee_rangedContext {
		let localctx: Melee_rangedContext = new Melee_rangedContext(this, this._ctx, this.state);
		this.enterRule(localctx, 4, AttackParser.RULE_melee_ranged);
		try {
			this.state = 25;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 1, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 20;
				this.match(AttackParser.MELEE);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 21;
				this.match(AttackParser.RANGED);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 22;
				this.match(AttackParser.MELEE);
				this.state = 23;
				this.match(AttackParser.T__3);
				this.state = 24;
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
	public weapon_spell(): Weapon_spellContext {
		let localctx: Weapon_spellContext = new Weapon_spellContext(this, this._ctx, this.state);
		this.enterRule(localctx, 6, AttackParser.RULE_weapon_spell);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 27;
			_la = this._input.LA(1);
			if(!(_la===8 || _la===9)) {
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

	public static readonly _serializedATN: number[] = [4,1,10,30,2,0,7,0,2,
	1,7,1,2,2,7,2,2,3,7,3,1,0,1,0,1,0,4,0,12,8,0,11,0,12,0,13,1,1,1,1,1,1,1,
	1,1,1,1,2,1,2,1,2,1,2,1,2,3,2,26,8,2,1,3,1,3,1,3,0,0,4,0,2,4,6,0,1,1,0,
	8,9,28,0,8,1,0,0,0,2,15,1,0,0,0,4,25,1,0,0,0,6,27,1,0,0,0,8,9,3,2,1,0,9,
	11,5,1,0,0,10,12,5,5,0,0,11,10,1,0,0,0,12,13,1,0,0,0,13,11,1,0,0,0,13,14,
	1,0,0,0,14,1,1,0,0,0,15,16,3,4,2,0,16,17,5,2,0,0,17,18,3,6,3,0,18,19,5,
	3,0,0,19,3,1,0,0,0,20,26,5,6,0,0,21,26,5,7,0,0,22,23,5,6,0,0,23,24,5,4,
	0,0,24,26,5,7,0,0,25,20,1,0,0,0,25,21,1,0,0,0,25,22,1,0,0,0,26,5,1,0,0,
	0,27,28,7,0,0,0,28,7,1,0,0,0,2,13,25];

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
	public attack_type(): Attack_typeContext {
		return this.getTypedRuleContext(Attack_typeContext, 0) as Attack_typeContext;
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


export class Attack_typeContext extends ParserRuleContext {
	constructor(parser?: AttackParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public melee_ranged(): Melee_rangedContext {
		return this.getTypedRuleContext(Melee_rangedContext, 0) as Melee_rangedContext;
	}
	public weapon_spell(): Weapon_spellContext {
		return this.getTypedRuleContext(Weapon_spellContext, 0) as Weapon_spellContext;
	}
    public get ruleIndex(): number {
    	return AttackParser.RULE_attack_type;
	}
	public enterRule(listener: AttackListener): void {
	    if(listener.enterAttack_type) {
	 		listener.enterAttack_type(this);
		}
	}
	public exitRule(listener: AttackListener): void {
	    if(listener.exitAttack_type) {
	 		listener.exitAttack_type(this);
		}
	}
}


export class Melee_rangedContext extends ParserRuleContext {
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
    	return AttackParser.RULE_melee_ranged;
	}
	public enterRule(listener: AttackListener): void {
	    if(listener.enterMelee_ranged) {
	 		listener.enterMelee_ranged(this);
		}
	}
	public exitRule(listener: AttackListener): void {
	    if(listener.exitMelee_ranged) {
	 		listener.exitMelee_ranged(this);
		}
	}
}


export class Weapon_spellContext extends ParserRuleContext {
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
    	return AttackParser.RULE_weapon_spell;
	}
	public enterRule(listener: AttackListener): void {
	    if(listener.enterWeapon_spell) {
	 		listener.enterWeapon_spell(this);
		}
	}
	public exitRule(listener: AttackListener): void {
	    if(listener.exitWeapon_spell) {
	 		listener.exitWeapon_spell(this);
		}
	}
}
