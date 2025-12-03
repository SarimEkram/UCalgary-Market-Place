import { Box, Container, Divider, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ProfileIcon from "../assets/ProfileIconSVG";
import DesktopNav from "../components/DesktopNav";
import Header from "../components/Header";
import MobileNav from "../components/MobileNav";

export default function AdminProfile() {
  const [items, setItems] = useState([]);
  const [userData, setUserData] = useState({ fname: "", lname: "", email: "" });
  //admin ID
  const { id } = useParams();

  useEffect(() => {
    if (!id) return; // Guard against undefined id
    
    let isMounted = true;
    async function fetchData() {
      try {
        const response = await fetch(
          `/api/admin/recent-actions?adminId=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch admin data");
          return;
        }

        let data = await response.json();

        if (!data || !data.admin) {
          console.error("Invalid response data");
          return;
        }

        setUserData({ fname: data.admin.fname, lname: data.admin.lname, email: data.admin.email });

        let actionData = data.actions ? [...data.actions] : [];
        actionData = actionData.map((item) => {
          if (item.date) {
            item["dateTime"] = dayjs(item.date).format("YYYY/MM/DD, h:mma");
          }
          return item;
        });

        if (isMounted) {
          setItems(actionData);
        }
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [id]);

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

  const ActionItem = ({ dateTime, action }) => (
    <Box>
      <Stack direction="row" spacing={2}>
        <Typography variant="body1">{dateTime}:</Typography>
        <Typography variant="body1">{action}</Typography>
      </Stack>
      <Box>
        <Divider
          sx={(theme) => ({
            borderBottom: 3,
            borderColor: theme.palette.text.primary,
            boxSizing: "border-box",
            marginTop: 3,
            marginBottom: 3,
          })}
        ></Divider>
      </Box>
    </Box>
  );

  return (
    //1. Root container must look like this
    <Stack
      direction="row"
      sx={{ bgcolor: "background.paper", minHeight: "100vh" }}
    >
      {/* 2: Add Nav bar */}
      <DesktopNav></DesktopNav>
      {/*3. Enclouse Header, and MAIN PAGECONTENT  with this box */}
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
            /* 
          4: To prevent the bottom content from being covered by the mobile nav
          you may need to adjust the margin forr the Container for your main page content
          */
            mb: 10,
          }}
        >
          <Box sx={{ borderWidth: 0 }}>
            <Typography variant="h4">Admin Profile</Typography>
            <CustomDivider></CustomDivider>
          </Box>
          <Box
            sx={(theme) => ({
              borderStyle: "solid",
              borderWidth: 0.75,
              borderColor: theme.palette.divider,
              p: 5,
              borderRadius: theme.shape.borderRadius,
            })}
          >
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <ProfileIcon></ProfileIcon>

              <Box>
                <Typography variant="h4">
                  {userData.fname} {userData.lname}
                </Typography>
                <Typography variant="h6">{userData.email}</Typography>
              </Box>
            </Stack>
          </Box>
          <Box
            sx={(theme) => ({
              borderStyle: "solid",
              borderWidth: 0.75,
              borderColor: theme.palette.divider,
              p: 5,
              borderRadius: theme.shape.borderRadius,
            })}
          >
            <Typography variant="h4" sx={{ paddingBottom: 3 }}>
              Recent Actions:
            </Typography>
            {items.map((item, index) => (
              <ActionItem
                key={"action" + index}
                index={index}
                dateTime={item.dateTime}
                action={item.action}
              ></ActionItem>
            ))}
          </Box>
        </Container>
      </Box>
      {/* 5: Place the mobile nav after the box  */}
      <MobileNav></MobileNav>
    </Stack>
  );
}

