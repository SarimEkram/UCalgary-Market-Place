import { Box, Container, Icon, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import UserMenu from "../components/UserMenu";
import PostCard from "../components/UserPostCard";
import CheckCircle from "../assets/CheckCircle";
import DesktopNav from "../components/DesktopNav";
import MobileNav from "../components/MobileNav";

export default function MyContacted() {
  const [items, setItems] = useState([]);
  const [userID, setUserID] = useState(() => {
    return JSON.parse(localStorage.getItem("user")).id;
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      const response = await fetch(
        `http://localhost:8080/api/getContactedPosts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userID }),
        }
      );

      let data = await response.json();
      data = data.contactedPosts;

      data = data.map((item) => {
        if (item.thumbnail != null) {
          const blob = item.thumbnail.replace(/\s/g, "");
          const src = `data:image/jpeg;base64,${blob}`;
          item["image"] = src;
          
        } else {
          item["image"] = null;
        }
        item.price = item.price != null ? `$${item.price}` : "Free";
        if (item.post_type == "event") {
          item.post_type = "events";
        }
        return item;
      });

      setItems(data);
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  function GetIcon() {
    return (
      <Icon fontSize="large">
        <CheckCircle></CheckCircle>
      </Icon>
    );
  }
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
            py: { xs: 2, md: 4 },
            px: { xs: 2, sm: 3, md: 6 },
            display: "flex",
            flexDirection: "column",
            gap: { xs: 3, md: 4 },
            mb: 15,
          }}
        >
          <Stack direction={"row"} spacing={1}>
            <UserMenu></UserMenu>
            <Typography variant="h4">My Contacted</Typography>
          </Stack>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, minmax(0, 1fr))", // 1 rows on mobile
                sm: "repeat(2, minmax(0, 1fr))", // 2 rows on small tablets
                md: "repeat(2, minmax(0, 1fr))", // 2 rows on desktop
              },
              columnGap: 2,
              rowGap: 2,
              mt: 0.5,
            }}
          >
            {items.length > 0 ? (
              items.map((post, index) => (
                <PostCard
                  key={"post-card-" + index}
                  link={`/${post.post_type}/${post.post_id}`}
                  primaryText={post.title}
                  image={post.image}
                  secondaryText={post.seller_fname + " " + post.seller_lname}
                  tertiaryText={post.price}
                  TopLeftAction={GetIcon}
                ></PostCard>
              ))
            ) : (
              <Typography variant="h5" color="textSecondary">
                No saved posts.
              </Typography>
            )}
          </Box>
        </Container>
      </Box>
      <MobileNav></MobileNav>
    </Stack>
  );
}
