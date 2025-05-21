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
    wallet: `${apiDomain}/wallet`,
    deposit: `${apiDomain}/wallet/deposit`,
    withdrawal: `${apiDomain}/wallet/withdrawal`,
    transfer: `${apiDomain}/wallet/transfer`,
  };
}
