// Generated from grammars/Roll.g4 by ANTLR 4.13.2

import {ParseTreeListener} from "antlr4";


import { RollContext } from "./RollParser.js";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `RollParser`.
 */
export default class RollListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `RollParser.roll`.
	 * @param ctx the parse tree
	 */
	enterRoll?: (ctx: RollContext) => void;
	/**
	 * Exit a parse tree produced by `RollParser.roll`.
	 * @param ctx the parse tree
	 */
	exitRoll?: (ctx: RollContext) => void;
}

