
// EventItemPage.jsx
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Divider,
  Container,
} from "@mui/material";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import Header from "../components/Header";
import MobileNav from "../components/MobileNav";
import ImageSlider from "../components/ImageSlider";
import ReportIssueDialog from "../components/ReportIssueDialog";
import CustomButton from "../components/CustomButton";
import DesktopNav from "../components/DesktopNav";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import InfoIcon from "../assets/InfoIcon";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";


// LocalStorage key for cooldown 
const CONTACT_COOLDOWN_KEY = (userId, postId) =>
  `contact-cooldown-${userId}-${postId}`;

export default function EventItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = id ? Number(id) : null;

  const [eventDetails, setEvent] = useState(null);
  const [photos, setPics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Contact and cooldown states
  const [contacted, setContacted] = useState(false);
  const [isContacting, setIsContacting] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [remCooldown, setCooldownRemaining] = useState(null); 
  const [cooldownUntil, setCooldownUntil] = useState(null); 
  const [cooldownText, setCooldownText] = useState("");

  // Saved event posts
  const [isSavedEvent, setIsSavedEvent] = useState(false);
  const [isSavingEvent, setIsSavingEvent] = useState(false);

  // Report state
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportMessage, setReportMessage] = useState("");

  // Logged-in user to get the user Id
  let userId = null;
  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    userId = storedUser?.user_id ?? storedUser?.id ?? null;
  } catch {
    userId = null;
  }

  // Calculate cooldown
  const calculateCooldown = (until) => {
    if (!until) {
      setCooldownUntil(null);
      setCooldownRemaining(null);
      setCooldownText("");
      setContacted(false);
      return;
    }

    const now = Date.now();
    const timeDiff = until - now;

    if (timeDiff <= 0) {
      setCooldownUntil(null);
      setCooldownRemaining(null);
      setCooldownText("");
      setContacted(false);
      return;
    }

    const ceil_hours = Math.ceil(timeDiff / (1000 * 60 * 60));

    let remainingSec = Math.floor(timeDiff / 1000);
    const hours = Math.floor(remainingSec / 3600);
    remainingSec %= 3600;

    const mins = Math.floor(remainingSec / 60);
    const sec = remainingSec % 60;

    const text =
      hours > 0
        ? `${hours}h ${mins}m ${sec}s`
        : mins > 0
        ? `${mins}m ${sec}s`
        : `${sec}s`;

    setCooldownUntil(until);
    setCooldownRemaining(ceil_hours);
    setCooldownText(text);
    setContacted(true);
  };

  // Fetch event details
  useEffect(() => {
    async function fetchEvent() {
      if (!postId) return;
      try {
        setIsLoading(true);

        const response = await fetch(
          `http://localhost:8080/api/posts/eventdetails/${postId}`
        );

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
          seller_fname,
          seller_lname,
          seller_id,
          organization_name,
          images: rawImages = [],
        } = data;

        setEvent({
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
          organizer:
            organization_name ||
            (seller_fname && seller_lname
              ? `${seller_fname} ${seller_lname}`
              : null),
          sellerId: seller_id ?? null,
        });

        const images = rawImages.map((img, i) => ({
          id: img.image_id,
          src: `data:image/jpeg;base64,${img.data}`,
          label: `${title} - ${i + 1}`,
        }));

        setPics(images);
      } catch (err) {
        console.error(
          "There was an error fetching event:",
          err.message || err
        );
        setEvent(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvent();
  }, [postId]);

  // Restore cooldown
  useEffect(() => {
    if (!userId || !postId) return;

    const key = CONTACT_COOLDOWN_KEY(userId, postId);
    const raw = localStorage.getItem(key);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      const { cooldownUntil: storedUntil } = parsed || {};
      if (!storedUntil) return;

      calculateCooldown(storedUntil);
      setContactMessage("You already contacted this seller.");
    } catch (e) {
      console.error("There was an error restoring cooldown:", e);
    }
  }, [userId, postId]);

  // Countdown
  useEffect(() => {
    if (!cooldownUntil) return;

    calculateCooldown(cooldownUntil);

    const id = setInterval(() => {
      calculateCooldown(cooldownUntil);
    }, 1000);

    return () => clearInterval(id);
  }, [cooldownUntil]);

  // Check if this event post is saved
  useEffect(() => {
    async function checkIfPostSaved() {
      if (!userId || !postId) return;

      try {
        const response = await fetch(`http://localhost:8080/api/getSavedPosts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) return;

        const data = await response.json();
        const saved = data.savedPosts || [];
        const found = saved.some(
          (p) => String(p.post_id) === String(postId)
        );
        setIsSavedEvent(found);
      } catch (err) {
        console.error("There was a failure to check saved posts:", err);
      }
    }

    checkIfPostSaved();
  }, [userId, postId]);

  // Save or  unsave event post
  const handleSaveButtonClick = async () => {
    if (!userId) {
      alert("You need to log in to save events.");
      return;
    }

    if (!postId || isSavingEvent) return;

    try {
      setIsSavingEvent(true);

      const url = isSavedEvent
        ? `http://localhost:8080/api/getSavedPosts/unsave`
        : `http://localhost:8080/api/getSavedPosts/save`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          postId,
        }),
      });

      if (!response.ok) {
        console.error("Failed to save or unsave event:", response.status);
        return;
      }

      setIsSavedEvent((prev) => !prev);
    } catch (err) {
      console.error("Error saving or unsaving event:", err);
    } finally {
      setIsSavingEvent(false);
    }
  };

  // Contact seller 
  const handleContactSellerClick = async () => {
    if (!userId) {
      setContactMessage("Please log in to contact the seller.");
      return;
    }

    if (!postId) {
      setContactMessage("There is something wrong with this event.");
      return;
    }

    if (isContacting) return;

    try {
      setIsContacting(true);
      setContactMessage("");

      const response = await fetch(`http://localhost:8080/api/contactSeller`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: userId,
          postId,
        }),
      });

      const text = await response.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch {
        // ignore JSON parse error
      }

      const key = CONTACT_COOLDOWN_KEY(userId, postId);
      const now = Date.now();
      const HOUR_MS = 1000 * 60 * 60;

      // Start 24 hour cooldown when success
      if (response.status === 201 && data?.success) {
        const until = now + 24 * HOUR_MS;
        localStorage.setItem(key, JSON.stringify({ cooldownUntil: until }));
        calculateCooldown(until);
        setContactMessage(
          "The seller has been emailed. Thank you for contacting!"
        );
        return;
      }

      // When cooldown is active
      if (response.status === 429) {
        const rem = data?.remCooldown ?? 24;
        const until = now + rem * HOUR_MS;
        localStorage.setItem(key, JSON.stringify({ cooldownUntil: until }));
        calculateCooldown(until);
        setContactMessage(
          data?.error || "You already contacted this seller."
        );
        return;
      }

        if (!response.ok) {
        setContactMessage(
          data?.error || "Failed to contact seller. Please try again."
        );
        return;
      }
    } catch (err) {
      console.error("There was an error contacting seller:", err);
      setContactMessage("Network error. Please try again.");
    } finally {
      setIsContacting(false);
    }
  };

  const handleSubmitReport = async ({ reportType, reason }) => {
  if (!userId) {
    setReportMessage("Please log in to submit a report.");
    console.log("User not logged in. Failure to report");
    return;
  }

  const type =
    reportType === "user" || reportType === "post" ? reportType : "post";

  const currentItem = eventDetails;

  try {
    setIsReporting(true);
    setReportMessage("");

    let body = {
      reporterId: userId,
      reportType: type,
      reason,
      postId,        
    };

    if (type === "user" && currentItem?.sellerId) {
      body.reportedUserId = currentItem.sellerId;
    }

    const response = await fetch(`http://localhost:8080/api/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      // ignore parse error
    }

    if (!response.ok) {
      console.error("Report submission failed (event):", response.status, data);
      setReportMessage(
        (data && (data.error || data.message)) ||
          "Failed to submit report."
      );
      return;
    }

    console.log("Report has been submitted successfully (event).");
    setReportMessage(
      "Your report has been submitted. Thank you for letting us know."
    );
    setIsReportOpen(false);
  } catch (err) {
    console.error("Report error (event):", err);
    setReportMessage("Error submitting report.");
  } finally {
    setIsReporting(false);
  }
};


  const item = eventDetails;

  const infoItems = [
    { label: "Location", value: item?.location },
    { label: "Start Date", value: item?.startDate },
    { label: "End Date", value: item?.endDate },
    { label: "Posted", value: item?.postedDate },
    ...(item?.organizer
      ? [{ label: "Organizer", value: item.organizer }]
      : []),
  ];

  let contactButtonElement;

  if (remCooldown !== null) {
    contactButtonElement = (
      <CustomButton
        sx={{
          ...styles.contactButton,
          backgroundColor: "#F8E0DE",
          color: "#08090aff",
        }}
        disabled
      >
        Contacted
      </CustomButton>
    );
  } else if (contacted) {
    contactButtonElement = (
      <CustomButton
        sx={{
          ...styles.contactButton,
          backgroundColor: "#F8E0DE",
          color: "#1C2024",
        }}
        disabled
      >
        Contacted
      </CustomButton>
    );
  } else {
    contactButtonElement = (
      <CustomButton
        sx={styles.contactButton}
        onClick={handleContactSellerClick}
        disabled={isContacting}
      >
        {isContacting ? "Contacting..." : "Contact Seller"}
      </CustomButton>
    );
  }

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
              {/* Back Arrow */}
              <Box sx={{ ...styles.rowGap, pt: 1, mb: 1.5 }}>
                <IconButton size="small" onClick={() => navigate(-1)}>
                  <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <Typography variant="body2">Back to events</Typography>
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
                  <IconButton
                    size="small"
                    onClick={handleSaveButtonClick}
                    disabled={isSavingEvent}
                    aria-label={isSavedEvent ? "Unsave event" : "Save event"}
                  >
                    {isSavedEvent ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  </IconButton>
                </Box>
              </Box>

              {/* Info section */}
              <Box sx={styles.infoSection}>
                {infoItems.map((info) => (
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
                ))}
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

              {/* Contact and report  */}
              <Box sx={{ pb: 1.5 }}>
                <Box sx={{ ...styles.rowGap, mb: 1 }}>
                  {contactButtonElement}

                  <IconButton sx={styles.infoIcon}>
                    <InfoIcon size={16} />
                  </IconButton>
                </Box>

                {contactMessage && (
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, color: "text.secondary", fontSize: 13 }}
                  >
                    {contactMessage}
                  </Typography>
                )}

                {remCooldown !== null && cooldownText && (
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      color: "black",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    You can contact this seller again in {cooldownText}.
                  </Typography>
                )}

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

                {reportMessage && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 2, color: "black", fontSize: 13 }}
                  >
                    {reportMessage}
                  </Typography>
                )}

                <ReportIssueDialog
                  open={isReportOpen}
                  onClose={() => setIsReportOpen(false)}
                  onSubmit={handleSubmitReport}
                  loading={isReporting}
                />
              </Box>
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
