export function defineAny(...param) {
  return param.filter((e) => e !== undefined).length > 0;
}

export function defineAll(...param) {
  return param.filter((e) => e === undefined).length === 0;
}
