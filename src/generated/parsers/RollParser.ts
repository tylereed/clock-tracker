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
	public static readonly NUMBER = 3;
	public static readonly WHITESPACE = 4;
	public static override readonly EOF = Token.EOF;
	public static readonly RULE_roll = 0;
	public static readonly literalNames: (string | null)[] = [ null, "'d'", 
                                                            "'+'", null, 
                                                            "' \\r\\n\\t'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, null, 
                                                             null, "NUMBER", 
                                                             "WHITESPACE" ];
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"roll",
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
			this.state = 3;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===3) {
				{
				this.state = 2;
				this.match(RollParser.NUMBER);
				}
			}

			this.state = 5;
			this.match(RollParser.T__0);
			this.state = 6;
			this.match(RollParser.NUMBER);
			this.state = 9;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===2) {
				{
				this.state = 7;
				this.match(RollParser.T__1);
				this.state = 8;
				this.match(RollParser.NUMBER);
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

	public static readonly _serializedATN: number[] = [4,1,4,12,2,0,7,0,1,0,
	3,0,4,8,0,1,0,1,0,1,0,1,0,3,0,10,8,0,1,0,0,0,1,0,0,0,12,0,3,1,0,0,0,2,4,
	5,3,0,0,3,2,1,0,0,0,3,4,1,0,0,0,4,5,1,0,0,0,5,6,5,1,0,0,6,9,5,3,0,0,7,8,
	5,2,0,0,8,10,5,3,0,0,9,7,1,0,0,0,9,10,1,0,0,0,10,1,1,0,0,0,2,3,9];

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
	public NUMBER_list(): TerminalNode[] {
	    	return this.getTokens(RollParser.NUMBER);
	}
	public NUMBER(i: number): TerminalNode {
		return this.getToken(RollParser.NUMBER, i);
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
