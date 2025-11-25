// Market.jsx
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  Divider,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import Filters from "../components/Filters";
import Header from "../components/Header";
import Navigation from "../components/Navigation";

// TODO: Replace with real data from backend
const RECENT_POSTS = [
  {
    id: 1,
    title: "psych 203 textbook",
    date: "jan 23 2025",
    price: "$30",
    condition: "new",
    imageUrl: "/images/psych-203.jpg",
  },
  {
    id: 2,
    title: "textbook: linear algebra",
    date: "jan 23 2025",
    price: "$30",
    condition: "good",
    imageUrl: "/images/linear-algebra.jpg",
  },
  {
    id: 3,
    title: "cpsc 345 textbook",
    date: "jan 25 2025",
    price: "$20",
    condition: "fair",
    imageUrl: "/images/algorithm-design.jpg",
  },
  {
    id: 4,
    title: "algorithm and design pearson textbook",
    date: "jan 21 2025",
    price: "$20",
    condition: "good",
    imageUrl: "/images/algorithm-design-2.jpg",
  },
];

export default function Market() {

  const [activeFilters, setActiveFilters] = useState(null);

  const applyFilters = (filters) => {
    console.log("Applied filters:", filters);
    setActiveFilters(filters);
  };

  const postFilterResults = activeFilters
    ? RECENT_POSTS.filter((post) => {
      const { dateRange, minCost, maxCost, condition } = activeFilters;

      // Price filter
      const cost = parseFloat(post.price.replace(/[^0-9.]/g, "")) || 0;
      if (cost < minCost || cost > maxCost) return false;

      // Condition filter
      if (condition && post.condition !== condition) return false;

      // Date filter
      if (dateRange && (dateRange.start || dateRange.end)) {
        const postDate = dayjs(post.date);

        if (dateRange.start && postDate.isBefore(dateRange.start, "day"))
          return false;
        if (dateRange.end && postDate.isAfter(dateRange.end, "day"))
          return false;
      }

      return true;
    })
    : RECENT_POSTS;

  return (
    <Stack
      id="market-initial-page"                        //id for testing
      direction="column"                              // vertical layout
      sx={(theme) => ({                              // full height, bg color from theme 
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        justifyContent: "space-between",
      })}
    >
      <Header />

      <Container
        sx={{
          flexGrow: 1,
          py: { xs: 2, md: 4 },                   //padding top/bottom on mobile,desktop
          px: { xs: 2, md: 8 },                   //padding left/right on mobile,desktop   
          display: "flex",                        // main content area inside container as flexbox
          flexDirection: "column",                // vertical layout
        }}
        maxWidth="lg"                           // large breakpoint for desktop   
      >
        {/* Search Bar*/}
        <TextField      
          size="medium"                         // medium size input field       
          placeholder="Search..."                // placeholder text
          variant="standard"                    // no border, only underlined
          slotProps={{
            input: {
              endAdornment: (                     //Insert search icon at the end in the search bar
                <InputAdornment position="end">
                  <SearchIcon fontSize="medium" />   {/*search icon size*/}
                </InputAdornment>
              ),
            },
          }}
        />
        <Filters onApply={applyFilters} />
        <Divider sx={{ mb: 1 }} />

        {/* Possible Keywords */}
        <Typography
          variant="caption"                           // small caption text                 
          sx={{ color: "text.primary", mb: 1 }}    // text style with bottom margin
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
            <Typography
              key={kw}
              variant="caption"
              sx={{
                color: "text.secondary",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              “{kw}”
            </Typography>
          ))}
        </Stack>

        <Divider sx={{ mb: 2 }} />                              

        {/* Recent Posts */}
        <Typography
          variant="caption"
          sx={{
            mb: 1.5,
            color: "text.primary",
          }}
        >
          Recent Posts
        </Typography>

        {/* Posts list */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",                // 1 column: mobile
              sm: "1fr",                // 1 column: small tablets   
              md: "repeat(4, minmax(0, 220px))",  //4 Columns: desktop
            },
            rowGap: { xs: 3, md: 4 }, // Space between rows
            columnGap: { xs: 0, md: 6 }, //space between columns
          }}
        >
          {postFilterResults.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </Box>
      </Container>

      {/* Bottom navigation */}
      <Navigation />
    </Stack>
  );
}

/* Post Card*/
function PostCard({ title, date, price, imageUrl }) {
  return (
    <Stack
      direction={{ xs: "row", md: "column" }} // row on mobile, column on desktop
      alignItems="flex-start"
      spacing={{ xs: 2, md: 1.5 }}
      sx={{ minWidth: 0 }}
    >
      {/* Image*/}
      <Box
        component="img"
        src={imageUrl}
        alt={title}
        sx={{
          width: { xs: 90, md: 120 },  //responsive width
          height: { xs: 120, md: 150 }, //responsive height
          borderRadius: 1,
          objectFit: "cover",
          boxShadow: "0px 2px 4px rgba(0,0,0,0.14)",
        }}
      />

      {/* Text */}
      <Stack sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: { xs: "0.9rem", md: "0.8rem" },
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            fontSize: "0.90rem",
            mt: 0.5,
          }}
        >
          {date}
        </Typography>

        <Typography
          sx={{
            fontWeight: 500,
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
