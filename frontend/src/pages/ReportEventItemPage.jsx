// EventItemPage.jsx
import {
  Box,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
  Link,
  Button
} from "@mui/material";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router";
import { Link as RouterLink } from "react-router";

import DesktopNav from "../components/DesktopNav";
import Header from "../components/Header";
import ImageSlider from "../components/ImageSlider";
import MobileNav from "../components/MobileNav";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ConfirmationPopup from "../components/ConfirmationPopup.jsx";
import CustomButton from "../components/CustomButton.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";

export default function EventItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = id ? Number(id) : null;

  const [eventDetails, setEvent] = useState(null);
  const [photos, setPics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userID, setUserID] = useState(() => {
    return JSON.parse(localStorage.getItem("user")).id;
  });

  //Delete post with popup  functions and state variables
  const confirmedDelete = async () => {
    const response = await fetch(`/api/admin/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ adminId: userID }),
    });
    return response;
  };

  const [open, setOpen] = useState(false);

  const onDelete = () => {
    setOpen(true);
  };

  const callBackDelete = (ok) => {
    if (ok) {
      // re-direct to previous page
      navigate(-1);
    }
  };

  // Fetch event details
  useEffect(() => {
    async function fetchEvent() {
      if (!postId) return;
      try {
        setIsLoading(true);

        const response = await fetch(`/api/posts/reported-eventdetails/${postId}`);

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();

        const {
          title,
          location,
          description,
          posted_date,
          start_date,
          end_date,
          organizer_fname,
          organizer_lname,
          organizer_id,
          organization_name,
          report_category,
          price,
          images: rawImages = [],
        } = data;

        setEvent({
          title,
          location,
          description,
          price,
          seller: `${organizer_fname} ${organizer_lname}`,
          postedDate: posted_date
            ? dayjs(posted_date).format("MMM D YYYY")
            : "Unknown",
          startDate: start_date
            ? dayjs(start_date).format("MMM D YYYY")
            : "TBA",
          endDate: end_date ? dayjs(end_date).format("MMM D YYYY") : "TBA",
          organizer:
            organization_name ||
            (seller_fname && seller_lname
              ? `${seller_fname} ${seller_lname}`
              : null),
          sellerId: organizer_id ?? null,

          reportCategory: report_category,
        });

        const images = rawImages.map((img, i) => ({
          id: img.image_id,
          src: `data:image/jpeg;base64,${img.data}`,
          label: `${title} - ${i + 1}`,
        }));

        setPics(images);
      } catch (err) {
        console.error("There was an error fetching event:", err.message || err);
        setEvent(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvent();
  }, [postId]);

  const item = eventDetails;

  let priceDisplay = item?.price != null ? `$${item.price}` : "Free";

  const infoItems = [
    { label: "Location", value: item?.location },
    { label: "Start Date", value: item?.startDate },
    { label: "End Date", value: item?.endDate },
    { label: "Posted", value: item?.postedDate },
    { label: "Organizer Name", value: item?.seller },
    ...(item?.organizer ? [{ label: "Organizer", value: item.organizer }] : []),
  ];

  return (
    <Stack
      direction="row"
      sx={{ bgcolor: "background.paper", minHeight: "100vh" }}
    >
      {/* desktop nav */}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <DesktopNav />
      </Box>

      {/* Main content */}
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
            gap: 2,
            mb: { xs: 10, md: 4 },
          }}
        >
          {isLoading && (
            <Box sx={styles.center}>
              <Typography>Loading event...</Typography>
            </Box>
          )}

          {!isLoading && !eventDetails && (
            <Box sx={styles.center}>
              <Typography color="error">Event not found.</Typography>
            </Box>
          )}

          {!isLoading && eventDetails && (
            <>
              {/* Confirm delete popup */}
              <ConfirmationPopup
                warningMessage={
                  <div>
                    <div>
                      Do You Want To Proceed With Deleting The Post Named:
                    </div>
                    <div>{item.title} ?</div>
                  </div>
                }
                open={open}
                handleClose={() => {
                  setOpen(false);
                }}
                executeFunction={confirmedDelete}
                callBack={callBackDelete}
              ></ConfirmationPopup>

              {/* Back Arrow */}
               <Box sx={{ pt: 1, mb: 1 }}>
                <Button
                color="text.primary"
                  onClick={() => navigate(-1)}
                  sx={(theme) => ({
                    display: "flex",
                    columnGap: 2,
                    padding: 0,
                    margin: 0,
                    "&.MuiButton-root": {
                      textTransform: "none", // Overrides text transformation
                    },
                    "&.MuiButtonBase-root": {
                      textTransform: "none", // Overrides text transformation
                    },
                   ...styles.rowGap,
                  })}
                >
                  <ArrowBackIosNewIcon  sx={{ color: "#0000008a", fontSize: 18 }} />
                  <Typography variant="body2">Back</Typography>
                </Button>
              </Box>

              {/* Images */}
              <Box>
                <ImageSlider images={photos} />
              </Box>

              {/* Title and save button */}
              <Box sx={{ pt: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {item.title}
                </Typography>

                <Box sx={styles.rowGap}>
                  <Typography variant="h6">{priceDisplay}</Typography>
                </Box>
              </Box>

              {/* Info section */}
              <Box sx={styles.infoSection}>
                {infoItems.map((info) =>
                  info.label == "Organizer Name" ? (
                    <Box key={info.label}>
                      <Box sx={styles.infoRow}>
                        <Typography color="text.secondary">
                          {info.label}
                        </Typography>
                        <RouterLink to={`/admin/profile/user/${item.sellerId}`}>
                          <Link
                            component="div"
                            sx={{
                              "& .MuiTypography-root": {
                                textDecoration: "underline",
                              },
                              "& .MuiLink-root": {
                                textDecoration: "underline",
                              },
                            }}
                            color="primary"
                          >
                            <Typography
                              sx={[styles.rightText, { color: "inherit" }]}
                            >
                              {info.value}
                            </Typography>
                          </Link>
                        </RouterLink>
                      </Box>
                      <Box sx={styles.underline} />
                    </Box>
                  ) : (
                    <Box key={info.label}>
                      <Box sx={styles.infoRow}>
                        <Typography color="text.secondary">
                          {info.label}
                        </Typography>
                        <Typography sx={styles.rightText}>
                          {info.value}
                        </Typography>
                      </Box>
                      <Box sx={styles.underline} />
                    </Box>
                  )
                )}
              </Box>

              <Divider sx={{ my: 1.5, borderColor: "transparent" }} />

              {/* Description */}
              <Box sx={{ pb: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 500, mb: 0.5 }}
                >
                  Description
                </Typography>

                <Box sx={styles.underline} />

                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  {item.description}
                </Typography>
              </Box>
              {/* Admin Delete button, and report information  */}
              <Stack
                direction="row"
                sx={{ justifyContent: "flex-start", columnGap: 4 }}
              >
                <CustomButton onClick={onDelete}>Delete</CustomButton>
                <Box>
                  <Typography
                    sx={(theme) => ({
                      borderRadius: 1,
                      backgroundColor: item.reportCategory
                        ? theme.palette.dullPrimary
                        : theme.palette.grey[300],
                      padding: 1,
                      textTransform:"capitalize"
                    })}
                    color="text.primary"
                    variant={"body1"}
                  >
                    Report Category: {item.reportCategory ?? "Not Reported"}
                  </Typography>
                </Box>
              </Stack>
            </>
          )}
        </Container>
      </Box>

      {/* Mobile nav */}
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <MobileNav />
      </Box>
    </Stack>
  );
}

const styles = {
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
    backgroundColor: "#FFFFFF",
    color: "#000000",
    padding: 0,
  },
};
