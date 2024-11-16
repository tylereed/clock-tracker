// Generated from grammars/Attack.g4 by ANTLR 4.13.2
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
export default class AttackLexer extends Lexer {
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
	public static readonly EOF = Token.EOF;

	public static readonly channelNames: string[] = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];
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
	public static readonly modeNames: string[] = [ "DEFAULT_MODE", ];

	public static readonly ruleNames: string[] = [
		"T__0", "T__1", "T__2", "T__3", "TEXT", "MELEE", "RANGED", "WEAPON", "SPELL", 
		"MARKUP",
	];


	constructor(input: CharStream) {
		super(input);
		this._interp = new LexerATNSimulator(this, AttackLexer._ATN, AttackLexer.DecisionsToDFA, new PredictionContextCache());
	}

	public get grammarFileName(): string { return "Attack.g4"; }

	public get literalNames(): (string | null)[] { return AttackLexer.literalNames; }
	public get symbolicNames(): (string | null)[] { return AttackLexer.symbolicNames; }
	public get ruleNames(): string[] { return AttackLexer.ruleNames; }

	public get serializedATN(): number[] { return AttackLexer._serializedATN; }

	public get channelNames(): string[] { return AttackLexer.channelNames; }

	public get modeNames(): string[] { return AttackLexer.modeNames; }

	public static readonly _serializedATN: number[] = [4,0,10,71,6,-1,2,0,7,
	0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,
	9,1,0,1,0,1,0,1,1,1,1,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,3,1,3,1,3,1,3,1,
	3,1,4,1,4,1,5,1,5,1,5,1,5,1,5,1,5,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,7,1,7,1,
	7,1,7,1,7,1,7,1,7,1,8,1,8,1,8,1,8,1,8,1,8,1,9,1,9,1,9,1,9,0,0,10,1,1,3,
	2,5,3,7,4,9,5,11,6,13,7,15,8,17,9,19,10,1,0,0,70,0,1,1,0,0,0,0,3,1,0,0,
	0,0,5,1,0,0,0,0,7,1,0,0,0,0,9,1,0,0,0,0,11,1,0,0,0,0,13,1,0,0,0,0,15,1,
	0,0,0,0,17,1,0,0,0,0,19,1,0,0,0,1,21,1,0,0,0,3,24,1,0,0,0,5,26,1,0,0,0,
	7,34,1,0,0,0,9,39,1,0,0,0,11,41,1,0,0,0,13,47,1,0,0,0,15,54,1,0,0,0,17,
	61,1,0,0,0,19,67,1,0,0,0,21,22,5,58,0,0,22,23,5,32,0,0,23,2,1,0,0,0,24,
	25,5,32,0,0,25,4,1,0,0,0,26,27,5,32,0,0,27,28,5,65,0,0,28,29,5,116,0,0,
	29,30,5,116,0,0,30,31,5,97,0,0,31,32,5,99,0,0,32,33,5,107,0,0,33,6,1,0,
	0,0,34,35,5,32,0,0,35,36,5,111,0,0,36,37,5,114,0,0,37,38,5,32,0,0,38,8,
	1,0,0,0,39,40,9,0,0,0,40,10,1,0,0,0,41,42,5,77,0,0,42,43,5,101,0,0,43,44,
	5,108,0,0,44,45,5,101,0,0,45,46,5,101,0,0,46,12,1,0,0,0,47,48,5,82,0,0,
	48,49,5,97,0,0,49,50,5,110,0,0,50,51,5,103,0,0,51,52,5,101,0,0,52,53,5,
	100,0,0,53,14,1,0,0,0,54,55,5,87,0,0,55,56,5,101,0,0,56,57,5,97,0,0,57,
	58,5,112,0,0,58,59,5,111,0,0,59,60,5,110,0,0,60,16,1,0,0,0,61,62,5,83,0,
	0,62,63,5,112,0,0,63,64,5,101,0,0,64,65,5,108,0,0,65,66,5,108,0,0,66,18,
	1,0,0,0,67,68,5,95,0,0,68,69,1,0,0,0,69,70,6,9,0,0,70,20,1,0,0,0,1,0,1,
	6,0,0];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!AttackLexer.__ATN) {
			AttackLexer.__ATN = new ATNDeserializer().deserialize(AttackLexer._serializedATN);
		}

		return AttackLexer.__ATN;
	}


	static DecisionsToDFA = AttackLexer._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );
}