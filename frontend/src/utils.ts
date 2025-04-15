export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`,
  );
};
export const parseDiagnosisCodes = (input: string): string[] => {
  if (!input) return [];
  return input
    .split(",")
    .map((code) => code.trim())
    .filter((code) => code.length > 0);
};
