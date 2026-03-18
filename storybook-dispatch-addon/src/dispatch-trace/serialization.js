export function toSerializable(value) {
  return JSON.parse(
    JSON.stringify(value, (_, nestedValue) =>
      nestedValue instanceof Date ? nestedValue.toISOString() : nestedValue,
    ),
  );
}
