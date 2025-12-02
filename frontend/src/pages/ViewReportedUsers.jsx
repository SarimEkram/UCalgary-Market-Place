//ViewReportedUsers.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import DesktopNav from "../components/DesktopNav";
import MobileNav from "../components/MobileNav";
import Header from "../components/Header";
import ReportedUserIconSVG from "../assets/ReportedUserIconSVG"

export default function ViewReportedUsers() {
  const [usersReported, setUsersReported] = useState([]);

  useEffect(() => {
    // TODO: replace mock with backend call.
    setUsersReported([
      {
        id: 1,
        name: "John Doe",
        email: "johndoe@ucalgary.ca",
        reason: "Inappropriate",
      },
      {
        id: 2,
        name: "John Doe",
        email: "johndoe@ucalgary.ca",
        reason: "Inappropriate",
      },
      {
        id: 3,
        name: "John Smith",
        email: "johnsmith@ucalgary.ca",
        reason: "Inappropriate",
      },
      {
        id: 4,
        name: "John Smith",
        email: "johnsmith@ucalgary.ca",
        reason: "Inappropriate",
      },
      {
        id: 5,
        name: "John Row",
        email: "johnrow@ucalgary.ca",
        reason: "Inappropriate",
      },
      {
        id: 6,
        name: "John Row",
        email: "johnrow@ucalgary.ca",
        reason: "Inappropriate",
      },
    ]);
  }, []);

  const handleView = (id) => {
    // TODO: navigate to user profile page
    console.log("View reported user", id);
  };

  const handleMessage = (id) => {
    // TODO: message dialog
    console.log("Message user", id);
  };

  const handleDelete = (id) => {
    // TODO: call delete
    console.log("Delete user", id);
  };

  return (
    <Stack
      direction="row"
      sx={{ bgcolor: "background.paper", minHeight: "100vh" }}
    >
      {/* Desktop nav */}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <DesktopNav />
      </Box>

      {/* Main column */}
      <Box sx={{ flex: 1, m: 0 }}>
        <Header />

        <Container
          maxWidth="lg"
          sx={{
            flexGrow: 1,
            py: { xs: 2, md: 4 },
            px: { xs: 2, sm: 3, md: 6 },
            display: "flex",
            flexDirection: "column",
            gap: { xs: 4, md: 4 },
            mb: { xs: 8, md: 4 },
          }}
        >
          {/* Title */}
          <Typography
            sx={{
              fontSize: { xs: "24px", md: "28px" },
              fontWeight: 400,
              mb: 0.5,
            }}
          >
            View Reported Users
          </Typography>

          {/* Cards grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },
              gap: 3,
            }}
          >
            {usersReported.map((user) => (
              <ReportedUserCard
                key={user.id}
                user={user}
                onView={() => handleView(user.id)}
                onMessage={() => handleMessage(user.id)}
                onDelete={() => handleDelete(user.id)}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Mobile nav */}
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
        }}
      >
        <MobileNav />
      </Box>
    </Stack>
  );
}

// Reported User Card
function ReportedUserCard({ user, onView, onMessage, onDelete }) {
  return (
    <Box
      sx={{
        border: "1px solid #e4e1deff",
        borderRadius: 5,
        backgroundColor: "#FFFFFF",
        p: 2,
      }}
    >
      <Stack direction="row" spacing={2.5} alignItems="center">
        {/* Profile Icon  */}
        <Box
          sx={{
            position: "relative",
            width: 90,
            height: 90,
            borderRadius: "50%",
            backgroundColor: "#E0E0E0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ReportedUserIconSVG width={45} height={45} />
         
        </Box>

        {/* Text and custom buttons */}
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
            {user.name}
          </Typography>
          <Typography
            sx={{
              fontSize: 13,
              color: "text.secondary",
              mb: 0.5,
              mt: 0.5,
            }}
          >
            {user.email}
          </Typography>
          <Typography sx={{ fontSize: 13, mb: 1 }}>
            {user.reason}
          </Typography>

          <Stack direction="row" spacing={1.2}>
            <CustomButton onClick={onView} color="black">
              View
            </CustomButton>
            <CustomButton onClick={onMessage} color="black">
              Message
            </CustomButton>
            <CustomButton onClick={onDelete} color="red">
              Delete
            </CustomButton>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

function CustomButton({ children, color, onClick }) {
  const bg =
    color === "red" ? "#D22C22" : "#000000";

  return (
    <Button
      variant="contained"
      size="small"
      onClick={onClick}
      sx={{
        textTransform: "none",
        fontSize: 15,
        borderRadius: 5,
        px: 2,
        py: 0.5,
        backgroundColor: bg,
        
      }}
    >
      {children}
    </Button>
  );
}
