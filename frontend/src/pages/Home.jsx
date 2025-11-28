// Home.jsx
import { Box, Container, Stack, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import MobileNav from "../components/MobileNav";
import DesktopNav from "../components/DesktopNav";

export default function Home() {
  //id = home
  return (
    <Stack
      direction="row"
      sx={{ bgcolor: "background.paper", minHeight: "100vh" }}
    >
      <DesktopNav></DesktopNav>
      <Box sx={{ flex: "1", m: 0 }}>
        <Header></Header>
        <Container
          maxWidth="lg"
          sx={{
            flexGrow: 1,
            py: { xs: 2, md: 4 },
            px: { xs: 2, sm: 3, md: 6 },
            display: "flex",
            flexDirection: "column",
            gap: { xs: 3, md: 4 },
            mb: 20,
          }}
        >
          {/* HERO CARD */}
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: "0px 8px 24px rgba(0,0,0,0.08)",
              p: { xs: 2, sm: 3, md: 4 },
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }} // column on mobile, row on desktop
              spacing={{ xs: 2, md: 3 }}
              alignItems="center"
              justifyContent="space-between"
            >
              {/* TEXT */}
              <Box sx={{ flex: 1, pr: { md: 3 } }}>
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1.3rem", sm: "1.5rem", md: "2rem" },
                    lineHeight: 1.25,
                  }}
                >
                  Student marketplace – your place for everything you need.
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    color: "text.secondary",
                    maxWidth: 420,
                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  }}
                >
                  Buy and sell textbooks, find tutors, and discover upcoming
                  events on campus — all in one place.
                </Typography>
              </Box>

              {/*  IMAGE PLACEHOLDER */}
              <Box
                sx={{
                  flexShrink: 0,
                  mt: { xs: 2, md: 0 },
                  width: { xs: 140, sm: 180, md: 260 },
                  height: { xs: 140, sm: 180, md: 260 },
                  borderRadius: 3,
                  bgcolor: "#FFE6E0",
                }}
              />
            </Stack>
          </Box>

          {/* MARKET SECTION (populated from API) */}
          <DynamicSection title="Market" typeFilter="market" />

          {/* EVENTS SECTION (populated from API) */}
          <DynamicSection title="Events" typeFilter="event" />
        </Container>
      </Box>
      <MobileNav />
    </Stack>
  );
}

// Wrapper to fetch posts of a given type and render the Section.
function DynamicSection({ title, typeFilter }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;

    // typeFilter is "market" | "event"
    const url = `http://localhost:8080/api/posts/postfetch?type=${encodeURIComponent(
      typeFilter
    )}&limit=8`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`API error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;

        const mapped = (data || []).map((p) => {
          // For Market: subtitle = location (use postal for now) - should be city region eventually (need to add api ***or change to post date like homepage?***)
          // For Events: subtitle = organization name
          const subtitle =
            typeFilter === "event"
              ? p.organization_name || ""
              : p.postal_code || "";

          const price = p.price != null ? `$${Number(p.price)}` : "$0";

          return {
            id: p.id,
            title: p.title,
            subtitle,
            price,
            // Backend returns thumbnail as { image_id, data } where `data` is base64
            thumbnailBase64: p.thumbnail?.data || null,
          };
        });

        setItems(mapped);
      })
      .catch((err) => {
        console.error("Failed to load posts for", typeFilter, err);
      });

    return () => {
      mounted = false;
    };
  }, [typeFilter]);

  return <Section title={title} items={items} />;
}

/*title + responsive cards grid */

function Section({ title, items }) {
  return (
    <Stack spacing={1}>
      {/* Header row */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, fontSize: { xs: "1rem", md: "1.1rem" } }}
        >
          {title}
        </Typography>

        <Button
          size="small"
          disableRipple
          sx={{
            p: 0,
            minWidth: "auto",
            textTransform: "none",
            color: "text.secondary",
            fontSize: { xs: "0.75rem", md: "0.85rem" },
          }}
        >
          See all →
        </Button>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))", // 2 rows on mobile
            sm: "repeat(3, minmax(0, 1fr))", // 3 rows on small tablets
            md: "repeat(4, minmax(0, 1fr))", // 4 rows on desktop
          },
          columnGap: 2,
          rowGap: 2,
          mt: 0.5,
        }}
      >
        {items.map((item) => (
          <ItemCard key={item.id} {...item} />
        ))}
      </Box>
    </Stack>
  );
}

/* ===== SINGLE CARD ===== */
function ItemCard({ title, subtitle, price, thumbnailBase64 }) {
  // Clean up any whitespace/newlines in the base64 string
  const cleanedThumb = thumbnailBase64
    ? thumbnailBase64.replace(/\s/g, "")
    : null;

  return (
    <Stack
      spacing={0.5}
      sx={(theme) => ({
        borderRadius: 2,
        p: 1,
        bgcolor: theme.palette.background.paper,
        boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
      })}
    >
      {cleanedThumb ? (
        <Box
          component="img"
          src={`data:image/jpeg;base64,${cleanedThumb}`}
          alt={title}
          sx={{
            width: "100%",
            aspectRatio: "4 / 3",
            borderRadius: 1.5,
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            aspectRatio: "4 / 3",
            borderRadius: 1.5,
            bgcolor: "#EEE", // simple grey fallback
          }}
        />
      )}

      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          mt: 0.5,
          fontSize: { xs: "0.8rem", md: "0.9rem" },
        }}
        noWrap
      >
        {title}
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}
        noWrap
      >
        {subtitle}
      </Typography>

      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          mt: 0.5,
          fontSize: { xs: "0.7rem", md: "0.75rem" },
        }}
      >
        {price}
      </Typography>
    </Stack>
  );
}
