// MarketItemPage.jsx
import {
  Box,
  Container,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CustomButton from "../components/CustomButton";
import DesktopNav from "../components/DesktopNav";
import Header from "../components/Header";
import ImageSlider from "../components/ImageSlider";
import MobileNav from "../components/MobileNav";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

import { Link as RouterLink } from "react-router";
import ConfirmationPopup from "../components/ConfirmationPopup";

export default function ReportedMarketItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = id ? Number(id) : null;

  const [listingDetails, setListing] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userID, setUserID] = useState(() => {
    return JSON.parse(localStorage.getItem("user")).id;
  });

  //Delete post with popup  functions and state variables
  const confirmedDelete = async () => {
                    // CHANGE THE ROUTE !!!
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

  // Fetch market listing details
  useEffect(() => {
    async function fetchMarketListing() {
      if (!postId) return;
      try {
        setIsLoading(true);

        const response = await fetch(`/api/posts/itemdetails/${postId}`);

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
          report_category,
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
          reportCategory : report_category
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

          <ConfirmationPopup
            warningMessage={
             ( <div>
                <div>Do You Want To Proceed With Deleting The Post Named:</div>
                <div>{item.title} ?</div>
              </div>)
            }
            open={open}
            handleClose={() => {
              setOpen(false);
            }}
            executeFunction={confirmedDelete}
            callBack={callBackDelete}
          ></ConfirmationPopup>

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

                  <IconButton size="small" disabled={true}>
                    <BookmarkBorderIcon></BookmarkBorderIcon>
                  </IconButton>
                </Box>
              </Box>

              {/* info section */}
              <Box sx={styles.infoSection}>
                {infoItems.map((info) =>
                  info == "Seller" ? (
                    <Box key={info.label}>
                      <Box sx={styles.infoRow}>
                        <Typography color="text.secondary">
                          {info.label}
                        </Typography>
                        <Typography sx={styles.rightText}>
                          <RouterLink
                            to={`/admin/profile/user/${item.sellerId}`}
                          >
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
                            ></Link>
                          </RouterLink>
                          {info.value}
                        </Typography>
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
                    })}
                    color="text.primary"
                    variant={"body1"}
                  >
                    Report Category:{" "}
                    {item.reportCategory ?? "Not Reported"}
                  </Typography>
                </Box>
              </Stack>
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
