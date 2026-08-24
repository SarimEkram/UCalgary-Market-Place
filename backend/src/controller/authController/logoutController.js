export const logout = (req, res) => {
    res.clearCookie("token");
    return res.json({ success: true, message: "Logged out" });
};