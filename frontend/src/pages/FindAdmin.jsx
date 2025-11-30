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
import CustomButton from "../components/CustomButton";
import DesktopNav from "../components/DesktopNav";
import MobileNav from "../components/MobileNav";
import Header from "../components/Header";
import ProfileIcon from "../assets/ProfileIconSVG";


export default function AdminSettings() {
    const [searchTermAdmin, setSearchTermAdmin] = useState("");
    const [admins, setAdminsList] = useState([]);

    useEffect(() => {
        // TODO: Replace mock data with backend call.

        async function fetchAdmins() {
            try {
                //Fetch data from backend
                setAdminsList([
                    {
                        id: 1,
                        name: "John Doe",
                        email: "johndoe@ucalgary.ca",
                    },
                    {
                        id: 2,
                        name: "John Doell",
                        email: "johndoell@ucalgary.ca",
                    },
                    {
                        id: 3,
                        name: "John Smith",
                        email: "johnsmith@ucalgary.ca",
                    },
                    {
                        id: 4,
                        name: "John Smith",
                        email: "johnsmith@ucalgary.ca",
                    },
                    {
                        id: 5,
                        name: "John Row",
                        email: "johnrow@ucalgary.ca",
                    },
                ]);
            } catch (err) {
                console.error("Failed to fetch admins:", err);
            }
        }

        fetchAdmins();
    }, [searchTermAdmin]);

    // Filter the admins based on search term
    const filterAdmins = admins.filter((admin) =>
        admin.name.toLowerCase().includes(searchTermAdmin.toLowerCase())
    );

    const handleViewAdmin = (id) => {
        // TODO: Navigate to admin profile
            console.log("View admin", id);
    };

    const handleDeleteAdmin = (id) => {
        // TODO: Call backend delete
        console.log("Delete admin", id);
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

            {/* Header and Content */}
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
                        <Typography variant="h4" sx={{
                            mb: 2,
                            fontSize: {
                                xs: "24px",  
                                sm: "28px",  
                                md: "32px", 
                            },
                            fontWeight: 400,
                        }}>
                            Find Admin
                        </Typography>
                    </Box>

                    {/* Search bar */}
                    <TextField
                        fullWidth
                        variant="standard"
                        placeholder="Search..."
                        value={searchTermAdmin}
                        onChange={(e) => setSearchTermAdmin(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Divider sx={{ my: 3 }} />

                    {/* Grid of Admin cards */}
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
                        {filterAdmins.map((admin) => (
                            <AdminCard
                                key={admin.id}
                                admin={admin}
                                onView={() => handleViewAdmin(admin.id)}
                                onDelete={() => handleDeleteAdmin(admin.id)}
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
        </Stack>
    );
}

// Admin Card
function AdminCard({ admin, onView, onDelete }) {
    return (
        <Box
            sx={(theme) => ({
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                p: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
                backgroundColor: "#FFFFFF",
            })}
        >
            {/* Profile Icon circle */}
            <Box
                sx={{
                    width: 90,
                    height: 90,
                    borderRadius: "50%",
                    justifyContent: "center",
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                }}
            >
                <ProfileIcon width={49} height={49} />
            </Box>

            {/* Name, email and custom buttons */}
            <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {admin.name}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 1, mt: 0.5 }}
                >
                    {admin.email}
                </Typography>

                <Stack direction="row" spacing={2.5}>
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
                        Delete Admin
                    </CustomButton>
                </Stack>
            </Box>
        </Box>
    );
}
