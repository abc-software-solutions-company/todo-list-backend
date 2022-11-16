export function defineAny(...param) {
  return param.filter((e) => e !== undefined).length > 0;
}
