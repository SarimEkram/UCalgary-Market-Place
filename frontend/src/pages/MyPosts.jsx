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

export default function MyPosts() {
  const [items, setItems] = useState([]);
  const [userID, setUserID] = useState(()=>{
      return JSON.parse(localStorage.getItem("user")).id;
    });

  const navigate = useNavigate();
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
       const response = await fetch(
         `http://localhost:8080/api/my-posts/list`,
         {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
           body : JSON.stringify({userId : userID}),
         }
       );

      let data = await response.json();
      data = data.myPosts;

      data = data.map((item) => {
        if (item.thumbnail != null){
        const blob = item.thumbnail.replace(/\s/g, "");
        const src = `data:image/jpeg;base64,${blob}`;
        item["image"] = src;
        }else{ 
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

  const onCreate = () => {
    navigate("new");
  };

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
              <Typography variant="h4">My Posts</Typography>
            </Stack>
            <CustomButton
              onClick={onCreate}
              color="black"
              style={{ flexGrow: 0 }}
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
            {items.length > 0 ? (
              items.map((post, index) => (
                <PostCard
                  key={"post-card-" + index}
                  postID={post.post_id}
                  primaryText={post.name}
                  image={post.image}
                  secondaryText={dayjs(post.posted_date).format("MMM DD YYYY")}
                  TopLeftAction={() => (
                    <CustomButton onClick={() => navigate(`${post.post_id}`)}>
                      Edit
                    </CustomButton>
                  )}
                  disableNavigation
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
