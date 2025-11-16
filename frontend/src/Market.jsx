// Market.jsx
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  IconButton,
  Divider,
  Chip,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

import Header from "./components/Header";
import Navigation from "./components/Navigation";

// ===== SAMPLE DATA =====
const RECENT_POSTS = [
  {
    id: 1,
    title: "psych 203 textbook",
    date: "jan 23 2025",
    price: "$30",
    imageUrl: "/images/psych-203.jpg",
  },
  {
    id: 2,
    title: "textbook: linear algebra",
    date: "jan 23 2025",
    price: "$30",
    imageUrl: "/images/linear-algebra.jpg",
  },
  {
    id: 3,
    title: "cpsc 345 textbook",
    date: "jan 25 2025",
    price: "$20",
    imageUrl: "/images/algorithm-design.jpg",
  },
  {
    id: 4,
    title: "algorithm and design pearson textbook",
    date: "jan 21 2025",
    price: "$20",
    imageUrl: "/images/algorithm-design-2.jpg",
  },
];

export default function Market() {
  return (
    <Stack
      id="market"
      direction="column"
      sx={(theme) => ({
        bgcolor: theme.palette.background.default,
        minHeight: "100vh",
        justifyContent: "space-between",
      })}
    >
      {/* Top app bar */}
      <Header />

      {/* MAIN CONTENT */}
      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          py: { xs: 2, md: 4 },
          px: { xs: 2, md: 8 }, // wider padding on desktop like your mock
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* SEARCH BAR */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search..."
          variant="standard"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        {/* FILTERS ROW */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ mt: 2, mb: 1 }}
        >
          <IconButton size="small" sx={{ p: 0.5 }}>
            <FilterListIcon fontSize="small" />
          </IconButton>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, fontSize: "0.85rem" }}
          >
            Filters
          </Typography>
        </Stack>

        <Divider sx={{ mb: 1.5 }} />

        {/* POSSIBLE KEYWORDS */}
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", mb: 1 }}
        >
          Possible Keywords
        </Typography>

        <Stack
          direction="row"
          flexWrap="wrap"
          spacing={1}
          sx={{ mb: 1.5 }}
        >
          {["textbook", "tutor", "desk", "equipment"].map((kw) => (
            <Chip
              key={kw}
              label={`"${kw}"`}
              size="small"
              variant="outlined"
              sx={{
                fontSize: "0.7rem",
                height: 22,
                borderRadius: 12,
              }}
            />
          ))}
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* RECENT POSTS TITLE */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            mb: 1.5,
            fontSize: "0.88rem",
          }}
        >
          Recent Posts
        </Typography>

        {/* POSTS LIST / GRID  */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr", // phones: single column list
              sm: "1fr",
              md: "repeat(3, minmax(0, 220px))", // desktop: 3 columns like mock
            },
            columnGap: { xs: 0, md: 6 },
            rowGap: { xs: 3, md: 4 }, // more vertical spacing between posts
          }}
        >
          {RECENT_POSTS.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </Box>
      </Container>

      {/* Bottom navigation */}
      <Navigation />
    </Stack>
  );
}

/* ===== SINGLE POST CARD (responsive layout) ===== */
function PostCard({ title, date, price, imageUrl }) {
  return (
    <Stack
      direction={{ xs: "row", md: "column" }} // row on mobile, column on desktop
      spacing={{ xs: 2, md: 1.5 }}
      alignItems="flex-start"
      sx={{ minWidth: 0 }}
    >
      {/* IMAGE / THUMBNAIL */}
      <Box
        component="img"
        src={imageUrl}
        alt={title}
        sx={{
          width: { xs: 90, md: 120 },   // bigger box on desktop
          height: { xs: 120, md: 150 },
          borderRadius: 1.5,
          objectFit: "cover",
          flexShrink: 0,
          bgcolor: "#eee",
          boxShadow: "0px 2px 4px rgba(0,0,0,0.12)", // matches card feel in mock
        }}
      />

      {/* TEXT */}
      <Stack sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: { xs: "0.9rem", md: "0.85rem" },
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            fontSize: "0.75rem",
            mt: 0.3,
          }}
        >
          {date}
        </Typography>

        <Typography
          sx={{
            fontWeight: 600,
            fontSize: { xs: "0.9rem", md: "0.85rem" },
            mt: 0.8,
          }}
        >
          {price}
        </Typography> 
      </Stack>
    </Stack>
  );
}
