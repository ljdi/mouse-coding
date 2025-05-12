export const isClient = () => typeof window === "object";
export const isObject = (obj?: unknown) => obj ? typeof obj === "object" : false;
export const { isArray } = Array;
export const ensureArray = <T>(
  thing: readonly T[] | T | undefined | null,
): readonly T[] => {
  if (isArray(thing)) return thing;
  if (thing == null) return [];
  return [thing] as readonly T[];
}
export const ensureObject = (o: Record<string, unknown> = {}): Record<string, unknown> => isObject(o) ? o : {};

export const hash = async (message: string) => {
  const data = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export const promisify =
  <T>(fn: (...args: unknown[]) => void) =>
    (...args: unknown[]) =>
      new Promise<T>((resolve, reject) => {
        fn(...args, (err: unknown, result: T) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
