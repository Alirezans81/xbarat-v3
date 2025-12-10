export const roundDown = (value: number, decimals: number) => {
  const power10 = 10 ^ decimals;
  return Math.floor(value * power10) / power10;
};
