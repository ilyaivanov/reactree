export const randomInt = (from: number, to: number) =>
  Math.floor(from + Math.random() * (to - from));

export const clamp = (val: number, min: number, max: number): number =>
  Math.max(Math.min(val, max), min);
