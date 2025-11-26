import {
  Box,
  Stack,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import InfoIcon from "../assets/InfoIcon";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import ImageSlider from "../components/ImageSlider";
import ReportIssueDialog from "../components/ReportIssueDialog";
import CustomButton from "../components/CustomButton";

//TODO: Replace with real data from backend
export default function MarketItemPage() {
  const listing = {
    title: "calming fake plant in a mug",
    price: "$25",
    location: "NW, Calgary",
    condition: "Good",
    seller: "John Doe",
    postDate: "July 20 2025",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisque faucibus ex sapien vitae pellentesque enim placerat. In id cursus mi pretium tellus quis convallis. Tempus leo eu aenean sed diam urna tempor.",
  };
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [sellerContacted, setsellerContacted] = useState(false);

  return (
    <Stack
      direction="column"
      sx={(theme) => ({
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        justifyContent: "space-between",
      })}
    >
      {/* Header */}
      <Header />

      {/* Main content*/}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
        }}
      >
        {/* Back to Search */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            pt: 1.5,
            mb: 1,
            columnGap: 1,
          }}
        >
          <IconButton size="small">
            <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography variant="body2">Back to Search</Typography>
        </Box>

        {/* Image slider */}
        <Box sx={{ px: 2 }}>
          <ImageSlider />
        </Box>

        {/* Title and  price*/}
        <Box sx={{ px: 2, pt: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {listing.title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              columnGap: 1,
            }}
          >
            <Typography variant="h6" >
              {listing.price}
            </Typography>

            <IconButton size="small">
              <BookmarkBorderIcon />
            </IconButton>
          </Box>
        </Box>



        {/* Info rows */}
        <Box
          sx={{
            px: 2,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            rowGap: 0.25,                                                                                                                                                                                                        //                            🔥 super tight spacing between rows
          }}
        >
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Location
          </Typography>
          <Typography variant="body2" sx={{ textAlign: "right" }}>
            {listing.location}
          </Typography>

          {/* Underline */}
          <Box gridColumn="1 / -1" sx={{ borderBottom: "1px solid #E5E5E5", my: 0.4 }} />

          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Condition
          </Typography>
          <Typography variant="body2" sx={{ textAlign: "right" }}>
            {listing.condition}
          </Typography>

          {/* Underline */}
          <Box gridColumn="1 / -1" sx={{ borderBottom: "1px solid #E5E5E5", my: 0.4 }} />

          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Seller
          </Typography>
          <Typography variant="body2" sx={{ textAlign: "right" }}>
            {listing.seller}
          </Typography>
          {/* Underline */}
          <Box gridColumn="1 / -1" sx={{ borderBottom: "1px solid #E5E5E5", my: 0.4 }} />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Post Date
          </Typography>
          <Typography variant="body2" sx={{ textAlign: "right" }}>
            {listing.postDate}
          </Typography>
          <Box gridColumn="1 / -1" sx={{ borderBottom: "1px solid #E5E5E5", my: 0.4 }} />
        </Box>

        <Divider sx={{ mx: 2, my: 1.5, borderColor: "transparent", }} />

        {/* Description */}
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 500, mb: 0.5 }}
          >
            Description
          </Typography>
          <Box gridColumn="1 / -1" sx={{ borderBottom: "1px solid #E5E5E5", my: 0.4 }} />
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.5 }}
          >
            {listing.description}
          </Typography>
        </Box>
      </Box>


      <Box sx={{ px: 2, pb: 1.5 }}>
        {/* Contact Seller*/}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: 1,
            mb: 1.5,
          }}
        >
          {!sellerContacted ? (
            <CustomButton
              onClick={() => setsellerContacted(true)}   // ⬅️ change to sellerContacted
              sx={{
                width: { xs: "50%", sm: "55%", md: "30%" },
                borderRadius: "6px",
                textTransform: "none",
                fontSize: 15,
                fontWeight: 500,
                height: 35,
                py: 1,
              }}
            >
              Contact Seller
            </CustomButton>
          ) : (

            <CustomButton
              sx={{
                width: { xs: "50%", sm: "55%", md: "30%" },
                backgroundColor: "#F8E0DE",
                borderRadius: "6px",

                textTransform: "none",
                alignItems: "center",
                justifyContent: "center",
                color: "#1C2024",
                fontSize: 15,
                height: 35,
                py: 1,
              }}
            >
              sellerContacted
            </CustomButton>

          )}

          <IconButton
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "1px solid #E0E0E0",
              backgroundColor: "#FFFFFF",
              color: "#000000",
              padding: 0,
            }}
          >
            <InfoIcon size={16} />
          </IconButton>

        </Box>

        {/* Problem? Report Post or User */}
        <Box
          sx={{
            display: "flex",
            alignItems: "baseline",
          }}
        >
          <Typography variant="body2" sx={{ mr: 2 }}>
            Problem?
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "primary.main",
              fontWeight: 500,
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => setIsReportOpen(true)}
          >
            Report Post or User
          </Typography>

        </Box>
      </Box>
      <ReportIssueDialog
        open={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />

      {/* Bottom navigation bar */}
      <Navigation />
    </Stack>
  );
}                                                                                                                                                                                                                       
