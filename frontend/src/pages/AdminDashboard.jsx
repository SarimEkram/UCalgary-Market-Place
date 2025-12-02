//AdminDashboard.jsx
import {
  Box,
  Container,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import ProfileIconSVG from "../assets/ProfileIconSVG";
import ReportIconSVG from "../assets/ReportIconSVG";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import DesktopNav from "../components/DesktopNav";
import MobileNav from "../components/MobileNav";

function DashCard({ icon, label, onClick }) {
  return (
    <Paper
      onClick={onClick}
      sx={{
        width: { xs: "250px", md: "400px" },  
        height: { xs: "130px", md: "160px" },
        cursor: "pointer",
        borderRadius: "10px",
        border: "1px solid #fbf9f7ff",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        margin: "0 auto",
        alignItems: "center",
        px: { xs: "12px", md: "20px" },
        py: { xs: "16px", md: "24px" },
        justifyContent: "center",
      }}
    >
      <Box
        mb={{ xs: "4px", md: "10px" }}
        sx={{
          "& svg": {
            fontSize: { xs: "50px", md: "60px" },
            width: { xs: "80px", md: "80px" },
            height: { xs: "80px", md: "80px" },
          },
        }}
      >
        {icon}
      </Box>

      <Typography
        align="center"
        sx={{
          fontSize: { xs: "16px", md: "19px" },
          lineHeight: "22px",
        }}
      >
        {label}
      </Typography>
    </Paper>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <Stack
      direction="row"
      sx={{ bgcolor: "background.paper", minHeight: "100vh" }}
    >
      {/* Desktop left navigation */}
      <DesktopNav active="Admin" />

      {/* Content */}
      <Box sx={{ flex: 1, m: 0 }}>
        <Header />

        <Container
          maxWidth="lg"
          sx={{
            pt: { xs: 3, md: 5 },
            pb: { xs: 10, md: 8 },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "20px", md: "26px" },
              fontWeight: 500,
              mb: "10px",
            }}
          >
            Admin Dashboard
          </Typography>

          <Box
            sx={{
              borderBottom: "1px solid #faf7f5ff",
              mb: "24px",
            }}
          />

          <Stack spacing={{ xs: 3, md: 4 }}>
            {/* Find User and Find Admin */}
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing="30px"
              justifyContent="flex-start"
              alignItems={{ xs: "center", md: "flex-start" }}
            >
              <DashCard
                icon={<ProfileIconSVG />}
                label="Find User"
                onClick={() => navigate("/admin/find-user")}
              />

              <DashCard
                icon={<ProfileIconSVG />}
                label="Find Admin"
                onClick={() => navigate("/admin/find-admin")}
              />
            </Stack>

            {/* View Reported Market and Event Posts */}
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing="30px"
              justifyContent="flex-start"
              alignItems={{ xs: "center", md: "flex-start" }}
            >
              <DashCard
                icon={<ReportIconSVG />}
                label="View Reported Market Posts"
                onClick={() => navigate("/admin/reported-market-posts")}
              />

              <DashCard
                icon={<ReportIconSVG />}
                label="View Reported Event Posts"
                onClick={() => navigate("/admin/reported-event-posts")}
              />
            </Stack>

            {/* View Reported Users */}
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing="30px"
              justifyContent="flex-start"
              alignItems={{ xs: "center", md: "flex-start" }}
            >
              <DashCard
                icon={<ReportIconSVG />}
                label="View Reported Users"
                onClick={() => navigate("/admin/reported-users")}
              />
            </Stack>
          </Stack>
        </Container>
      </Box>

      <MobileNav />
    </Stack>
  );
}
