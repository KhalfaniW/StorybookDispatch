export function managerEntries(entry = []) {
  return [...entry, new URL("./src/manager.tsx", import.meta.url).pathname];
}

export function previewAnnotations(entry = []) {
  return [...entry, new URL("./src/preview.tsx", import.meta.url).pathname];
}
