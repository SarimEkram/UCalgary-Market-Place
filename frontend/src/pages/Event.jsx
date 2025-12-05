// Events.jsx
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  Divider,
  InputAdornment,
} from "@mui/material";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import Filters from "../components/Filters";
import Header from "../components/Header";
import MobileNav from "../components/MobileNav";
import DesktopNav from "../components/DesktopNav";
import { useNavigate } from "react-router-dom";

const API_BASE = "";
const EVENTS_ENDPOINT = `/api/posts/eventres`;

export default function Events() {
  const [eventFilters, setEventFilters] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  const createQueryParams = (filters, searchKey) => {
    const params = new URLSearchParams();

    const trimmed = searchKey && searchKey.trim();
    if (trimmed) {
      params.append("searchTerms", trimmed);
    }

    if (!filters) return params.toString();

    const { dateRange, minCost, maxCost } = filters;

    if (typeof minCost === "number") params.append("minPrice", minCost);
    if (typeof maxCost === "number") params.append("maxPrice", maxCost);

    if (dateRange?.start)
      params.append("startDate", dayjs(dateRange.start).format("YYYY-MM-DD"));

    if (dateRange?.end)
      params.append("endDate", dayjs(dateRange.end).format("YYYY-MM-DD"));

    return params.toString();
  };

  const fetchEvents = async (
    filters = eventFilters,
    searchKey = searchKeyword
  ) => {
    try {
      setLoading(true);
      setErrorText(null);

      const queryString = createQueryParams(filters, searchKey);
      const url = queryString ? `${EVENTS_ENDPOINT}?${queryString}` : EVENTS_ENDPOINT;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch events");

      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setEvents([]);
      setErrorText("Couldn’t load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleApplyFilters = (filters) => {
    setEventFilters(filters);
    fetchEvents(filters, searchKeyword);
  };

  const handleClearFilters = () => {
    setEventFilters(null);
    setSearchKeyword("");
    fetchEvents(null, "");
  };

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      {/* Desktop left nav */}
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <DesktopNav />
      </Box>

      <Stack
        id="events-page"
        direction="column"
        sx={(theme) => ({
          minHeight: "100vh",
          bgcolor: theme.palette.background.default,
          justifyContent: "space-between",
          flex:1
        })}
      >
        <Header />

        <Container sx={{...styles.container, pb:8, mb:10}} maxWidth="lg">
          {/* Search bar */}
          <TextField
            size="medium"
            placeholder="Search events"
            variant="standard"
            value={searchKeyword}
            onChange={(e) => {
              const value = e.target.value;
              setSearchKeyword(value);
              fetchEvents(eventFilters, value); 
            }}

            sx={styles.searchBoxField}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon fontSize="medium" sx={{ cursor: "pointer" }}
                    onClick={() => fetchEvents(eventFilters, searchKeyword)} />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Filters */}
          <Filters onApply={handleApplyFilters} onClear={handleClearFilters} showCond={false} />

          <Divider sx={styles.secDiv} />

          {/* Section label */}
          <Typography variant="caption" sx={styles.secLabel}>
            Upcoming events
          </Typography>

          {/* Events list/grid */}
          <Box sx={styles.grid}>
            {loading && (
              <Typography sx={styles.fullRowText}>Loading events...</Typography>
            )}

            {errorText && !loading && (
              <Typography sx={styles.errorText}>{errorText}</Typography>
            )}

            {!loading &&
              !errorText &&
              events.map((event) => <EventCard key={event.id} event={event} />)}
          </Box>
        </Container>

        {/* Mobile bottom nav */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <MobileNav />
        </Box>
      </Stack>
    </Box>
  );
}

function EventCard({ event }) {
  const navigate = useNavigate();

  const {
    id,
    title,
    organization_name,
    event_start,
    event_end,
    price,
    postal_code,
    thumbnail,
  } = event;

  const imageUrl = thumbnail?.data
    ? `data:image/jpeg;base64,${thumbnail.data}`
    : "/images/placeholder.jpg";

  const start = event_start ? dayjs(event_start) : null;

  return (
    <Stack
      direction={{ xs: "row", md: "column" }}
      spacing={{ xs: 2, md: 1.5 }}
      sx={cardStyles.root}
      onClick={() => navigate(`/events/${id}`)}
    >
      <Box component="img" src={imageUrl} alt={title} sx={cardStyles.image} />

      <Stack sx={cardStyles.textCol}>
        <Typography sx={cardStyles.title}>{title}</Typography>

        {organization_name && (
          <Typography sx={cardStyles.subText}>{organization_name}</Typography>
        )}

        <Typography sx={cardStyles.price}>
          {price != null ? `$${price}` : "Free"}
        </Typography>
      </Stack>
    </Stack>
  );
}

const styles = {
  container: {
    flexGrow: 1,
    py: { xs: 2, md: 4 },
    px: { xs: 2, md: 8 },
    display: "flex",
    flexDirection: "column",
  },

  searchBoxField: { mb: 1 },
  secDiv: { mb: 1 },
  secLabel: { color: "text.primary", mb: 1.5 },

  grid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "repeat(4, minmax(0, 220px))",
    },
    rowGap: { xs: 3, md: 4 },
    columnGap: { xs: 0, md: 6 },
  },

  fullRowText: { gridColumn: "1 / -1" },
  errorText: { gridColumn: "1 / -1", color: "error.main" },
};

const cardStyles = {
  root: { cursor: "pointer" },
  image: {
    width: { xs: 90, md: 120 },
    height: { xs: 120, md: 150 },
    borderRadius: 1,
    objectFit: "cover",
  },
  textCol: {},
  title: { fontSize: { xs: "0.9rem", md: "0.8rem" } },
  subText: { color: "text.secondary", fontSize: "0.9rem", mt: 0.3 },
  price: { fontWeight: 500, mt: 0.5 },
};
