import { Box, Container, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CustomButton from "../components/CustomButton";
import Header from "../components/Header";
import UserMenu from "../components/UserMenu";
import PostCard from "../components/UserPostCard";
import DesktopNav from "../components/DesktopNav";
import MobileNav from "../components/MobileNav";

export default function MyEvents() {
  const [items, setItems] = useState([]);
  const [userID, setUserID] = useState(() => {
    return JSON.parse(localStorage.getItem("user")).id;
  });

  const navigate = useNavigate();
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      //  const response = await fetch(
      //    `http://localhost:8080/api/posts/eventdetails/${id}`,
      //    {
      //      method: "GET",
      //      headers: {
      //        "Content-Type": "application/json",
      //      },
      //    }
      //  );

      //  const data = await response.json();
      //  data = data.map((item) => {
      //    const image = item.image;
      //    const blob = image.data.replace(/\s/g, "");
      //    const src = `data:image/jpeg;base64,${blob}`;
      //    item.image = src;
      //    return item;
      //  });

      let data = [
        {
          id: 103,
          title: "TI-84 Calculator",
          price: 65,
          post_type: "market",
          postal_code: "T2L2M3",
          posted_date: "2025-11-01T00:00:00.000Z",
          organization_name: null,
          event_start: null,
          event_end: null,
          thumbnail: {
            image_id: 403,
            data: "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",
          },
        },
        {
          id: 102,
          title: "Gaming Chair",
          price: 120,
          post_type: "market",
          postal_code: "T3P2A6",
          posted_date: "2025-10-25T00:00:00.000Z",
          organization_name: null,
          event_start: null,
          event_end: null,
          thumbnail: {
            image_id: 402,
            data: "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",
          },
        },
      ];

      data = data.map((item) => {
        if (item.thumbnail != null) {
          const blob = item.thumbnail.replace(/\s/g, "");
          const src = `data:image/jpeg;base64,${blob}`;
          item["image"] = src;
        } else {
          item["image"] = null;
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
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Stack direction={"row"} spacing={1}>
              <UserMenu></UserMenu>
              <Typography variant="h4">My Events</Typography>
            </Stack>
            <CustomButton
              color="black"
              style={{ flexGrow: 0 }}
              onClick={() => {
                navigate("new");
              }}
            >
              Create
            </CustomButton>
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
            {items.length > 0 ? items.map((post, index) => (
              <PostCard
                key={"post-card-" + index}
                postID={post.post_id}
                primaryText={post.title}
                image={post.image}
                secondaryText={dayjs(post.posted_date).format("MMM DD YYYY")}
                TopLeftAction={() => (
                  <CustomButton onClick={() => navigate(`${post.post_id}`)}>
                    Edit
                  </CustomButton>
                )}
                disableNavigation
              ></PostCard>
            )) : <Typography variant="h5" color="textSecondary">No Events.</Typography>}
          </Box>
        </Container>
      </Box>
      <MobileNav></MobileNav>
    </Stack>
  );
}
