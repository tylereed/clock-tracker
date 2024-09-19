import * as v from "@/utils/validators";

interface InitiativeRules {
  OrderRules: ((value: any) => boolean | string)[],
  NameRules: ((value: any) => boolean | string)[],
  DexRules: ((value: any) => boolean | string)[],
  AcRules: ((value: any) => boolean | string)[],
  MaxHpRules: ((value: any) => boolean | string)[],
  HpRules: ((value: any) => boolean | string)[]
}

export default {
  OrderRules: [v.isRequiredRule, v.isWholeNumber],
  NameRules: [v.isRequiredRule],
  DexRules: [v.isInteger],
  AcRules: [v.isWholeNumber],
  MaxHpRules: [v.isWholeNumber],
  HpRules: [v.isWholeNumber]
} as InitiativeRules;