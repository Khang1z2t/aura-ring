export function shouldTrackScrollProgress(progress: number, seen: Set<number>) {
  return progress === 90 && !seen.has(progress)
}
