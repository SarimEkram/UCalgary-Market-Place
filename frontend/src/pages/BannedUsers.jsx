import { useEffect, useState } from "react";
import {
    Box,
    Container,
    Stack,
    Typography,
    Divider,
} from "@mui/material";
import Header from "../components/Header";
import DesktopNav from "../components/DesktopNav";
import MobileNav from "../components/MobileNav";
import CustomButton from "../components/CustomButton";
import ConfirmationPopup from "../components/ConfirmationPopup";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function BannedUsers() {
    const [bannedUsers, setBannedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState(null);

    useEffect(() => {
        async function fetchBanned() {
            try {
                const res = await fetch("/api/admin/banned", {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setBannedUsers(data.bannedUsers || []);
                }
            } catch (err) {
                console.error("Failed to fetch banned users:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchBanned();
    }, []);

    const executeUnban = async () => {
        const res = await fetch("/api/admin/banned/unban", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email: selectedEmail }),
        });
        return res;
    };

    const handleUnbanCallback = (ok) => {
        if (ok) {
            setBannedUsers((prev) => prev.filter((u) => u.email !== selectedEmail));
        }
        setConfirmOpen(false);
    };

    return (
        <Stack direction="row" sx={{ bgcolor: "background.paper", minHeight: "100vh" }}>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
                <DesktopNav />
            </Box>

            <Box sx={{ flex: 1, m: 0 }}>
                <Header />

                <Container
                    maxWidth="lg"
                    sx={{
                        py: { xs: 2, md: 4 },
                        px: { xs: 2, md: 6 },
                        mb: 10,
                    }}
                >
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 400 }}>
                        Banned Users
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    {loading && (
                        <Typography>Loading banned users...</Typography>
                    )}

                    {!loading && bannedUsers.length === 0 && (
                        <Typography sx={{ color: "text.secondary" }}>
                            No banned users.
                        </Typography>
                    )}

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                            gap: 3,
                        }}
                    >
                        {bannedUsers.map((user) => (
                            <Box
                                key={user.email}
                                sx={{
                                    border: "1px solid #e4e1de",
                                    borderRadius: 3,
                                    p: 3,
                                    bgcolor: "#fff",
                                }}
                            >
                                <Typography sx={{ fontWeight: 500, fontSize: 16 }}>
                                    {user.email}
                                </Typography>
                                <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
                                    Banned {dayjs(user.banned_at).fromNow()} by {user.banned_by_fname} {user.banned_by_lname}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <CustomButton
                                        color="black"
                                        onClick={() => {
                                            setSelectedEmail(user.email);
                                            setConfirmOpen(true);
                                        }}
                                    >
                                        Unban
                                    </CustomButton>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>

            <Box sx={{ display: { xs: "block", md: "none" }, position: "fixed", bottom: 0, left: 0, right: 0 }}>
                <MobileNav />
            </Box>

            <ConfirmationPopup
                open={confirmOpen}
                handleClose={() => setConfirmOpen(false)}
                warningMessage={`Are you sure you want to unban ${selectedEmail}? They will be able to re-register.`}
                executeFunction={executeUnban}
                callBack={handleUnbanCallback}
            />
        </Stack>
    );
}