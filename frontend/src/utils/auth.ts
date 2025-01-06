// src/utils/authUtils.ts

export const getAuthTokenFromCookies = () => {
  const match = document.cookie.match(/(^| )auth_token=([^;]+)/);
  return match ? match[2] : null;
};
