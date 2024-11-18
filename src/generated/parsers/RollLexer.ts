// Generated from grammars/Roll.g4 by ANTLR 4.13.2
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols
import {
	ATN,
	ATNDeserializer,
	CharStream,
	DecisionState, DFA,
	Lexer,
	LexerATNSimulator,
	RuleContext,
	PredictionContextCache,
	Token
} from "antlr4";
export default class RollLexer extends Lexer {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly NUMBER = 4;
	public static readonly WHITESPACE = 5;
	public static readonly EOF = Token.EOF;

	public static readonly channelNames: string[] = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];
	public static readonly literalNames: (string | null)[] = [ null, "'d'", 
                                                            "'+'", "'-'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, null, 
                                                             null, null, 
                                                             "NUMBER", "WHITESPACE" ];
	public static readonly modeNames: string[] = [ "DEFAULT_MODE", ];

	public static readonly ruleNames: string[] = [
		"T__0", "T__1", "T__2", "NUMBER", "WHITESPACE",
	];


	constructor(input: CharStream) {
		super(input);
		this._interp = new LexerATNSimulator(this, RollLexer._ATN, RollLexer.DecisionsToDFA, new PredictionContextCache());
	}

	public get grammarFileName(): string { return "Roll.g4"; }

	public get literalNames(): (string | null)[] { return RollLexer.literalNames; }
	public get symbolicNames(): (string | null)[] { return RollLexer.symbolicNames; }
	public get ruleNames(): string[] { return RollLexer.ruleNames; }

	public get serializedATN(): number[] { return RollLexer._serializedATN; }

	public get channelNames(): string[] { return RollLexer.channelNames; }

	public get modeNames(): string[] { return RollLexer.modeNames; }

	public static readonly _serializedATN: number[] = [4,0,5,29,6,-1,2,0,7,
	0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,1,0,1,0,1,1,1,1,1,2,1,2,1,3,4,3,19,8,
	3,11,3,12,3,20,1,4,4,4,24,8,4,11,4,12,4,25,1,4,1,4,0,0,5,1,1,3,2,5,3,7,
	4,9,5,1,0,2,1,0,48,57,3,0,9,10,13,13,32,32,30,0,1,1,0,0,0,0,3,1,0,0,0,0,
	5,1,0,0,0,0,7,1,0,0,0,0,9,1,0,0,0,1,11,1,0,0,0,3,13,1,0,0,0,5,15,1,0,0,
	0,7,18,1,0,0,0,9,23,1,0,0,0,11,12,5,100,0,0,12,2,1,0,0,0,13,14,5,43,0,0,
	14,4,1,0,0,0,15,16,5,45,0,0,16,6,1,0,0,0,17,19,7,0,0,0,18,17,1,0,0,0,19,
	20,1,0,0,0,20,18,1,0,0,0,20,21,1,0,0,0,21,8,1,0,0,0,22,24,7,1,0,0,23,22,
	1,0,0,0,24,25,1,0,0,0,25,23,1,0,0,0,25,26,1,0,0,0,26,27,1,0,0,0,27,28,6,
	4,0,0,28,10,1,0,0,0,3,0,20,25,1,6,0,0];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!RollLexer.__ATN) {
			RollLexer.__ATN = new ATNDeserializer().deserialize(RollLexer._serializedATN);
		}

		return RollLexer.__ATN;
	}


	static DecisionsToDFA = RollLexer._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );
}