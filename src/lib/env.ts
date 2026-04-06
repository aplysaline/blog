const FALSEY_FLAG_VALUES = new Set(["", "0", "false", "none"]);

export function isEnabledEnvFlag(value: string | undefined) {
  if (value === undefined) {
    return false;
  }

  return !FALSEY_FLAG_VALUES.has(value.trim().toLowerCase());
}
