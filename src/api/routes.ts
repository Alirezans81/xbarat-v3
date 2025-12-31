export default function getApiUrl() {
  const apiDomain =
    process.env.NEXT_PUBLIC_APP_MODE === "production"
      ? process.env.NEXT_PUBLIC_API_PROD_DOMAIN
      : process.env.NEXT_PUBLIC_API_DEV_DOMAIN;

  return {
    user: `${apiDomain}/user`,
    login: `${apiDomain}/user/login`,
    "payment-channel": `${apiDomain}/payment-channel`,
    currency: `${apiDomain}/currency`,
    "currency-pair": `${apiDomain}/currency-pair`,
    "liquidity-pool": `${apiDomain}/liquidity-pool`,
    wallet: `${apiDomain}/wallet`,
    deposit: `${apiDomain}/wallet/deposit`,
    exchange: `${apiDomain}/wallet/exchange`,
    withdrawal: `${apiDomain}/wallet/withdrawal`,
    transfer: `${apiDomain}/wallet/transfer`,
    refund: `${apiDomain}/wallet/refund`,
    "order-book": `${apiDomain}/order-book`,
    assign: `${apiDomain}/wallet/assign`,
    "bridge-transfer": `${apiDomain}/bridge-transfer`,
    "fee-user": `${apiDomain}/fee-user`,
    ticket: `${apiDomain}/ticket`,
    "watchlist": `${apiDomain}/currency-pair/watch-list`,
  };
}
