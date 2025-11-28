//EventItemPage.jsx
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import Header from "../components/Header";
import MobileNav from "../components/MobileNav";
import ImageSlider from "../components/ImageSlider";
import ReportIssueDialog from "../components/ReportIssueDialog";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import InfoIcon from "../assets/InfoIcon";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CustomButton from "../components/CustomButton";

const API_BASE = "http://localhost:8080";

export default function EventItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventDetails, setEventDetails] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [contacted, setContacted] = useState(false)

  useEffect(() => {
    async function fetchEvent() {
      try {
        setIsLoading(true);

        const res = await fetch(`${API_BASE}/api/posts/eventdetails/${id}`);

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }

        const data = await res.json();

        const {
          title,
          location,
          description,
          posted_date,
          start_date,
          end_date,
          images: rawImages = [],
        } = data;

        setEventDetails({
          title,
          location,
          description,
          postedDate: posted_date
            ? dayjs(posted_date).format("MMM D YYYY")
            : "Unknown",

          startDate: start_date
            ? dayjs(start_date).format("MMM D YYYY")
            : "TBA",

          endDate: end_date
            ? dayjs(end_date).format("MMM D YYYY")
            : "TBA",
        });

        const formattedImages = rawImages.map((img, i) => ({
          id: img.image_id,
          src: `data:image/jpeg;base64,${img.data}`,
          label: `${title} - ${i + 1}`,
        }));

        setPhotos(formattedImages);
      } catch (err) {
        console.error("Error fetching event:", err.message || err);
        setEventDetails(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchEvent();
    }
  }, [id]);

  if (isLoading) {
    return (
      <Stack direction="column" sx={styles.container}>
        <Header />
        <Box sx={styles.center}>
          <Typography>Loading event...</Typography>
        </Box>
        <MobileNav />
      </Stack>
    );
  }

  if (!eventDetails) {
    return (
      <Stack direction="column" sx={styles.container}>
        <Header />
        <Box sx={styles.center}>
          <Typography color="error">Event not found.</Typography>
        </Box>
        <MobileNav />
      </Stack>
    );
  }

  const item = eventDetails;

  const infoItems = [
    { label: "Location", value: item.location },
    { label: "Start Date", value: item.startDate },
    { label: "End Date", value: item.endDate },
    { label: "Posted", value: item.postedDate },
  ];

  return (
    <Stack direction="column" sx={styles.container}>
      <Header />

      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {/* Back button */}
        <Box sx={{ ...styles.paddingX, ...styles.rowGap, pt: 1.5, mb: 1 }}>
          <IconButton size="small" onClick={() => navigate(-1)}>
            <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography variant="body2">Back to events</Typography>
        </Box>

        {/* Image slider */}
        <Box sx={styles.paddingX}>
          <ImageSlider images={photos} />
        </Box>

        {/* Title */}
        <Box sx={{ ...styles.paddingX, pt: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {item.title}
          </Typography>

          <IconButton size="small">
            <BookmarkBorderIcon />
          </IconButton>
        </Box>
        

        {/* Info section */}
        <Box sx={styles.infoSection}>
          {infoItems.map((info) => (
            <Box key={info.label}>
              <Box sx={styles.infoRow}>
                <Typography color="text.secondary">{info.label}</Typography>
                <Typography sx={styles.rightText}>{info.value}</Typography>
              </Box>
              <Box sx={styles.underline} />
            </Box>
          ))}
        </Box>

        <Divider sx={{ mx: 2, my: 1.5, borderColor: "transparent" }} />

        {/* Description */}
        <Box sx={{ ...styles.paddingX, pb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
            Description
          </Typography>

          <Box sx={styles.underline} />

          <Typography color="text.secondary" sx={{ lineHeight: 1.5 }}>
            {item.description}
          </Typography>
        </Box>
      </Box>
      {/* Contact Seller and Info Icon */}
<Box sx={{ ...styles.paddingX, pb: 1.5 }}>
  <Box sx={{ ...styles.rowGap, mb: 1.5 }}>

    {!contacted ? (
      <CustomButton
        sx={styles.contactButton}
        onClick={() => setContacted(true)}
      >
        Contact Seller
      </CustomButton>
    ) : (
      <CustomButton
        sx={{
          ...styles.contactButton,
          backgroundColor: "#F8E0DE",
          color: "#1C2024",
        }}
      >
        Contacted
      </CustomButton>
    )}

    <IconButton sx={styles.infoIcon}>
      <InfoIcon size={16} />
    </IconButton>
  </Box>
</Box>


      {/* Bottom actions */}
      <Box sx={{ ...styles.paddingX, pb: 1.5 }}>
        <Box sx={{ ...styles.row }}>
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

      <MobileNav />
    </Stack>
  );
}

const styles = {
  container: (theme) => ({
    minHeight: "100vh",
    bgcolor: theme.palette.background.default,
    justifyContent: "space-between",
  }),

  center: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  underline: {
    borderBottom: "1px solid #E5E5E5",
    my: 0.4,
  },

  paddingX: { px: 2 },

  row: {
    display: "flex",
    alignItems: "center",
  },

  rowGap: {
    display: "flex",
    alignItems: "center",
    columnGap: 1,
  },

  infoSection: {
    px: 2,
    mt: 1,
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rightText: {
    textAlign: "right",
    color: "#1C2024",
  },
  contactButton: {
  width: { xs: "50%", sm: "55%", md: "30%" },
  borderRadius: "6px",
  textTransform: "none",
  fontSize: 15,
  height: 35,
  py: 1,
},

infoIcon: {
  width: 28,
  height: 28,
  borderRadius: "50%",
  border: "1px solid #E0E0E0",
  backgroundColor: "#FFFFFF",
  color: "#000000",
  padding: 0,
},

};
