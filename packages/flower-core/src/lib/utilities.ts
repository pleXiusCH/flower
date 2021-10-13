export function serializeToJSONObject(object: any, indent = 2) {
  return JSON.stringify(object, (_, val) => {
    if (typeof val === 'function') {
      return val + ''; // implicitly `toString` it
    }
    return val;
  }, indent);
}