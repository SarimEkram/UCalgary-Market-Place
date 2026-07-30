import { useEffect, useState, useRef } from "react";
import {
    Box,
    Container,
    Stack,
    Typography,
    TextField,
    IconButton,
    Divider,
    Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import DesktopNav from "../components/DesktopNav";
import MobileNav from "../components/MobileNav";
import CustomButton from "../components/CustomButton";
import ConfirmationPopup from "../components/ConfirmationPopup";
import { useSocket } from "../context/SocketContext";
import dayjs from "dayjs";

export default function ChatThread() {
    const { id } = useParams();
    const navigate = useNavigate();
    const socket = useSocket();

    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [archiveOpen, setArchiveOpen] = useState(false);

    const messagesEndRef = useRef(null);
    const userId = JSON.parse(localStorage.getItem("user"))?.id;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchMessages = async (beforeId) => {
        try {
            setLoading(true);
            const url = beforeId
                ? `/api/messages/conversations/${id}?before=${beforeId}&limit=30`
                : `/api/messages/conversations/${id}?limit=30`;

            const res = await fetch(url, { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setConversation(data.conversation);
                if (beforeId) {
                    setMessages((prev) => [...data.messages, ...prev]);
                } else {
                    setMessages(data.messages);
                }
                setHasMore(data.hasMore);
            }
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [id]);

    useEffect(() => {
        if (!loading && messages.length > 0) {
            scrollToBottom();
        }
    }, [loading]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (msg) => {
            if (msg.conversation_id === parseInt(id, 10)) {
                setMessages((prev) => [...prev, msg]);
                scrollToBottom();

                // Update read status
                fetch(`/api/messages/conversations/${id}?limit=0`, {
                    credentials: "include",
                }).catch(() => {});
            }
        };

        const handleArchived = (data) => {
            if (data.conversation_id === parseInt(id, 10)) {
                setConversation((prev) => prev ? { ...prev, status: "archived" } : prev);
            }
        };

        socket.on("new_message", handleNewMessage);
        socket.on("conversation_archived", handleArchived);

        return () => {
            socket.off("new_message", handleNewMessage);
            socket.off("conversation_archived", handleArchived);
        };
    }, [socket, id]);

    const handleSend = async () => {
        if (!input.trim() || sending) return;

        try {
            setSending(true);
            const res = await fetch(`/api/messages/conversations/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ body: input.trim() }),
            });

            if (res.ok) {
                const data = await res.json();
                setMessages((prev) => [...prev, data.message]);
                setInput("");
                scrollToBottom();
            }
        } catch (err) {
            console.error("Send message error:", err);
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const executeArchive = async () => {
        const res = await fetch(`/api/messages/conversations/${id}/archive`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        return res;
    };

    const handleArchiveCallback = (ok) => {
        if (ok) {
            navigate("/user/messages");
        }
        setArchiveOpen(false);
    };

    const isArchived = conversation?.status === "archived";

    return (
        <Stack direction="row" sx={{ bgcolor: "background.paper", minHeight: "100vh" }}>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
                <DesktopNav />
            </Box>

            <Box sx={{ flex: 1, m: 0, display: "flex", flexDirection: "column" }}>
                <Header />

                <Container
                    maxWidth="md"
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        py: 2,
                        px: { xs: 2, md: 4 },
                        mb: { xs: 10, md: 0 },
                    }}
                >
                    {/* Header */}
                    <Box sx={{ mb: 2 }}>
                        <Button
                            onClick={() => navigate("/user/messages")}
                            sx={{ textTransform: "none", p: 0, mb: 1 }}
                            color="inherit"
                        >
                            <ArrowBackIosNewIcon sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="body2">Back to Messages</Typography>
                        </Button>

                        {conversation && (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    p: 2,
                                    border: "1px solid #e4e1de",
                                    borderRadius: 2,
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    const postType = conversation.post_id;
                                    navigate(`/market/${conversation.post_id}`);
                                }}
                            >
                                <Box>
                                    <Typography sx={{ fontWeight: 500, fontSize: 15 }}>
                                        {conversation.post_title}
                                    </Typography>
                                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                                        {conversation.post_price != null
                                            ? `$${conversation.post_price}`
                                            : "Free"}
                                    </Typography>
                                </Box>
                                {!isArchived && (
                                    <CustomButton
                                        color="black"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setArchiveOpen(true);
                                        }}
                                    >
                                        Mark as Sold
                                    </CustomButton>
                                )}
                                {isArchived && (
                                    <Typography sx={{ fontSize: 12, color: "text.secondary", fontStyle: "italic" }}>
                                        Archived
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </Box>

                    <Divider />

                    {/* Messages */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            py: 2,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            minHeight: 300,
                            maxHeight: "60vh",
                        }}
                    >
                        {hasMore && (
                            <Box sx={{ textAlign: "center", mb: 1 }}>
                                <Button
                                    size="small"
                                    onClick={() => fetchMessages(messages[0]?.message_id)}
                                    sx={{ textTransform: "none" }}
                                >
                                    Load earlier messages
                                </Button>
                            </Box>
                        )}

                        {messages.map((msg) => {
                            const isMine = msg.sender_id === userId;
                            return (
                                <Box
                                    key={msg.message_id}
                                    sx={{
                                        display: "flex",
                                        justifyContent: isMine ? "flex-end" : "flex-start",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            maxWidth: "70%",
                                            px: 2,
                                            py: 1,
                                            borderRadius: 2,
                                            bgcolor: isMine ? "#D22C22" : "#f0f0f0",
                                            color: isMine ? "white" : "text.primary",
                                        }}
                                    >
                                        {!isMine && (
                                            <Typography sx={{ fontSize: 11, fontWeight: 500, mb: 0.3 }}>
                                                {msg.sender_fname}
                                            </Typography>
                                        )}
                                        <Typography sx={{ fontSize: 14 }}>{msg.body}</Typography>
                                        <Typography
                                            sx={{
                                                fontSize: 10,
                                                mt: 0.5,
                                                opacity: 0.7,
                                                textAlign: "right",
                                            }}
                                        >
                                            {dayjs(msg.created_at).format("h:mm A")}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Input */}
                    {!isArchived && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                pt: 2,
                                borderTop: "1px solid #e4e1de",
                            }}
                        >
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                multiline
                                maxRows={3}
                            />
                            <IconButton
                                onClick={handleSend}
                                disabled={!input.trim() || sending}
                                sx={{ color: "#D22C22" }}
                            >
                                <SendIcon />
                            </IconButton>
                        </Box>
                    )}

                    {isArchived && (
                        <Typography
                            sx={{
                                textAlign: "center",
                                py: 2,
                                color: "text.secondary",
                                fontSize: 13,
                                fontStyle: "italic",
                            }}
                        >
                            This conversation has been archived. No new messages can be sent.
                        </Typography>
                    )}
                </Container>
            </Box>

            <Box sx={{ display: { xs: "block", md: "none" }, position: "fixed", bottom: 0, left: 0, right: 0 }}>
                <MobileNav />
            </Box>

            <ConfirmationPopup
                open={archiveOpen}
                handleClose={() => setArchiveOpen(false)}
                warningMessage="Mark this item as sold? The conversation will be archived and no new messages can be sent."
                executeFunction={executeArchive}
                callBack={handleArchiveCallback}
            />
        </Stack>
    );
}