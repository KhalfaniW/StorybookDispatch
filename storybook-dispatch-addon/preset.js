export function managerEntries(entry = []) {
  return [...entry, new URL("./src/manager.js", import.meta.url).pathname];
}

export function previewAnnotations(entry = []) {
  return [...entry, new URL("./src/preview.js", import.meta.url).pathname];
}
