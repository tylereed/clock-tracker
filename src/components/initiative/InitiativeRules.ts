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
  OrderRules: [v.isRequiredRule, v.isNumericRule],
  NameRules: [v.isRequiredRule],
  DexRules: [v.isNumericRule],
  AcRules: [v.isNumericRule],
  MaxHpRules: [v.isNumericRule],
  HpRules: [v.isNumericRule]
} as InitiativeRules;