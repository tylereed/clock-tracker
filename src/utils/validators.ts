export function isRequiredRule(value: any) {
  return value != null || "Required";
}

const isNumericRegex = /^\d+$/;
export function isNumericRule(value: string) {
  if (value?.trim) {
    value = value?.trim();
  }
  return isNumericRegex.test(value) || "Must be a number";
}

export function inRangeRule(min: number, max: number): (value: number | string) => boolean | string {
  return (value: number | string) => (+value >= min && +value <= max) || `Must be between ${min} and ${max}`
}

const ele = document.createElement("div");
const hexRegex = /^[0-9a-f]+$/i;
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