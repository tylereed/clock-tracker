// Generated from grammars/Attack.g4 by ANTLR 4.13.2

import {ParseTreeListener} from "antlr4";


import { AttackContext } from "./AttackParser.js";
import { Attack_typeContext } from "./AttackParser.js";
import { Melee_rangedContext } from "./AttackParser.js";
import { Weapon_spellContext } from "./AttackParser.js";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `AttackParser`.
 */
export default class AttackListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `AttackParser.attack`.
	 * @param ctx the parse tree
	 */
	enterAttack?: (ctx: AttackContext) => void;
	/**
	 * Exit a parse tree produced by `AttackParser.attack`.
	 * @param ctx the parse tree
	 */
	exitAttack?: (ctx: AttackContext) => void;
	/**
	 * Enter a parse tree produced by `AttackParser.attack_type`.
	 * @param ctx the parse tree
	 */
	enterAttack_type?: (ctx: Attack_typeContext) => void;
	/**
	 * Exit a parse tree produced by `AttackParser.attack_type`.
	 * @param ctx the parse tree
	 */
	exitAttack_type?: (ctx: Attack_typeContext) => void;
	/**
	 * Enter a parse tree produced by `AttackParser.melee_ranged`.
	 * @param ctx the parse tree
	 */
	enterMelee_ranged?: (ctx: Melee_rangedContext) => void;
	/**
	 * Exit a parse tree produced by `AttackParser.melee_ranged`.
	 * @param ctx the parse tree
	 */
	exitMelee_ranged?: (ctx: Melee_rangedContext) => void;
	/**
	 * Enter a parse tree produced by `AttackParser.weapon_spell`.
	 * @param ctx the parse tree
	 */
	enterWeapon_spell?: (ctx: Weapon_spellContext) => void;
	/**
	 * Exit a parse tree produced by `AttackParser.weapon_spell`.
	 * @param ctx the parse tree
	 */
	exitWeapon_spell?: (ctx: Weapon_spellContext) => void;
}

