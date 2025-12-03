import { Box, Container, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ProfileIcon from "../assets/ProfileIconSVG";
import Header from "../components/Header";
import PostCard from "../components/ReportedPostCard";

import DesktopNav from "../components/DesktopNav";
import MobileNav from "../components/MobileNav";

export default function UserProfile() {
    const [eventPosts, setEventPosts] = useState([]);
    const [marketPosts, setMarketPosts] = useState([]);
    const [userData, setUserData] = useState({ fname: "", lname: "", email: "" });

    const { id } = useParams();

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/admin/users/${id}/profile`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!res.ok) {
                    console.error("Failed to load profile", await res.text());
                    return;
                }

                const data = await res.json();

                const mapPost = (item) => {
                    const thumbnail = item.thumbnail ?? item.thumbnail_blob ?? null;

                    return {
                        ...item,
                        image: thumbnail
                            ? `data:image/jpeg;base64,${thumbnail}`
                            : null,
                    };
                };

                setEventPosts((data.eventPosts || []).map(mapPost));
                setMarketPosts((data.marketPosts || []).map(mapPost));

                const user = data.user || {};
                setUserData({
                    fname: user.fname || "",
                    lname: user.lname || "",
                    email: user.email || "",
                });
            } catch (err) {
                console.error("Error fetching user profile:", err);
            }
        }

        if (id) {
            fetchData();
        }
    }, [id]);

    const CustomDivider = (props) => (
        <Box>
            <Divider
                variant="fullWidth"
                {...props}
                sx={(theme) => ({
                    borderBottom: 0.75,
                    borderColor: theme.palette.divider,
                    boxSizing: "border-box",
                    marginTop: 3,
                    marginBottom: 3,
                })}
            />
        </Box>
    );

    return (
        <Stack
            direction="row"
            sx={{ bgcolor: "background.paper", minHeight: "100vh" }}
        >
            <DesktopNav />
            <Box sx={{ flex: 1, m: 0 }}>
                <Header />
                <Container
                    maxWidth="lg"
                    sx={{
                        flexGrow: 1,
                        py: { xs: 4, md: 8 },
                        px: { xs: 4, sm: 6, md: 10 },
                        display: "flex",
                        flexDirection: "column",
                        gap: { xs: 3, md: 4 },
                        mb: 30,
                    }}
                >
                    <Box>
                        <Typography variant="h4">User Profile</Typography>
                        <CustomDivider />
                    </Box>

                    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                        <ProfileIcon />
                        <Box>
                            <Typography variant="h4">
                                {userData.fname} {userData.lname}
                            </Typography>
                            <Typography variant="h6">{userData.email}</Typography>
                        </Box>
                    </Stack>

                    <Box
                        sx={(theme) => ({
                            display: "grid",
                            [theme.breakpoints.down("sm")]: {
                                gridTemplateColumns: "repeat(1, minmax(min-content, 1fr))",
                            },
                            [theme.breakpoints.between("sm", "1000")]: {
                                gridTemplateColumns: "repeat(1, minmax(min-content, 0.6fr))",
                            },
                            [theme.breakpoints.up("1000")]: {
                                gridTemplateColumns: "repeat(2, minmax(min-content, 0.6fr))",
                            },
                            columnGap: 5,
                            rowGap: 2,
                            mt: 0.5,
                        })}
                    >
                        {/* Event posts */}
                        <Stack direction="column" spacing={2} sx={{ my: 5 }}>
                            <Typography variant="h4">Event Posts</Typography>
                            <Box
                                id="event-container"
                                sx={{
                                    display: "grid",
                                    gridAutoFlow: "row",
                                    gridAutoColumns: "1fr",
                                    gridAutoRows: "0.6fr",
                                    columnGap: 2,
                                    rowGap: 10,
                                    mt: 0.5,
                                }}
                            >
                                {eventPosts.length === 0 ? (
                                    <Typography variant="h5" color="textSecondary">
                                        No Posts
                                    </Typography>
                                ) : (
                                    eventPosts.map((post, index) => (
                                        <PostCard
                                            key={`event-card-${index}`}
                                            id={post.post_id}
                                            type="events"
                                            primaryText={post.description}
                                            numReports={post.report_count ?? 0}
                                            // Only show the flag + date if there is at least 1 report
                                            reportDate={
                                                (post.report_count ?? 0) > 0 ? post.report_date : null
                                            }
                                            image={post.image}
                                        />
                                    ))
                                )}
                            </Box>
                        </Stack>

                        {/* Market posts */}
                        <Stack direction="column" spacing={2} sx={{ my: 5 }}>
                            <Typography variant="h4">Market Posts</Typography>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridAutoFlow: "row",
                                    gridAutoColumns: "1fr",
                                    gridAutoRows: "0.6fr",
                                    columnGap: 2,
                                    rowGap: 10,
                                    mt: 0.5,
                                }}
                            >
                                {marketPosts.length === 0 ? (
                                    <Typography variant="h5" color="textSecondary">
                                        No Posts
                                    </Typography>
                                ) : (
                                    marketPosts.map((post, index) => (
                                        <PostCard
                                            key={`market-card-${index}`}
                                            id={post.post_id}
                                            type="market"
                                            primaryText={post.description}
                                            numReports={post.report_count ?? 0}
                                            reportDate={
                                                (post.report_count ?? 0) > 0 ? post.report_date : null
                                            }
                                            image={post.image}
                                        />
                                    ))
                                )}
                            </Box>
                        </Stack>
                    </Box>
                </Container>
            </Box>
            <MobileNav />
        </Stack>
    );
}
