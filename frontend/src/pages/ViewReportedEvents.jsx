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
      try {
        const response = await fetch(
          `/api/admin/reported-events`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch reported events");
          return;
        }

        let data = await response.json();
        data = [...data.events];
        
        if (!Array.isArray(data)) {
          console.error("Expected array but got:", typeof data);
          return;
        }
        
        data = data.map((item) => {
          if (item.thumbnail != null && item.thumbnail.data) {
            const blob = item.thumbnail.data.replace(/\s/g, "");
            const src = `data:image/jpeg;base64,${blob}`;
            item["image"] = src;
          } else {
            item["image"] = null;
          }
          return item;
        });

        if (isMounted) {
          setItems(data);
        }
      } catch (error) {
        console.error("Error fetching reported events:", error);
      }
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
              gridAutoRows: "200px",
              columnGap: 5,
              rowGap: 10,
              mt: 0.5,
               [theme.breakpoints.down("1100")]: {
                gridTemplateColumns: "repeat(1, 1fr)",
              },
              [theme.breakpoints.up("1100")]: {
                gridTemplateColumns: "repeat(2, 0.6fr)",
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
                  viewPath={`/admin/reports/events/${post.id}`}
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
