import { Box, Container, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import PostCard from "../components/ReportedPostCard";
import MobileNav from "../components/MobileNav";
import DesktopNav from "../components/DesktopNav";

export default function ViewReportedEvents() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      
      const response = await fetch(
        `http://localhost:8080/api/admin/reported-events`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let data = await response.json();
      data = data.map((item) => {
        if (item.thumbnail != null) {
          const blob = item.thumbnail.data.replace(/\s/g, "");
          const src = `data:image/jpeg;base64,${blob}`;
          item["image"] = src;
        } else {
          item["image"] = null;
        }
        return item;
      })
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
            <Typography variant="h4">View Reported Event Posts</Typography>
            <CustomDivider></CustomDivider>
          </Box>
          <Box
            sx={(theme)=>({
              display: "grid",
              gridAutoRows: "0.6fr",
              columnGap: 5,
              rowGap: 10,
              mt: 0.5,
              [theme.breakpoints.down("sm")]: {
                gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
              },
              [theme.breakpoints.between("sm", "1000")]: {
                gridTemplateColumns: "repeat(1, 0.6fr)",
              },
              [theme.breakpoints.up("1000")]: {
                gridTemplateColumns: "repeat(2, minmax(0, 0.6fr))",
              },
            })}
          >
           
            {items.length == 0 ? <Typography variant="h5" color="textSecondary">No Posts</Typography> : items.map((post, index) => {
              return (
                <PostCard
                  key={"card-" + (index + 2)}
                  primaryText={post.title}
                  reportDate={post.report_date}
                  numReports={post.report_count}
                  image={post.image}
                  type="market"
                  id={post.id}
                ></PostCard>
              );
            })}
          </Box>
        </Container>
      </Box>
      <MobileNav></MobileNav>
    </Stack>
  );
}
