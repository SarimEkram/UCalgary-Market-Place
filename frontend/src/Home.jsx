// Home.jsx
import { Box, Container, Stack, Typography, Button } from "@mui/material";
import Header from "./components/Header";
import Navigation from "./components/Navigation";

export default function Home() {
  return (
    <Stack
      id="home"
      direction="column"
      sx={(theme) => ({
        bgcolor: theme.palette.background.default,
        minHeight: "100vh",
        justifyContent: "space-between",
      })}
    >
      <Header />

      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          py: { xs: 2, md: 4 },          // less vertical padding on mobile
          px: { xs: 2, sm: 3, md: 6 },   // tighter padding on small screens
          display: "flex",
          flexDirection: "column",
          gap: { xs: 3, md: 4 },
        }}
      >
        {/* HERO CARD */}
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: "0px 8px 24px rgba(0,0,0,0.08)",
            p: { xs: 2, sm: 3, md: 4 },    // smaller padding on mobile
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }} // column on mobile, row on desktop
            spacing={{ xs: 2, md: 3 }}
            alignItems="center"
            justifyContent="space-between"
          >
            {/* LEFT: TEXT */}
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
                Buy and sell textbooks, find tutors, and discover upcoming events
                on campus — all in one place.
              </Typography>
            </Box>

            {/* RIGHT: IMAGE PLACEHOLDER */}
            <Box
              sx={{
                flexShrink: 0,
                mt: { xs: 2, md: 0 }, // push below text on mobile
                width: { xs: 140, sm: 180, md: 260 },
                height: { xs: 140, sm: 180, md: 260 },
                borderRadius: 3,
                bgcolor: "#FFE6E0",
              }}
            />
          </Stack>
        </Box>

        {/* MARKET SECTION */}
        <Section
          title="Market"
          items={[
            {
              id: 1,
              title: "Pearsons: Linear Algebra",
              subtitle: "NW, Calgary",
              price: "$0",
              variant: "book",
            },
            {
              id: 2,
              title: "CPSC 213 Tutor",
              subtitle: "NW, Calgary",
              price: "$15/hr",
              variant: "tutor",
            },
            {
              id: 5,
              title: "Math 249 Textbook",
              subtitle: "SE, Calgary",
              price: "$20",
              variant: "book",
            },
            {
              id: 6,
              title: "CPSC 331 Tutor",
              subtitle: "Online",
              price: "$18/hr",
              variant: "tutor",
            },
          ]}
        />

        {/* EVENTS SECTION */}
        <Section
          title="Events"
          items={[
            {
              id: 3,
              title: "Networking Tips: From Experts…",
              subtitle: "Student Union",
              price: "$0",
              variant: "event1",
            },
            {
              id: 4,
              title: "Blast From the Past! – CSUS",
              subtitle: "CSUS",
              price: "$5",
              variant: "event2",
            },
            {
              id: 7,
              title: "Resume Review Night",
              subtitle: "Engineering Lounge",
              price: "$0",
              variant: "event1",
            },
            {
              id: 8,
              title: "Game Jam Weekend",
              subtitle: "CSUS",
              price: "$10",
              variant: "event2",
            },
          ]}
        />
      </Container>

      <Navigation />
    </Stack>
  );
}

/* ===== SECTION (title + responsive cards grid) ===== */

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

      {/* Cards – now using CSS grid for reliable columns */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))", // ✅ always 2 per row on phones
            sm: "repeat(3, minmax(0, 1fr))", // ~3 per row on small tablets
            md: "repeat(4, minmax(0, 1fr))", // ~4 per row on desktop
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

function ItemCard({ title, subtitle, price, variant }) {
  const gradientByVariant = {
    book: "linear-gradient(135deg, #FFF3CD, #FFE0B2)",
    tutor: "linear-gradient(135deg, #E0F0FF, #D1C4E9)",
    event1: "linear-gradient(135deg, #0D1B46, #3E4E8B)",
    event2: "linear-gradient(135deg, #D1C4E9, #F2D7FF)",
  };

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
      <Box
        sx={{
          width: "100%",
          aspectRatio: "4 / 3", // same ratio on all devices
          borderRadius: 1.5,
          bgcolor: "#EEE",
          backgroundImage: gradientByVariant[variant] || "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

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
