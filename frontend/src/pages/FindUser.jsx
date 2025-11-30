// FindUser.jsx

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ProfileIcon from "../assets/ProfileIconSVG";
import CustomButton from "../components/CustomButton";
import DesktopNav from "../components/DesktopNav";
import MobileNav from "../components/MobileNav";
import Header from "../components/Header";

export default function FindUser() {
  const [searchTermUser, setSearchTermUser] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // TODO: Replace mock data with real backend call.
    

    async function fetchUsers() {
      try {
    
        // TEMP: mock data
        setUsers([
          { id: 1, name: "Jane Doe", email: "janedoe@ucalgary.ca" },
          { id: 2, name: "Alex Lee", email: "alex.lee@ucalgary.ca" },
          { id: 3, name: "Chris Wong", email: "chris.wong@ucalgary.ca" },
          { id: 4, name: "Sam Taylor", email: "sam.taylor@ucalgary.ca" },
          { id: 5, name: "Jordan Ray", email: "jordan.ray@ucalgary.ca" },
        ]);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    }

    fetchUsers();
  }, [searchTermUser]);

  // Filter the users based on search term
  const filterUsers = users.filter((user) => {
    const term = searchTermUser.toLowerCase().trim();
    return (
      !term ||
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  });

  const handleViewUser = (id) => {
    // TODO: navigate to view user
    console.log("View user", id);
  };

  const handleDeleteUser = (id) => {
    // TODO: call backend delete 
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

      {/* Header and Content*/}
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
            gap: { xs: 2, md: 3 },
            mb: { xs: 10, md: 4 },
          }}
        >
          {/*  Title */}
          <Box>
              <Typography variant="h4" sx={{
                            mb: 2,
                            fontSize: {
                                xs: "24px",  
                                sm: "28px",  
                                md: "32px", 
                            },
                            fontWeight: 400,
                        }}>
              Find User
            </Typography>
          </Box>

          {/* Search bar */}
          <TextField
            fullWidth
            variant="standard"
            placeholder="Search…"
            value={searchTermUser}
            onChange={(e) => setSearchTermUser(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Divider sx={{ my: 3 }} />

          {/* Grid for User Cards */}
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
            {filterUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onView={() => handleViewUser(user.id)}
                onDelete={() => handleDeleteUser(user.id)}
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

// User Card
function UserCard({ user, onView, onDelete }) {
  return (
    <Box
      sx={(theme) => ({
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        p: 3,
        alignItems: "center",
        display: "flex",
        gap: 2,
        backgroundColor: "#FFFFFF",
      })}
    >
      {/* Profile Icon Circle */}
      <Box
        sx={{
          width: 90,
          height: 90,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <ProfileIcon width={49} height={49} />
      </Box>

      {/* Name, email and custom buttons */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          {user.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 1, mt: 0.5 }}
        >
          {user.email}
        </Typography>

        <Stack direction="row" spacing={1.5}>
          <CustomButton
            variant="contained"
            size="small"
            onClick={onView}
            sx={{
              textTransform: "none",
              backgroundColor: "#000000",
            }}
          >
            View
          </CustomButton>

          <CustomButton
            variant="contained"
            size="small"
            onClick={onDelete}
            sx={{
              textTransform: "none",
              backgroundColor: "#D22C22",
            }}
          >
            Delete User
          </CustomButton>
        </Stack>
      </Box>
    </Box>
  );
}
