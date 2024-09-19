import { Ref } from "vue";

export function chain(value: string, ...funcs: ((value: any) => boolean | string)[]) {
  for (const validator of funcs) {
    const v = validator(value);
    if (v !== true) {
      return v;
    }
  }
  return true;
}

export function validate(valid: Ref<Boolean>, value: string, ...funcs: ((value: any) => boolean | string)[]) {
  const result = chain(value, ...funcs);
  valid.value = result === true;
  return result;
}

export const ErrorMessages = {
  get RequiredMessage() { return "Required"; },
  get WholeNumberMessage() { return "Must be a positive number"; },
  get IntegerMessage() { return "Must be an integer"; },
  get RangeMessage() { return (min: number, max: number) => `Must be between ${min} and ${max}`; },
  get ColorMessage() { return "Not a valid color"; }
};

/**
 * Marks a field as being required
 * @param value Validates a field to a non-null value
 * @returns true if the value is not null or undefined
 */
export function isRequiredRule(value: any) {
  if (typeof value === "string") {
    value = value.trim();
  }
  return (value != null && value !== "") || ErrorMessages.RequiredMessage;
}

const isWholeNumberRegex = /^\d+$/;
/**
 * Tests a field to see if it contains all digits, does not work with negative or decimal numbers
 * @param value 
 * @returns 
 */
export function isWholeNumber(value?: string) {
  if (value?.trim) {
    value = value.trim();
  }
  if (!value) {
    return true; // string is null or empty
  }
  return isWholeNumberRegex.test(value) || ErrorMessages.WholeNumberMessage;
}

const isIntegerRegex = /^(-)?\d+$/;
export function isInteger(value?: string) {
  if (value?.trim) {
    value = value.trim();
  }
  if (!value) {
    return true; // string is null or empty
  }
  return isIntegerRegex.test(value) || ErrorMessages.IntegerMessage;
}

export function inRangeRule(min: number, max: number): (value: number | string) => boolean | string {
  return (value: number | string) => (+value >= min && +value <= max) || ErrorMessages.RangeMessage(min, max);
}

const ele = document.createElement("div");
const hexRegex = /^[0-9a-f]+$/i;
/**
 * Takes a string, and validates if the browser is able to turn it into a color 
 * @param value The string to test if it's a valid color
 * @returns true if the string is empty or if the browser is able to convert the string into a color
 */
export function isColor(value: string) {
  if (!value) {
    return true;
  }
  if (value.match(hexRegex)) {
    value = "#" + value;
  }

  ele.style.color = value;
  const result = !!ele.style.color.split(/\s+/).join("").toLowerCase() || ErrorMessages.ColorMessage;
  ele.style.color = "";
  return result;
}