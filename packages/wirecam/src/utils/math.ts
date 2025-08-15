/**
 * Utility function to apply easing to a value.
 * @param t        - The normalized time value (0 to 1).
 * @param inEase   - Whether to apply easing at the start.
 * @param outEase  - Whether to apply easing at the end.
 * @returns The eased value.
 */
export function ease(t: number, inEase: boolean, outEase: boolean): number {
  if (inEase && outEase) {
    // smootherstep: 6t^5 - 15t^4 + 10t^3
    return t * t * t * (t * (6 * t - 15) + 10);
  }
  if (inEase) {
    // easeInQuad
    return t * t;
  }
  if (outEase) {
    // easeOutQuad
    return t * (2 - t);
  }
  return t; // linear
}

/**
 * Linearly interpolates between two values.
 * @param a  The starting value.
 * @param b  The ending value.
 * @param t  The interpolation factor (0 to 1).
 * @returns The interpolated value.
 */
export function lerp(a: number, b: number, t: number): number {
  return a * (1 - t) + b * t;
}
