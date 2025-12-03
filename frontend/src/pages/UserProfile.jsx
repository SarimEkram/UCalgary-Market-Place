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
        let isMounted = true;

        async function fetchData() {
            const response = await fetch(
                `/api/admin/users/${id}/profile`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            // Event posts: keep report_count, just add image
            const eventPosts = data.eventPosts.map((item) => {
                if (item.thumbnail) {
                    item.image = `data:image/jpeg;base64,${item.thumbnail}`;
                } else {
                    item.image = null;
                }
                return item;
            });
            setEventPosts(eventPosts);

            // Market posts
            const marketPosts = data.marketPosts.map((item) => {
                if (item.thumbnail) {
                    item.image = `data:image/jpeg;base64,${item.thumbnail}`;
                } else {
                    item.image = null;
                }
                return item;
            });
            setMarketPosts(marketPosts);

            setUserData({
                fname: data.user.fname,
                lname: data.user.lname,
                email: data.user.email,
            });
        }

        if (isMounted) {
            fetchData();
        }

        return () => {
            isMounted = false;
        };
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
                                    eventPosts.map((post) => (
                                        <PostCard
                                            key={`event-card-${post.post_id}`}
                                            id={post.post_id}                 // needed for delete + view
                                            type="events"                      // used in /reports/events/:id
                                            primaryText={post.description}
                                            reportDate={post.report_date}
                                            numReports={post.report_count}     // correct field name
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
                                    marketPosts.map((post) => (
                                        <PostCard
                                            key={`market-card-${post.post_id}`}
                                            id={post.post_id}
                                            type="market"
                                            primaryText={post.description}
                                            reportDate={post.report_date}
                                            numReports={post.report_count}
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
