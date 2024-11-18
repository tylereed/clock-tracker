// Generated from grammars/Attack.g4 by ANTLR 4.13.2

import {ParseTreeListener} from "antlr4";


import { AttackContext } from "./AttackParser.js";
import { AttackTypeContext } from "./AttackParser.js";
import { MeleeRangedContext } from "./AttackParser.js";
import { WeaponSpellContext } from "./AttackParser.js";
import { ToHitContext } from "./AttackParser.js";
import { DistanceContext } from "./AttackParser.js";
import { ReachContext } from "./AttackParser.js";
import { RangeContext } from "./AttackParser.js";
import { TargetsContext } from "./AttackParser.js";
import { HitContext } from "./AttackParser.js";
import { DamageContext } from "./AttackParser.js";
import { PlusDamageContext } from "./AttackParser.js";
import { VersatileDamageContext } from "./AttackParser.js";
import { ExtraTextContext } from "./AttackParser.js";


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
	 * Enter a parse tree produced by `AttackParser.attackType`.
	 * @param ctx the parse tree
	 */
	enterAttackType?: (ctx: AttackTypeContext) => void;
	/**
	 * Exit a parse tree produced by `AttackParser.attackType`.
	 * @param ctx the parse tree
	 */
	exitAttackType?: (ctx: AttackTypeContext) => void;
	/**
	 * Enter a parse tree produced by `AttackParser.meleeRanged`.
	 * @param ctx the parse tree
	 */
	enterMeleeRanged?: (ctx: MeleeRangedContext) => void;
	/**
	 * Exit a parse tree produced by `AttackParser.meleeRanged`.
	 * @param ctx the parse tree
	 */
	exitMeleeRanged?: (ctx: MeleeRangedContext) => void;
	/**
	 * Enter a parse tree produced by `AttackParser.weaponSpell`.
	 * @param ctx the parse tree
	 */
	enterWeaponSpell?: (ctx: WeaponSpellContext) => void;
	/**
	 * Exit a parse tree produced by `AttackParser.weaponSpell`.
	 * @param ctx the parse tree
	 */
	exitWeaponSpell?: (ctx: WeaponSpellContext) => void;
	/**
	 * Enter a parse tree produced by `AttackParser.toHit`.
	 * @param ctx the parse tree
	 */
	enterToHit?: (ctx: ToHitContext) => void;
	/**
	 * Exit a parse tree produced by `AttackParser.toHit`.
	 * @param ctx the parse tree
	 */
	exitToHit?: (ctx: ToHitContext) => void;
	/**
	 * Enter a parse tree produced by `AttackParser.distance`.
	 * @param ctx the parse tree
	 */
	enterDistance?: (ctx: DistanceContext) => void;
	/**
	 * Exit a parse tree produced by `AttackParser.distance`.
	 * @param ctx the parse tree
	 */
	exitDistance?: (ctx: DistanceContext) => void;
	/**
	 * Enter a parse tree produced by `AttackParser.reach`.
	 * @param ctx the parse tree
	 */
	enterReach?: (ctx: ReachContext) => void;
	/**
	 * Exit a parse tree produced by `AttackParser.reach`.
	 * @param ctx the parse tree
	 */
	exitReach?: (ctx: ReachContext) => void;
	/**
	 * Enter a parse tree produced by `AttackParser.range`.
	 * @param ctx the parse tree
	 */
	enterRange?: (ctx: RangeContext) => void;
	/**
	 * Exit a parse tree produced by `AttackParser.range`.
	 * @param ctx the parse tree
	 */
	exitRange?: (ctx: RangeContext) => void;
	/**
	 * Enter a parse tree produced by `AttackParser.targets`.
	 * @param ctx the parse tree
	 */
	enterTargets?: (ctx: TargetsContext) => void;
	/**
	 * Exit a parse tree produced by `AttackParser.targets`.
	 * @param ctx the parse tree
	 */
	exitTargets?: (ctx: TargetsContext) => void;
	/**
	 * Enter a parse tree produced by `AttackParser.hit`.
	 * @param ctx the parse tree
	 */
	enterHit?: (ctx: HitContext) => void;
	/**
	 * Exit a parse tree produced by `AttackParser.hit`.
	 * @param ctx the parse tree
	 */
	exitHit?: (ctx: HitContext) => void;
	/**
	 * Enter a parse tree produced by `AttackParser.damage`.
	 * @param ctx the parse tree
	 */
	enterDamage?: (ctx: DamageContext) => void;
	/**
	 * Exit a parse tree produced by `AttackParser.damage`.
	 * @param ctx the parse tree
	 */
	exitDamage?: (ctx: DamageContext) => void;
	/**
	 * Enter a parse tree produced by `AttackParser.plusDamage`.
	 * @param ctx the parse tree
	 */
	enterPlusDamage?: (ctx: PlusDamageContext) => void;
	/**
	 * Exit a parse tree produced by `AttackParser.plusDamage`.
	 * @param ctx the parse tree
	 */
	exitPlusDamage?: (ctx: PlusDamageContext) => void;
	/**
	 * Enter a parse tree produced by `AttackParser.versatileDamage`.
	 * @param ctx the parse tree
	 */
	enterVersatileDamage?: (ctx: VersatileDamageContext) => void;
	/**
	 * Exit a parse tree produced by `AttackParser.versatileDamage`.
	 * @param ctx the parse tree
	 */
	exitVersatileDamage?: (ctx: VersatileDamageContext) => void;
	/**
	 * Enter a parse tree produced by `AttackParser.extraText`.
	 * @param ctx the parse tree
	 */
	enterExtraText?: (ctx: ExtraTextContext) => void;
	/**
	 * Exit a parse tree produced by `AttackParser.extraText`.
	 * @param ctx the parse tree
	 */
	exitExtraText?: (ctx: ExtraTextContext) => void;
}

