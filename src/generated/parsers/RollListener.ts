// Generated from grammars/Roll.g4 by ANTLR 4.13.2

import {ParseTreeListener} from "antlr4";


import { RollContext } from "./RollParser.js";
import { CountContext } from "./RollParser.js";
import { SidesContext } from "./RollParser.js";
import { ModifierContext } from "./RollParser.js";


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
	/**
	 * Enter a parse tree produced by `RollParser.count`.
	 * @param ctx the parse tree
	 */
	enterCount?: (ctx: CountContext) => void;
	/**
	 * Exit a parse tree produced by `RollParser.count`.
	 * @param ctx the parse tree
	 */
	exitCount?: (ctx: CountContext) => void;
	/**
	 * Enter a parse tree produced by `RollParser.sides`.
	 * @param ctx the parse tree
	 */
	enterSides?: (ctx: SidesContext) => void;
	/**
	 * Exit a parse tree produced by `RollParser.sides`.
	 * @param ctx the parse tree
	 */
	exitSides?: (ctx: SidesContext) => void;
	/**
	 * Enter a parse tree produced by `RollParser.modifier`.
	 * @param ctx the parse tree
	 */
	enterModifier?: (ctx: ModifierContext) => void;
	/**
	 * Exit a parse tree produced by `RollParser.modifier`.
	 * @param ctx the parse tree
	 */
	exitModifier?: (ctx: ModifierContext) => void;
}

