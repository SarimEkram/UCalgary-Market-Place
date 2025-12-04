// MarketItemPage.jsx
import {
  Box,
  Container,
  Stack,
  Typography,
  IconButton,
  Divider,
  Tooltip
} from "@mui/material";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";


import InfoIcon from "../assets/InfoIcon";
import ImageSlider from "../components/ImageSlider";
import ReportIssueDialog from "../components/ReportIssueDialog";
import Header from "../components/Header";
import MobileNav from "../components/MobileNav";
import DesktopNav from "../components/DesktopNav";
import CustomButton from "../components/CustomButton";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";


const CONTACT_COOLDOWN_KEY = (userId, postId) =>
  `contact-${userId}-${postId}`;

export default function MarketItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = id ? Number(id) : null;

  const [listingDetails, setListing] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReportOpen, setIsReportOpen] = useState(false);

  //Contact Seller State
  const [contactedSeller, setSellerContacted] = useState(false);
  const [isContactingSeller, setIsContactingSeller] = useState(false);
  const [contactSellerMsg, setContactSellerMsg] = useState("");
  const [cooldownRemaining, setCooldownRemaining] = useState(null);
  const [cooldownUntil, setCooldownUntil] = useState(null);
  const [cooldownMsg, setCooldownMsg] = useState("");

  // Saved posts state
  const [isPostSaved, setIsPostSaved] = useState(false);
  const [isPostSaving, setIsPostSaving] = useState(false);

  // Report state
  const [isReporting, setIsReporting] = useState(false);
  const [reportMessage, setReportMessage] = useState("");

  // Get userId of logged in user from localStorage
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
      setCooldownMsg("");
      setSellerContacted(false);
      setContactSellerMsg("");
      return;
    }

    const now = Date.now();
    const timeDiff = until - now;

    // Check if cooldown expired
    if (timeDiff <= 0) {
      setCooldownUntil(null);
      setCooldownRemaining(null);
      setCooldownMsg("");
      setSellerContacted(false);
      return;
    }

    // Hours
    const ceil_hours = Math.ceil(timeDiff / (1000 * 60 * 60));

    // hours, mins and secs
    let remainingSec = Math.floor(timeDiff / 1000);
    const hours = Math.floor(remainingSec / 3600);
    remainingSec %= 3600;
    const mins = Math.floor(remainingSec / 60);
    const sec = remainingSec % 60;

    const text = hours > 0 ? `${hours}h ${mins}m ${sec}s` : mins > 0 ? `${mins}m ${sec}s` : `${sec}s`;

    setCooldownUntil(until);
    setCooldownRemaining(ceil_hours);
    setCooldownMsg(text);
    setSellerContacted(true);
  };

  // Fetch market listing details
  useEffect(() => {
    async function fetchMarketListing() {
      if (!postId) return;
      try {
        setIsLoading(true);

        const response = await fetch(
          `http://localhost:8080/api/posts/itemdetails/${postId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }

        const data = await response.json();

        const {
          title,
          price,
          postal_code,
          item_condition,
          seller_fname,
          seller_lname,
          seller_id,
          posted_date,
          description,
          images: rawImages = [],
        } = data;

        setListing({
          title,
          price,
          location: postal_code,
          condition: item_condition,
          seller: `${seller_fname} ${seller_lname}`,
          sellerId: seller_id ?? null,
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
        console.error("There is an error fetching listing:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMarketListing();
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

      const now = Date.now();
      const timeDiff = storedUntil - now;

      if (timeDiff <= 0) {
        localStorage.removeItem(key);
        calculateCooldown(null);
        return;
      }
      calculateCooldown(storedUntil);
      setContactSellerMsg("You already contacted this seller.");
    } catch (e) {
      console.error("Cooldown restore error:", e);
    }
  }, [userId, postId]);

  // Tick timer for every 1 second
  useEffect(() => {
    if (!cooldownUntil) return;

    calculateCooldown(cooldownUntil);

    const id = setInterval(() => {
      calculateCooldown(cooldownUntil);
    }, 1000);

    return () => clearInterval(id);
  }, [cooldownUntil]);

  // Check if post is saved
  useEffect(() => {
    async function checkIfPostSaved() {
      if (!userId || !postId) return;

      try {
        const resp = await fetch(`http://localhost:8080/api/getSavedPosts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!resp.ok) return;

        const data = await resp.json();
        const saved = data.savedPosts || [];
        setIsPostSaved(saved.some((p) => String(p.post_id) === String(postId)));
      } catch (err) {
        console.error("There was a failure to check saved posts:", err);
      }
    }

    checkIfPostSaved();
  }, [userId, postId]);

  const handleSaveButtonClick = async () => {
    if (!userId) {
      alert("Please log in to save posts.");
      return;
    }

    if (!postId || isPostSaving) return;

    try {
      setIsPostSaving(true);

      const url = isPostSaved
        ? `http://localhost:8080/api/getSavedPosts/unsave`
        : `http://localhost:8080/api/getSavedPosts/save`;

      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, postId }),
      });

      if (!resp.ok) return;

      setIsPostSaved((prev) => !prev);
    } catch (err) {
      console.error("Save/unsave error:", err);
    } finally {
      setIsPostSaving(false);
    }
  };

  // Contact Seller with cooldown
  const handleContactSellerClick = async () => {
    if (!userId) {
      setContactSellerMsg("User should be logged in to contact the seller.");
      return;
    }

    if (!postId) {
      setContactSellerMsg("Something went wrong.");
      return;
    }

    if (isContactingSeller) return;

    try {
      setIsContactingSeller(true);
      setContactSellerMsg("");

      const resp = await fetch(`http://localhost:8080/api/contactSeller`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: userId,
          postId,
        }),
      });

      const text = await resp.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch { }

      const key = CONTACT_COOLDOWN_KEY(userId, postId);
      const now = Date.now();
      const HOUR_MS = 1000 * 60 * 60;

      // Start 24 hours cooldown after contacting seller
      if (resp.status === 201 && data?.success) {
        console.log("SUCCESS: Seller has been contacted", data);
        const until = now + 24 * HOUR_MS;
        localStorage.setItem(key, JSON.stringify({ cooldownUntil: until }));
        calculateCooldown(until);
        setContactSellerMsg("The seller has been emailed.Thanks for contacting.");
        return;
      }

      // Cooldown Active
      if (resp.status === 429) {
        const rem = data?.cooldownRemaining ?? 24;
        const until = now + rem * HOUR_MS;
        localStorage.setItem(key, JSON.stringify({ cooldownUntil: until }));
        calculateCooldown(until);
        setContactSellerMsg(data?.error || "Cooldown active.");
        return;
      }

      if (!resp.ok) {
        setContactSellerMsg(
          data?.error || "Failure to contact seller. Try again."
        );
      }
    } catch (err) {
      console.error("Contact seller error:", err);
      setContactSellerMsg("Network error.");
    } finally {
      setIsContactingSeller(false);
    }
  };

  // Report submit handler
  const handleSubmitReport = async ({ reportType, reason }) => {
    if (!userId) {
      setReportMessage("Please log in to submit a report.");
      console.log("User not logged in. Failure to report");
      return;
    }

    const type =
      reportType === "user" || reportType === "post" ? reportType : "post";

    const currentItem = listingDetails;

    try {
      setIsReporting(true);
      setReportMessage("");

      let body = {
        reporterId: userId,
        reportType: type,
        reason,
      };

      if (type === "post") body.postId = postId;
      if (type === "user") body.reportedUserId = currentItem?.sellerId;

      const resp = await fetch(`http://localhost:8080/api/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        console.error("Report submission failed:", resp.status);
        setReportMessage("Failed to submit report.");
        return;
      }
      console.log("Report has been submitted successfully.");
      setReportMessage("Report submitted successfully.");
      setIsReportOpen(false);
    } catch (err) {
      console.error("Report error:", err);
      setReportMessage("Error submitting report.");
    } finally {
      setIsReporting(false);
    }
  };

  // Display posts
  const item = listingDetails;

  let priceDisplay = item?.price != null ? `$${item.price}` : "Free";

  const infoItems = item
    ? [
      { label: "Location", value: item.location },
      { label: "Condition", value: item.condition },
      { label: "Seller", value: item.seller },
      { label: "Post Date", value: item.postDate },
    ]
    : [];


  let contactButtonElement;

  if (cooldownRemaining !== null) {
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
  } else if (contactedSeller) {
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
        disabled={isContactingSeller}
      >
        {isContactingSeller ? "Contacting..." : "Contact Seller"}
      </CustomButton>
    );
  }

  return (
    <Stack
      direction="row"
      sx={{ bgcolor: "background.paper", minHeight: "100vh" }}
    >
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <DesktopNav />
      </Box>

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
              <Typography>Loading market listing...</Typography>
            </Box>
          )}

          {!isLoading && !listingDetails && (
            <Box sx={styles.center}>
              <Typography color="error">Market listing not found.</Typography>
            </Box>
          )}

          {!isLoading && listingDetails && (
            <>
              <Box sx={{ ...styles.rowGap, pt: 1, mb: 1.5 }}>
                <IconButton size="small" onClick={() => navigate(-1)}>
                  <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <Typography variant="body2">Back</Typography>
              </Box>

              <Box>
                <ImageSlider images={photos} />
              </Box>

              <Box sx={{ pt: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {item.title}
                </Typography>

                <Box sx={styles.rowGap}>
                  <Typography variant="h6">{priceDisplay}</Typography>

                  <IconButton
                    size="small"
                    onClick={handleSaveButtonClick}
                    disabled={isPostSaving}
                  >
                    {isPostSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                  </IconButton>
                </Box>
              </Box>

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

              <Box sx={{ pb: 1.5 }}>
                <Box sx={{ ...styles.rowGap, mb: 1 }}>
                  {contactButtonElement}

                  <Tooltip
                    arrow
                    placement="top"
                    title="Clicking contact seller button will send an email to the seller with your contact info."
                    slotProps={{
                      tooltip: {
                        sx: {
                          border: "1px solid #d2cacaff",
                          bgcolor: "white",
                          color: "black",
                          fontSize: "14px",
                          lineHeight: "1.8",
                          padding: "14px 14px",

                        },
                      },
                      arrow: {
                        sx: {
                          "&:before": {
                            border: "1px solid #d2cacaff",
                            boxSizing: "border-box",
                            backgroundColor: "white",
                          },
                        },
                      },
                    }}
                  >
                    <IconButton sx={styles.infoIcon}>
                      <InfoIcon size={16} />
                    </IconButton>
                  </Tooltip>
                </Box>

                {contactSellerMsg && (
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, color: "text.secondary", fontSize: 13 }}
                  >
                    {contactSellerMsg}
                  </Typography>
                )}

                {cooldownRemaining !== null && cooldownMsg && (
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      color: "black",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    You can contact this seller again in {cooldownMsg}.
                  </Typography>
                )}

                {reportMessage && (
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, color: "text.secondary", fontSize: 13 }}
                  >
                    {reportMessage}
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
