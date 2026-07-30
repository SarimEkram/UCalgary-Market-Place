import { useEffect, useState } from "react";
import {
    Box,
    Container,
    Stack,
    Typography,
    Divider,
    Tab,
    Tabs,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import DesktopNav from "../components/DesktopNav";
import MobileNav from "../components/MobileNav";
import { useSocket } from "../context/SocketContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function Inbox() {
    const navigate = useNavigate();
    const socket = useSocket();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("active");

    const fetchConversations = async (status) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/messages/conversations?status=${status}`, {
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                setConversations(data.conversations || []);
            }
        } catch (err) {
            console.error("Failed to fetch conversations:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations(tab);
    }, [tab]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (msg) => {
            setConversations((prev) => {
                const updated = prev.map((c) => {
                    if (c.conversation_id === msg.conversation_id) {
                        return {
                            ...c,
                            last_message: msg.body,
                            last_message_at: msg.created_at,
                            unread_count: c.unread_count + 1,
                        };
                    }
                    return c;
                });
                return updated.sort(
                    (a, b) => new Date(b.last_message_at) - new Date(a.last_message_at)
                );
            });
        };

        const handleArchived = (data) => {
            setConversations((prev) =>
                prev.filter((c) => c.conversation_id !== data.conversation_id)
            );
        };

        socket.on("new_message", handleNewMessage);
        socket.on("conversation_archived", handleArchived);

        return () => {
            socket.off("new_message", handleNewMessage);
            socket.off("conversation_archived", handleArchived);
        };
    }, [socket]);

    return (
        <Stack direction="row" sx={{ bgcolor: "background.paper", minHeight: "100vh" }}>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
                <DesktopNav />
            </Box>

            <Box sx={{ flex: 1, m: 0 }}>
                <Header />

                <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 4 }, mb: 10 }}>
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 400 }}>
                        Messages
                    </Typography>

                    <Tabs
                        value={tab}
                        onChange={(e, v) => setTab(v)}
                        sx={{ mb: 2 }}
                    >
                        <Tab label="Active" value="active" />
                        <Tab label="Archived" value="archived" />
                    </Tabs>

                    <Divider sx={{ mb: 2 }} />

                    {loading && <Typography>Loading conversations...</Typography>}

                    {!loading && conversations.length === 0 && (
                        <Typography sx={{ color: "text.secondary" }}>
                            No {tab} conversations.
                        </Typography>
                    )}

                    <Stack spacing={0}>
                        {conversations.map((conv) => (
                            <Box
                                key={conv.conversation_id}
                                onClick={() => navigate(`/user/messages/${conv.conversation_id}`)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    py: 2,
                                    px: 1,
                                    borderBottom: "1px solid #e4e1de",
                                    cursor: "pointer",
                                    bgcolor: conv.unread_count > 0 ? "#fef9f8" : "transparent",
                                    "&:hover": { bgcolor: "#f5f5f5" },
                                }}
                            >
                                {conv.post_thumbnail && (
                                    <Box
                                        component="img"
                                        src={`data:image/jpeg;base64,${conv.post_thumbnail}`}
                                        alt={conv.post_title}
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 1,
                                            objectFit: "cover",
                                            flexShrink: 0,
                                        }}
                                    />
                                )}

                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography sx={{
                                            fontSize: 14,
                                            fontWeight: conv.unread_count > 0 ? 600 : 400,
                                        }}>
                                            {conv.other_user.fname} {conv.other_user.lname}
                                        </Typography>
                                        <Typography sx={{ fontSize: 12, color: "text.secondary", flexShrink: 0 }}>
                                            {dayjs(conv.last_message_at).fromNow()}
                                        </Typography>
                                    </Stack>

                                    <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.2 }}>
                                        {conv.post_title} {conv.post_price != null ? `- $${conv.post_price}` : ""}
                                    </Typography>

                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography
                                            sx={{
                                                fontSize: 13,
                                                color: conv.unread_count > 0 ? "text.primary" : "text.secondary",
                                                fontWeight: conv.unread_count > 0 ? 500 : 400,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                mt: 0.3,
                                            }}
                                        >
                                            {conv.last_message || "No messages yet"}
                                        </Typography>

                                        {conv.unread_count > 0 && (
                                            <Box
                                                sx={{
                                                    bgcolor: "#D22C22",
                                                    color: "white",
                                                    borderRadius: "50%",
                                                    width: 20,
                                                    height: 20,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: 11,
                                                    fontWeight: 600,
                                                    flexShrink: 0,
                                                    ml: 1,
                                                }}
                                            >
                                                {conv.unread_count}
                                            </Box>
                                        )}
                                    </Stack>
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                </Container>
            </Box>

            <Box sx={{ display: { xs: "block", md: "none" }, position: "fixed", bottom: 0, left: 0, right: 0 }}>
                <MobileNav />
            </Box>
        </Stack>
    );
}