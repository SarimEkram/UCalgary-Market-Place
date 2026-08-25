import { clearCookieOptions } from "../../config/cookieOptions.js";

export const logout = (req, res) => {
    res.clearCookie("token", clearCookieOptions);
    return res.json({ success: true, message: "Logged out" });
};
