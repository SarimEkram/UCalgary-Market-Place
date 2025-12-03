import { useEffect, useState } from "react";
import {
    Box,
    Container,
    Divider,
    Stack,
    TextField,
    Typography,
    InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ProfileIcon from "../assets/ProfileIconSVG";
import CustomButton from "../components/CustomButton";
import DesktopNav from "../components/DesktopNav";
import MobileNav from "../components/MobileNav";
import Header from "../components/Header";
import ConfirmationPopup from "../components/ConfirmationPopup";

const API_BASE = "http://localhost:8080";
const PAGE_SIZE = 6;

export default function FindUser() {
    const [searchTermUser, setSearchTermUser] = useState("");
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [deletePopupOpen, setDeletePopupOpen] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState(null);

    //  Delete request used by ConfirmationPopup
    const executeDelete = async () => {
        const adminId = 1; // TODO: replace with real admin ID

        console.log("DELETE REQUEST STARTED:", selectedEmail);

        const res = await fetch(`${API_BASE}/api/admin/users/ban`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ adminId, email: selectedEmail }),
        });


        // Debug log backend response without breaking popup json() call
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

        return res; // ConfirmationPopup will call response.json() again
    };

    //  Called by ConfirmationPopup with result of response.ok
    const handleDeleteCallback = (ok) => {
        console.log("CALLBACK RECEIVED:", ok);

        if (ok) {
            // Success: remove from UI
            setUsers((prev) => prev.filter((u) => u.email !== selectedEmail));
            setDeletePopupOpen(false);
        } else {
            // Failure: show something so it doesn't feel like "nothing happened"
            alert("Failed to delete user. Check console for details.");
            setDeletePopupOpen(false);
        }
    };

    // Fetch users whenever search term changes
    useEffect(() => {
        async function fetchUsers() {
            try {
                setIsLoading(true);
                setErrorMsg("");

                const term = searchTermUser.trim();

                const params = new URLSearchParams({
                    limit: PAGE_SIZE.toString(),
                    offset: "0",
                });

                // Add q only if user typed something
                if (term !== "") {
                    params.append("q", term);
                }

                const res = await fetch(
                    `${API_BASE}/api/admin/users?${params.toString()}`
                );

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    setErrorMsg(data?.error || "Failed to load users");
                    setUsers([]);
                    return;
                }

                const data = await res.json();

                const mapped = (data.users || []).map((u) => ({
                    id: u.user_id,
                    name: `${u.fname} ${u.lname}`.trim(),
                    email: u.email,
                }));

                setUsers(mapped);
            } catch (err) {
                console.error("Failed to fetch users:", err);
                setErrorMsg("Failed to load users");
                setUsers([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchUsers();
    }, [searchTermUser]);

    const handleViewUser = (id) => {
        console.log("View user", id);
        // TODO: navigate to admin user profile page
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

            {/* Header + Content */}
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
                        gap: { xs: 2, md: 3 },
                        mb: { xs: 10, md: 4 },
                    }}
                >
                    {/* Title */}
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{
                                mb: 2,
                                fontSize: {
                                    xs: "24px",
                                    sm: "28px",
                                    md: "32px",
                                },
                                fontWeight: 400,
                            }}
                        >
                            Find User
                        </Typography>
                    </Box>

                    {/* Search bar */}
                    <TextField
                        fullWidth
                        variant="standard"
                        placeholder="Search…"
                        value={searchTermUser}
                        onChange={(e) => setSearchTermUser(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Divider sx={{ my: 3 }} />

                    {/* Loading / error text */}
                    {isLoading && (
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Loading users…
                        </Typography>
                    )}
                    {errorMsg && (
                        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                            {errorMsg}
                        </Typography>
                    )}

                    {/* User cards grid */}
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
                        {users.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onView={() => handleViewUser(user.id)}
                                onDelete={() => {
                                    setSelectedEmail(user.email);
                                    setDeletePopupOpen(true);
                                }}
                            />
                        ))}
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

            {/* Confirmation popup (shared component, unchanged) */}
            <ConfirmationPopup
                open={deletePopupOpen}
                handleClose={() => setDeletePopupOpen(false)}
                warningMessage="Are you sure you want to ban and delete this user?"
                executeFunction={executeDelete}
                callBack={handleDeleteCallback}
            />
        </Stack>
    );
}

// User card component
function UserCard({ user, onView, onDelete }) {
    return (
        <Box
            sx={(theme) => ({
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                p: 3,
                alignItems: "center",
                display: "flex",
                gap: 2,
                backgroundColor: "#FFFFFF",
            })}
        >
            {/* Profile icon circle */}
            <Box
                sx={{
                    width: 90,
                    height: 90,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                <ProfileIcon width={49} height={49} />
            </Box>

            {/* Name, email, buttons */}
            <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {user.name}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 1, mt: 0.5 }}
                >
                    {user.email}
                </Typography>

                <Stack direction="row" spacing={1.5}>
                    <CustomButton
                        variant="contained"
                        size="small"
                        onClick={onView}
                        sx={{
                            textTransform: "none",
                            backgroundColor: "#000000",
                        }}
                    >
                        View
                    </CustomButton>

                    <CustomButton
                        variant="contained"
                        size="small"
                        onClick={onDelete}
                        sx={{
                            textTransform: "none",
                            backgroundColor: "#D22C22",
                        }}
                    >
                        Delete User
                    </CustomButton>
                </Stack>
            </Box>
        </Box>
    );
}