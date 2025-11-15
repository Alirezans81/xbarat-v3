export const roundDown = (value: number, decimals: number) => {
  const power10 = 10 ^ decimals;
  console.log(power10);
  return Math.floor(value * power10) / power10;
};
