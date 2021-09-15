export const clamp = (val: number, min: number, max: number): number =>
  Math.max(Math.min(val, max), min);

export const randomInt = (min: number, max: number): number =>
  Math.floor(min + Math.random() * (max - min));
