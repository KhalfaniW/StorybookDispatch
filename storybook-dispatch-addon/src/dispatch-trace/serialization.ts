export function toSerializable<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_, nestedValue: unknown) =>
      nestedValue instanceof Date ? nestedValue.toISOString() : nestedValue,
    ),
  ) as T;
}
