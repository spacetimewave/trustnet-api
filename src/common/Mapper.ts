/**
 * Maps a source object to a target type by picking only properties that exist in the target interface
 * @param source Source object with data
 * @param targetObj An empty object of target type (used for type inference)
 * @returns A new object with only the properties from the target interface
 */
export function mapObject<T extends object>(source: any, targetObj: T): T {
  const result = {} as T;

  // Get all property names from the target type
  const targetKeys = Object.keys(targetObj);

  // Copy only the properties that exist in both source and target
  for (const key of Object.keys(source)) {
    if (key in targetObj) {
      (result as any)[key] = source[key];
    }
  }

  return result;
}
