export const API_Key = "AIzaSyByR7B0iM7kg2jJAeblk_8O3z7824-6mF8";

export function convertValue(value) {
  if (value>=1000000) {
    return Math.floor(value / 1000000) + "M";
  } else if (value>=1000) {
    return Math.floor(value / 1000) + "K";
  } else {
    return value;
  }
}