import * as v from "@/utils/validators";

interface InitiativeRules {
  OrderRules: ((value: any) => boolean | string)[],
  NameRules: ((value: any) => boolean | string)[],
  DexRules: ((value: any) => boolean | string)[],
  AcRules: ((value: any) => boolean | string)[],
  CrRules: ((value: any) => boolean | string)[],
  LevelRules: ((value: any) => boolean | string)[],
  MaxHpRules: ((value: any) => boolean | string)[],
  HpRules: ((value: any) => boolean | string)[]
}

export default {
  OrderRules: [v.isRequiredRule, v.isWholeNumber],
  NameRules: [v.isRequiredRule],
  DexRules: [v.isInteger],
  AcRules: [v.isWholeNumber],
  CrRules: [isValidCr],
  LevelRules: [v.isWholeNumber],
  MaxHpRules: [v.isWholeNumber],
  HpRules: [v.isWholeNumber]
} as InitiativeRules;


const isFractionCrRegex = /^\s*1\s*\/\s*(2|4|8)\s*$/;

function isValidCr(value: any) {
  const isNum =  v.isWholeNumber(value);
  if (isNum === true) {
    return true;
  }

  if (value?.trim) {
    value = value.trim();
  }
  if (!value) {
    return true; // string is null or empty
  }

  return isFractionCrRegex.test(value) || "Must be valid CR (number, 1/8, 1/4, 1/2)";
}