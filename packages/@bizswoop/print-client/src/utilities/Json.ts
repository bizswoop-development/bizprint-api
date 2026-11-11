export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

// `undefined` values are allowed for convenience; JSON.stringify drops such keys.
export type JsonObject = { [key: string]: JsonValue | undefined };
