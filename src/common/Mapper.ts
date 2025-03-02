/**
 * Maps properties from a source object to a target object type
 * Handles CouchDB specific fields (_id, _rev) and maps all other properties
 * @param source The source object from CouchDB
 * @param targetType An empty object of the target type (used for TypeScript typing only)
 * @returns A new object with properties mapped from source to target type
 */
export function AutoMap<T>(source: any, targetType: T): T {
  if (!source) return targetType;

  const result = { ...targetType } as any;

  // Copy all properties except CouchDB specific ones
  Object.keys(source).forEach((key) => {
    if (key !== "_id" && key !== "_rev") {
      result[key] = source[key];
    }
  });

  return result as T;
}
