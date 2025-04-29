export default function getApiUrl() {
  const apiDomain =
    process.env.APP_MODE === "production"
      ? process.env.API_PROD_DOMAIN
      : process.env.API_DEV_DOMAIN;

  return {
    user: `${apiDomain}/user`,
    login: `${apiDomain}/user/login`,
  };
}
