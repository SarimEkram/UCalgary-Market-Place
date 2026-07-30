import { useEffect, useState } from "react";
import {
    Box,
    Container,
    Stack,
    Typography,
    Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import DesktopNav from "../components/DesktopNav";
import MobileNav from "../components/MobileNav";
import CustomButton from "../components/CustomButton";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/admin/dashboard", {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard stats:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
            <Stack direction="row" sx={{ bgcolor: "background.paper", minHeight: "100vh" }}>
                <Box sx={{ display: { xs: "none", md: "block" } }}><DesktopNav /></Box>
                <Box sx={{ flex: 1 }}>
                    <Header />
                    <Container maxWidth="lg" sx={{ py: 4 }}>
                        <Typography>Loading dashboard...</Typography>
                    </Container>
                </Box>
            </Stack>
        );
    }

    const statCards = [
        { label: "Total Users", value: stats?.totalUsers ?? 0, color: "#1976d2" },
        { label: "Total Admins", value: stats?.totalAdmins ?? 0, color: "#7b1fa2" },
        { label: "Market Posts", value: stats?.totalMarketPosts ?? 0, color: "#2e7d32" },
        { label: "Event Posts", value: stats?.totalEventPosts ?? 0, color: "#ed6c02" },
        { label: "Pending Reports", value: stats?.pendingReports ?? 0, color: "#d32f2f" },
        { label: "Dismissed Reports", value: stats?.dismissedReports ?? 0, color: "#757575" },
        { label: "Posts This Week", value: stats?.postsThisWeek ?? 0, color: "#0288d1" },
        { label: "Reports This Week", value: stats?.reportsThisWeek ?? 0, color: "#c62828" },
        { label: "Total Bans", value: stats?.totalBans ?? 0, color: "#4e342e" },
    ];

    return (
        <Stack direction="row" sx={{ bgcolor: "background.paper", minHeight: "100vh" }}>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
                <DesktopNav />
            </Box>

            <Box sx={{ flex: 1, m: 0 }}>
                <Header />

                <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 6 }, mb: 10 }}>
                    <Typography variant="h4" sx={{ mb: 3, fontWeight: 400 }}>
                        Admin Dashboard
                    </Typography>

                    {/* Stat Cards */}
                    <Box sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                        gap: 2,
                        mb: 4,
                    }}>
                        {statCards.map((card) => (
                            <Box
                                key={card.label}
                                sx={{
                                    border: "1px solid #e4e1de",
                                    borderRadius: 3,
                                    p: 3,
                                    bgcolor: "#fff",
                                }}
                            >
                                <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>
                                    {card.label}
                                </Typography>
                                <Typography sx={{ fontSize: 28, fontWeight: 600, color: card.color }}>
                                    {card.value}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Quick Actions */}
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 400 }}>
                        Quick Actions
                    </Typography>

                    <Stack direction="row" spacing={2} sx={{ mb: 4, flexWrap: "wrap", gap: 1 }}>
                        <CustomButton color="black" onClick={() => navigate("/admin/find-user")}>
                            Find User
                        </CustomButton>
                        <CustomButton color="black" onClick={() => navigate("/admin/reported-users")}>
                            Reported Users
                        </CustomButton>
                        <CustomButton color="black" onClick={() => navigate("/admin/reports/market")}>
                            Reported Market Posts
                        </CustomButton>
                        <CustomButton color="black" onClick={() => navigate("/admin/reports/events")}>
                            Reported Events
                        </CustomButton>
                    </Stack>

                    <Divider sx={{ mb: 3 }} />

                    {/* Top Reported Posts */}
                    {stats?.topReportedPosts?.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 400 }}>
                                Top Reported Posts
                            </Typography>
                            {stats.topReportedPosts.map((post) => (
                                <Box
                                    key={post.post_id}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        py: 1.5,
                                        borderBottom: "1px solid #e4e1de",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => navigate(`/admin/reports/market/${post.post_id}`)}
                                >
                                    <Typography sx={{ fontSize: 14 }}>{post.name}</Typography>
                                    <Typography sx={{ fontSize: 13, color: "#d32f2f", fontWeight: 500 }}>
                                        {post.report_count} report{post.report_count !== 1 ? "s" : ""}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* Recent Admin Actions */}
                    {stats?.recentActions?.length > 0 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 400 }}>
                                Recent Admin Actions
                            </Typography>
                            {stats.recentActions.map((action, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        py: 1.5,
                                        borderBottom: "1px solid #e4e1de",
                                    }}
                                >
                                    <Typography sx={{ fontSize: 14 }}>
                                        {action.action}
                                    </Typography>
                                    <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.3 }}>
                                        {action.fname} {action.lname} - {dayjs(action.action_timestamp).fromNow()}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Container>
            </Box>

            <Box sx={{ display: { xs: "block", md: "none" }, position: "fixed", bottom: 0, left: 0, right: 0 }}>
                <MobileNav />
            </Box>
        </Stack>
    );
}