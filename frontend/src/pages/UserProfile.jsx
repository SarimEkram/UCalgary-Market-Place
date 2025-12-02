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
  //userID
  const { id } = useParams();

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      const response = await fetch(
        `http://localhost:8080/api/admin/users/${id}/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let data = await response.json();

      let eventPosts = [...data.eventPosts];
      
      eventPosts = eventPosts.map((item) => {
        if (item.thumbnail != null) {
          const blob = item.thumbnail.data.replace(/\s/g, "");
          const src = `data:image/jpeg;base64,${blob}`;
          item["image"] = src;
        } else {
          item["image"] = null;
        }
        return item;
      });

      setEventPosts(eventPosts);


      let marketPosts = [...data.marketPosts];
      
      marketPosts = marketPosts.map((item) => {
        if (item.thumbnail != null) {
          const blob = item.thumbnail.data.replace(/\s/g, "");
          const src = `data:image/jpeg;base64,${blob}`;
          item["image"] = src;
        } else {
          item["image"] = null;
        }
        return item;
      });

      setMarketPosts(marketPosts);

      setUserData({ fname: data.user.fname, lname: data.user.lname, email: data.user.email });
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const CustomDivider = (props) => (
    <Box>
      <Divider
        variant={"fullWidth"}
        {...props}
        sx={(theme) => ({
          borderBottom: 0.75,
          borderColor: theme.palette.divider,
          boxSizing: "border-box",
          marginTop: 3,
          marginBottom: 3,
        })}
      ></Divider>
    </Box>
  );

  return (
    <Stack
      direction="row"
      sx={{ bgcolor: "background.paper", minHeight: "100vh" }}
    >
      <DesktopNav></DesktopNav>
      <Box sx={{ flex: "1", m: 0 }}>
        <Header></Header>
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
            <CustomDivider></CustomDivider>
          </Box>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <ProfileIcon></ProfileIcon>
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
                gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
              },
              [theme.breakpoints.between("sm", "1000")]: {
                gridTemplateColumns: "repeat(1, 0.6fr)",
              },
              [theme.breakpoints.up("1000")]: {
                gridTemplateColumns: "repeat(2, minmax(0, 0.6fr))",
              },
              columnGap: 5,
              rowGap: 2,
              mt: 0.5,
            })}
          >
            <Stack direction={"column"} spacing={2} sx={{ my: 5 }}>
              <Typography variant="h4">Event Posts</Typography>
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
                {eventPosts.length == 0 ? <Typography variant="h5" color="textSecondary">No Posts</Typography> :eventPosts.map((post, index) => {
                  return (
                    <PostCard
                      key={"card-" + index}
                      primaryText={post.description}
                      reportDate={post.report_date}
                      numReports={post.report_count}
                      image={post.image}
                    ></PostCard>
                  );
                })}
              </Box>
            </Stack>
            <Stack direction={"column"} spacing={2} sx={{ my: 5 }}>
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
                {marketPosts.length == 0 ? <Typography variant="h5" color="textSecondary">No Posts</Typography>: marketPosts.map((post, index) => {
                  return (
                    <PostCard
                      key={"card-" + index}
                      primaryText={post.description}
                      reportDate={post.report_date}
                      numReports={post.report_count}
                      image={post.image}
                    ></PostCard>
                  );
                })}
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>
      <MobileNav></MobileNav>
    </Stack>
  );
}
