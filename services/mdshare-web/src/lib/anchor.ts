export function isValidAnchorId(anchorId: string | undefined): boolean {
  if (!anchorId) return true
  // allow markdown heading-style or block ids: letters, numbers, -, _, :, .
  return /^[a-zA-Z0-9._:-]{2,128}$/.test(anchorId)
}
