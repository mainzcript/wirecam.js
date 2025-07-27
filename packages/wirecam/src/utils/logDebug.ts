/**
 * Utility function to log a debug message.
 * @param debug    - Is debub enabled?
 * @param msg      - Debug message to log.
 */
export function logDebug(
  debug: boolean,
  ...msg: Parameters<typeof console.log>
): void {
  if (debug) {
    console.log(...msg);
  }
}
