/**
 * Marks a field as being required
 * @param value Validates a field to a non-null value
 * @returns true if the value is not null or undefined
 */
export function isRequiredRule(value: any) {
  if (typeof value === "string") {
    value = value.trim();
  }
  return (value != null && value !== "") || "Required";
}

const isNumericRegex = /^\d+$/;
/**
 * Tests a field to see if it contains all digits, does not work with negative or decimal numbers
 * @param value 
 * @returns 
 */
export function isNumericRule(value?: string) {
  if (value?.trim) {
    value = value.trim();
  }
  if (!value) {
    return true; // string is null or empty
  }
  return isNumericRegex.test(value) || "Must be a number";
}

export function inRangeRule(min: number, max: number): (value: number | string) => boolean | string {
  return (value: number | string) => (+value >= min && +value <= max) || `Must be between ${min} and ${max}`
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
  const result = !!ele.style.color.split(/\s+/).join("").toLowerCase() || "Not a valid color";
  ele.style.color = "";
  return result;
}