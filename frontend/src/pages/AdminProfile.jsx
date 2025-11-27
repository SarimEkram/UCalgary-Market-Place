import { Box, Container, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ProfileIcon from "../assets/ProfileIconSVG";
import CustomButton from "../components/CustomButton";
import Header from "../components/Header";
import dayjs from "dayjs";

export default function AdminProfile() {
  const [items, setItems] = useState([]);
  const [userData, setUserData] = useState({ fname: "", lname: "", email: "" });
  //userID
  const { id } = useParams();

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      // TODO: BTASK
      // add fetch request to get admin info (fname, lname, email),all actions:
      // body of request:
      // {
      // id: id
      // }

      /* const response = await fetch(
         `http://localhost:8080/api/posts/eventdetails/${id}`,
         {
           method: "GET",
           headers: {
             "Content-Type": "application/json",
           },
         }
       );

       const data = await response.json();
      */

      setUserData({ fname: "Jone", lname: "Carter", email: "jw@ucalgary.ca" });
      let actionData = [
        { date: "2025-11-01T00:00:00.000Z", action: "Delete a user" },
        { date: "2025-11-01T00:00:00.000Z", action: "Delete a user" },
      ];
      actionData = actionData.map((item) => {
        let dateObject = dayjs(item.date);
        console.log(dateObject);
        item["dateTime"] = dayjs(item.date).format("YYYY/MM/DD, h:mma");
        return item;
      });

      setItems(actionData);
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

  const ActionItem = ({ dateTime, action }) => (
    <Box>
      <Stack direction="row" spacing={2}>
        <Typography variant="h6">{dateTime}:</Typography>
        <Typography variant="h6">{action}</Typography>
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
    <Stack
      direction="column"
      sx={(theme) => ({
        bgcolor: theme.palette.background.default,
        minHeight: "100vh",
        justifyContent: "space-between",
      })}
    >
      <Header />
      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          py: { xs: 2, md: 4 },
          px: { xs: 2, sm: 3, md: 6 },
          display: "flex",
          flexDirection: "column",
          gap: { xs: 3, md: 4 },
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
              <CustomButton style={{ my: 2 }}>Delete</CustomButton>
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
          {items.map((item) => (
            <ActionItem
              dateTime={item.dateTime}
              action={item.action}
            ></ActionItem>
          ))}
        </Box>
      </Container>
    </Stack>
  );
}
