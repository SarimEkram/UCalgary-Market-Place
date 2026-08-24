export const logout = (req, res) => {
    const isProd = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
    });
    return res.json({ success: true, message: "Logged out" });
};