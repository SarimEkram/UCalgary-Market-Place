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
import InfoIcon from "../assets/InfoIcon";
import ImageSlider from "../components/ImageSlider";
import ReportIssueDialog from "../components/ReportIssueDialog";
import Header from "../components/Header";
import MobileNav from "../components/MobileNav";
import CustomButton from "../components/CustomButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

const API_BASE = "http://localhost:8080";

export default function MarketItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listingDetails, listing] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [contacted, setContacted] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      try {
        setIsLoading(true);

        const response = await fetch(`${API_BASE}/api/posts/itemdetails/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const {
          title,
          price,
          postal_code,
          item_condition,
          seller_fname,
          seller_lname,
          posted_date,
          description,
          images: rawImages = [],
        } = data;

        listing({
          title,
          price,
          location: postal_code,
          condition: item_condition,
          seller: `${seller_fname} ${seller_lname}`,
          postDate: posted_date
            ? dayjs(posted_date).format("MMM D YYYY")
            : "Unknown",
          description,
        });

        setPhotos(
          rawImages.map((img, i) => ({
            id: img.image_id,
            src: `data:image/jpeg;base64,${img.data}`,
            label: `${title} - ${i + 1}`,
          }))
        );
      } catch (error) {
        console.error(
          "An error occurred while fetching the listing:",
          error && error.message ? error.message : error
        );
        return;
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchListing();
    }
  }, [id]);

  if (isLoading) {
    return (
      <Stack direction="column" sx={styles.container}>
        <Header />

        <Box sx={styles.center}>
          <Typography>Loading market listing...</Typography>
        </Box>

        <MobileNav />
      </Stack>
    );
  }

  if (!listingDetails) {
    return (
      <Stack direction="column" sx={styles.container}>
        <Header />

        <Box sx={styles.center}>
          <Typography color="error">Market listing not found.</Typography>
        </Box>

        <MobileNav />
      </Stack>
    );
  }

  const item = listingDetails;

  let priceDisplay = "";
  if (item.price != null) {
    priceDisplay = `$${item.price}`;
  } else {
    priceDisplay = "Free";
  }

  let contactButtonElement;
  if (!contacted) {
    contactButtonElement = (
      <CustomButton
        sx={styles.contactButton}
        onClick={() => setContacted(true)}
      >
        Contact Seller
      </CustomButton>
    );
  } else {
    contactButtonElement = (
      <CustomButton
        sx={{
          ...styles.contactButton,
          backgroundColor: "#F8E0DE",
          color: "#1C2024",
        }}
      >
        Contacted
      </CustomButton>
    );
  }

  const infoItems = [
    { label: "Location", value: item.location },
    { label: "Condition", value: item.condition },
    { label: "Seller", value: item.seller },
    { label: "Post Date", value: item.postDate },
  ];

  return (
    <Stack direction="column" sx={styles.container}>
      <Header />

      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <Box sx={{ ...styles.paddingX, ...styles.rowGap, pt: 1.5, mb: 1 }}>
          <IconButton size="small" onClick={() => navigate(-1)}>
            <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography variant="body2">Back to search</Typography>
        </Box>

        <Box sx={styles.paddingX}>
          <ImageSlider images={photos} />
        </Box>

        <Box sx={{ ...styles.paddingX, pt: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {item.title}
          </Typography>

          <Box sx={styles.rowGap}>
            <Typography variant="h6">{priceDisplay}</Typography>

            <IconButton size="small">
              <BookmarkBorderIcon />
            </IconButton>
          </Box>
        </Box>

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

      <Box sx={{ ...styles.paddingX, pb: 1.5 }}>
        <Box sx={{ ...styles.rowGap, mb: 1.5 }}>
          {contactButtonElement}

          <IconButton sx={styles.infoIcon}>
            <InfoIcon size={16} />
          </IconButton>
        </Box>

        <Box sx={styles.row}>
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
