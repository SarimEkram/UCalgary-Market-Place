// ViewReportedUsers.jsx
import { useEffect, useState } from "react";
import {
    Box,
    
    Container,
    Stack,
    Typography,
} from "@mui/material";

import DesktopNav from "../components/DesktopNav";
import MobileNav from "../components/MobileNav";
import Header from "../components/Header";
import ReportedUserIconSVG from "../assets/ReportedUserIconSVG";
import ConfirmationPopup from "../components/ConfirmationPopup";
import { useNavigate } from "react-router";
import Button from "../components/CustomButton";

export default function ViewReportedUsers() {
    const [usersReported, setUsersReported] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");

    const [deletePopupOpen, setDeletePopupOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchReportedUsers() {
            try {
                setErrorMsg("");

                const res = await fetch(`/api/admin/reported-users`);

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    setErrorMsg(data?.error || "Failed to load reported users");
                    setUsersReported([]);
                    return;
                }

                const data = await res.json();

                const mapped = (data.reportedUsers || []).map((u) => ({
                    id: u.user_id,
                    name: `${u.fname} ${u.lname}`.trim(),
                    email: u.email,
                    reportCount: u.reportCount,
                    reason: u.latestReason || "No reason provided",
                }));

                setUsersReported(mapped);
            } catch (err) {
                console.error("Failed to fetch reported users:", err);
                setErrorMsg("Failed to load reported users");
                setUsersReported([]);
            }
        }

        fetchReportedUsers();
    }, []);

    // 🔹 keep name: handleView
    const handleView = (id) => {
        navigate(`/admin/profile/user/${id}`);
    };

    // 🔹 keep name: handleMessage
    const handleMessage = (email) => {
        window.location.href = `mailto:${email}`;
    };

    // 🔹 used by ConfirmationPopup to actually call the backend
    const executeDelete = async () => {
        if (!selectedUser) {
            return Promise.reject(new Error("No user selected for deletion"));
        }

        const storedUser = JSON.parse(localStorage.getItem("user"));
        const adminId = storedUser?.id;

        console.log("DELETE REQUEST STARTED:", selectedUser.email);

        const res = await fetch(`/api/admin/users/ban`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ adminId, email: selectedUser.email }),
        });

        const clone = res.clone();
        clone
            .json()
            .then((data) => {
                console.log("DELETE RESPONSE STATUS:", res.status);
                console.log("DELETE RESPONSE BODY:", data);
            })
            .catch((err) => {
                console.log("Failed to parse delete response JSON", err);
            });

        return res;
    };

    // 🔹 used by ConfirmationPopup to update UI after delete
    const handleDeleteCallback = (ok) => {
        console.log("CALLBACK RECEIVED:", ok);

        if (ok && selectedUser) {
            setUsersReported((prev) =>
                prev.filter((u) => u.id !== selectedUser.id)
            );
        } else if (!ok) {
            alert("Failed to delete user. Check console for details.");
        }

        setDeletePopupOpen(false);
        setSelectedUser(null);
    };

    // 🔹 keep name: handleDelete
    const handleDelete = (id) => {
        const user = usersReported.find((u) => u.id === id);
        if (!user) return;
        setSelectedUser(user);
        setDeletePopupOpen(true);
    };

    return (
        <Stack
            direction="row"
            sx={{ bgcolor: "background.paper", minHeight: "100vh" }}
        >
            {/* Desktop nav */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
                <DesktopNav />
            </Box>

            {/* Main column */}
            <Box sx={{ flex: 1, m: 0 }}>
                <Header />

                <Container
                    maxWidth="lg"
                    sx={{
                        flexGrow: 1,
                        py: { xs: 2, md: 4 },
                        px: { xs: 2, sm: 3, md: 6 },
                        display: "flex",
                        flexDirection: "column",
                        gap: { xs: 4, md: 4 },
                        mb: { xs: 8, md: 4 },
                    }}
                >
                    {/* Title */}
                    <Typography
                        sx={{
                            fontSize: { xs: "24px", md: "28px" },
                            fontWeight: 400,
                            mb: 0.5,
                        }}
                    >
                        View Reported Users
                    </Typography>

                    {errorMsg && (
                        <Typography color="error" sx={{ mb: 1 }}>
                            {errorMsg}
                        </Typography>
                    )}

                    {/* Cards grid */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "repeat(2, minmax(0, 1fr))",
                            },
                            gap: 3,
                        }}
                    >
                        {usersReported.map((user) => (
                            <ReportedUserCard
                                key={user.id}
                                user={user}
                                onView={() => handleView(user.id)}
                                onMessage={() => handleMessage(user.email)}
                                onDelete={() => handleDelete(user.id)}
                            />
                        ))}

                        {usersReported.length === 0 && !errorMsg && (
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                No reported users found.
                            </Typography>
                        )}
                    </Box>
                </Container>
            </Box>

            {/* Mobile nav */}
            <Box
                sx={{
                    display: { xs: "block", md: "none" },
                    position: "fixed",
                }}
            >
                <MobileNav />
            </Box>

            {/* Confirmation popup */}
            <ConfirmationPopup
                open={deletePopupOpen}
                handleClose={() => {
                    setDeletePopupOpen(false);
                    setSelectedUser(null);
                }}
                warningMessage={
                    selectedUser
                        ? `Are you sure you want to ban and delete ${selectedUser.email}?`
                        : "Are you sure you want to ban and delete this user?"
                }
                executeFunction={executeDelete}
                callBack={handleDeleteCallback}
            />
        </Stack>
    );
}

// Reported User Card
function ReportedUserCard({ user, onView, onMessage, onDelete }) {
    return (
        <Box
            sx={{
                border: "1px solid #e4e1deff",
                borderRadius: 5,
                backgroundColor: "#FFFFFF",
                p: 2,
            }}
        >
            <Stack direction="row" spacing={2.5} alignItems="center">
                {/* Profile Icon  */}
                <Box
                    sx={{
                        position: "relative",
                        width: 90,
                        height: 90,
                        borderRadius: "50%",
                        backgroundColor: "#E0E0E0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <ReportedUserIconSVG width={45} height={45} />
                </Box>

                {/* Text and custom buttons */}
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
                        {user.name}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: 13,
                            color: "text.secondary",
                            mb: 0.5,
                            mt: 0.5,
                        }}
                    >
                        {user.email}
                    </Typography>
                    <Typography sx={{ fontSize: 13, mb: 1 }}>
                        Reported {user.reportCount} time
                        {user.reportCount !== 1 ? "s" : ""} • {user.reason}
                    </Typography>

                    <Stack direction="row" spacing={1.2}>
                        <CustomButton onClick={onView} color="black">
                            View
                        </CustomButton>
                        <CustomButton onClick={onMessage} color="black">
                            Message
                        </CustomButton>
                        <CustomButton onClick={onDelete} color="red">
                            Delete
                        </CustomButton>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
}

function CustomButton({ children, color, onClick }) {
    const bg = color === "red" ? "#D22C22" : "#000000";

    return (
        <Button
            variant="contained"
            size="small"
            color={ color === "red"  ? "red" : "black"}
            onClick={onClick}
        >
            {children}
        </Button>
    );
}
