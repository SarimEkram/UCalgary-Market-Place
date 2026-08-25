// Central cookie options so login (set) and logout (clear) always match.
//
// Same-origin deploy (backend serves the frontend): defaults are correct in
// production — secure cookies over HTTPS, SameSite=Lax.
//
// Split deploy (frontend on a different domain, e.g. Vercel): set
//   COOKIE_SAMESITE=none  and  COOKIE_SECURE=true
// so the browser sends the auth cookie cross-site.
const isProd = process.env.NODE_ENV === "production";

const secure =
    process.env.COOKIE_SECURE !== undefined
        ? process.env.COOKIE_SECURE === "true"
        : isProd;

const sameSite = process.env.COOKIE_SAMESITE || "lax";

// Options used to CLEAR the cookie (must match everything except maxAge).
export const clearCookieOptions = {
    httpOnly: true,
    secure,
    sameSite,
};

// Options used to SET the auth cookie.
export const authCookieOptions = {
    ...clearCookieOptions,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
};
