// Home.jsx
import { Box, Container, Stack, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";          // ⬅️ add this
import Header from "../components/Header";
import MobileNav from "../components/MobileNav";
import DesktopNav from "../components/DesktopNav";
import heroImg from "../assets/hero.png";

export default function Home() {
  //id = home
  return (
    <Stack
      direction="row"
      sx={{ bgcolor: "background.paper", minHeight: "100vh" }}
    >
      <DesktopNav />
      <Box sx={{ flex: "1", m: 0 }}>
        <Header />
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
              direction={{ xs: "column", md: "row" }}
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

              {/* HERO IMAGE */}
              <Box
                component="img"
                src={heroImg}
                alt="Students using the campus marketplace"
                sx={{
                  flexShrink: 0,
                  mt: { xs: 2, md: 0 },
                  width: { xs: 180, sm: 220, md: 280 },
                  borderRadius: 3,
                  objectFit: "cover",
                  display: "block",
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
  const navigate = useNavigate();                    // ⬅️ use navigate here

  useEffect(() => {
    let mounted = true;

    // typeFilter is "market" | "event"
    const url = `/api/posts/postfetch?type=${encodeURIComponent(
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
          // For Market: subtitle = location (use postal code)
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

  return (
    <Section
      title={title}
      items={items}
      // "See all" -> public listing pages
      onSeeAll={() =>
        navigate(typeFilter === "event" ? "/events" : "/market")
      }
      // Card click -> item details pages
      onItemClick={(id) =>
        navigate(typeFilter === "event" ? `/events/${id}` : `/market/${id}`)
      }
    />
  );
}

/* title + responsive cards grid */
function Section({ title, items, onSeeAll, onItemClick }) {
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
          onClick={onSeeAll}                      // ⬅️ link See all
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
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(3, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
          },
          columnGap: 2,
          rowGap: 2,
          mt: 0.5,
        }}
      >
        {items.map((item) => (
          <ItemCard
            key={item.id}
            {...item}
            onClick={() => onItemClick(item.id)}  // ⬅️ card click handler
          />
        ))}
      </Box>
    </Stack>
  );
}

/* ===== SINGLE CARD ===== */
function ItemCard({ title, subtitle, price, thumbnailBase64, onClick }) {
  const cleanedThumb = thumbnailBase64
    ? thumbnailBase64.replace(/\s/g, "")
    : null;

  return (
    <Stack
      spacing={0.5}
      onClick={onClick}
      sx={(theme) => ({
        borderRadius: 2,
        p: 1,
        bgcolor: theme.palette.background.paper,
        boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
        cursor: onClick ? "pointer" : "default",   // ⬅️ shows it's clickable
        "&:hover": onClick
          ? {
              boxShadow: "0px 4px 10px rgba(0,0,0,0.12)",
              transform: "translateY(-1px)",
              transition: "all 0.15s ease-out",
            }
          : {},
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
            bgcolor: "#EEE",
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
