// Generated from grammars/Roll.g4 by ANTLR 4.13.2
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
import RollListener from "./RollListener.js";
// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;

export default class RollParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly NUMBER = 4;
	public static readonly WHITESPACE = 5;
	public static override readonly EOF = Token.EOF;
	public static readonly RULE_roll = 0;
	public static readonly RULE_count = 1;
	public static readonly RULE_sides = 2;
	public static readonly RULE_modifier = 3;
	public static readonly literalNames: (string | null)[] = [ null, "'d'", 
                                                            "'+'", "'-'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, null, 
                                                             null, null, 
                                                             "NUMBER", "WHITESPACE" ];
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"roll", "count", "sides", "modifier",
	];
	public get grammarFileName(): string { return "Roll.g4"; }
	public get literalNames(): (string | null)[] { return RollParser.literalNames; }
	public get symbolicNames(): (string | null)[] { return RollParser.symbolicNames; }
	public get ruleNames(): string[] { return RollParser.ruleNames; }
	public get serializedATN(): number[] { return RollParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(this, RollParser._ATN, RollParser.DecisionsToDFA, new PredictionContextCache());
	}
	// @RuleVersion(0)
	public roll(): RollContext {
		let localctx: RollContext = new RollContext(this, this._ctx, this.state);
		this.enterRule(localctx, 0, RollParser.RULE_roll);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 9;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===4) {
				{
				this.state = 8;
				this.count();
				}
			}

			this.state = 11;
			this.match(RollParser.T__0);
			this.state = 12;
			this.sides();
			this.state = 14;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===2 || _la===3) {
				{
				this.state = 13;
				this.modifier();
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
	public count(): CountContext {
		let localctx: CountContext = new CountContext(this, this._ctx, this.state);
		this.enterRule(localctx, 2, RollParser.RULE_count);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 16;
			this.match(RollParser.NUMBER);
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
	public sides(): SidesContext {
		let localctx: SidesContext = new SidesContext(this, this._ctx, this.state);
		this.enterRule(localctx, 4, RollParser.RULE_sides);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 18;
			this.match(RollParser.NUMBER);
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
	public modifier(): ModifierContext {
		let localctx: ModifierContext = new ModifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 6, RollParser.RULE_modifier);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 20;
			_la = this._input.LA(1);
			if(!(_la===2 || _la===3)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 21;
			this.match(RollParser.NUMBER);
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

	public static readonly _serializedATN: number[] = [4,1,5,24,2,0,7,0,2,1,
	7,1,2,2,7,2,2,3,7,3,1,0,3,0,10,8,0,1,0,1,0,1,0,3,0,15,8,0,1,1,1,1,1,2,1,
	2,1,3,1,3,1,3,1,3,0,0,4,0,2,4,6,0,1,1,0,2,3,21,0,9,1,0,0,0,2,16,1,0,0,0,
	4,18,1,0,0,0,6,20,1,0,0,0,8,10,3,2,1,0,9,8,1,0,0,0,9,10,1,0,0,0,10,11,1,
	0,0,0,11,12,5,1,0,0,12,14,3,4,2,0,13,15,3,6,3,0,14,13,1,0,0,0,14,15,1,0,
	0,0,15,1,1,0,0,0,16,17,5,4,0,0,17,3,1,0,0,0,18,19,5,4,0,0,19,5,1,0,0,0,
	20,21,7,0,0,0,21,22,5,4,0,0,22,7,1,0,0,0,2,9,14];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!RollParser.__ATN) {
			RollParser.__ATN = new ATNDeserializer().deserialize(RollParser._serializedATN);
		}

		return RollParser.__ATN;
	}


	static DecisionsToDFA = RollParser._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );

}

export class RollContext extends ParserRuleContext {
	constructor(parser?: RollParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public sides(): SidesContext {
		return this.getTypedRuleContext(SidesContext, 0) as SidesContext;
	}
	public count(): CountContext {
		return this.getTypedRuleContext(CountContext, 0) as CountContext;
	}
	public modifier(): ModifierContext {
		return this.getTypedRuleContext(ModifierContext, 0) as ModifierContext;
	}
    public get ruleIndex(): number {
    	return RollParser.RULE_roll;
	}
	public enterRule(listener: RollListener): void {
	    if(listener.enterRoll) {
	 		listener.enterRoll(this);
		}
	}
	public exitRule(listener: RollListener): void {
	    if(listener.exitRoll) {
	 		listener.exitRoll(this);
		}
	}
}


export class CountContext extends ParserRuleContext {
	constructor(parser?: RollParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NUMBER(): TerminalNode {
		return this.getToken(RollParser.NUMBER, 0);
	}
    public get ruleIndex(): number {
    	return RollParser.RULE_count;
	}
	public enterRule(listener: RollListener): void {
	    if(listener.enterCount) {
	 		listener.enterCount(this);
		}
	}
	public exitRule(listener: RollListener): void {
	    if(listener.exitCount) {
	 		listener.exitCount(this);
		}
	}
}


export class SidesContext extends ParserRuleContext {
	constructor(parser?: RollParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NUMBER(): TerminalNode {
		return this.getToken(RollParser.NUMBER, 0);
	}
    public get ruleIndex(): number {
    	return RollParser.RULE_sides;
	}
	public enterRule(listener: RollListener): void {
	    if(listener.enterSides) {
	 		listener.enterSides(this);
		}
	}
	public exitRule(listener: RollListener): void {
	    if(listener.exitSides) {
	 		listener.exitSides(this);
		}
	}
}


export class ModifierContext extends ParserRuleContext {
	constructor(parser?: RollParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NUMBER(): TerminalNode {
		return this.getToken(RollParser.NUMBER, 0);
	}
    public get ruleIndex(): number {
    	return RollParser.RULE_modifier;
	}
	public enterRule(listener: RollListener): void {
	    if(listener.enterModifier) {
	 		listener.enterModifier(this);
		}
	}
	public exitRule(listener: RollListener): void {
	    if(listener.exitModifier) {
	 		listener.exitModifier(this);
		}
	}
}
