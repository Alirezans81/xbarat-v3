export const calculateFee = (amount: number, feePercentage: number) => {
  return amount * (feePercentage / 100);
};
