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
import CustomButton from "../components/CustomButton";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import { useRef, useCallback } from "react";


function useDebounce(fn, delay) {
  const timer = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

const PAGE_SIZE = 20;

export default function Events() {
  const [eventFilters, setEventFilters] = useState(null);
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [isAdmin, setIsAdmin] = useState(() => {
    return JSON.parse(localStorage.getItem("user")).isAdmin;
  });

  const createQueryParams = (filters, searchKey, currentOffset) => {
    const params = new URLSearchParams();

    params.append("limit", PAGE_SIZE);
    params.append("offset", currentOffset);

    const trimmed = searchKey && searchKey.trim();
    if (trimmed) params.append("searchTerms", trimmed);

    if (!filters) return params.toString();

    const { dateRange, minCost, maxCost } = filters;

    if (typeof minCost === "number") params.append("minPrice", minCost);
    if (typeof maxCost === "number") params.append("maxPrice", maxCost);

    if (dateRange?.start) {
      params.append("startDate", dayjs(dateRange.start).format("YYYY-MM-DD"));
    }
    if (dateRange?.end) {
      params.append("endDate", dayjs(dateRange.end).format("YYYY-MM-DD"));
    }

    return params.toString();
  };

  const fetchEvents = async (
      filters = eventFilters,
      searchKey = searchKeyword,
      currentOffset = 0,
      append = false
  ) => {
    try {
      setLoading(true);
      setErrorText(null);

      const queryString = createQueryParams(filters, searchKey, currentOffset);
      const url = `/api/posts/eventres?${queryString}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch events");

      const data = await res.json();

      if (append) {
        setEvents((prev) => [...prev, ...data.results]);
      } else {
        setEvents(data.results);
      }
      setTotal(data.total);
      setOffset(currentOffset);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setEvents([]);
      setErrorText("Couldn't load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleApplyFilters = (filters) => {
    setEventFilters(filters);
    fetchEvents(filters, searchKeyword, 0, false);
  };

  const handleClearFilters = () => {
    setEventFilters(null);
    setSearchKeyword("");
    fetchEvents(null, "", 0, false);
  };

  const handleLoadMore = () => {
    const newOffset = offset + PAGE_SIZE;
    fetchEvents(eventFilters, searchKeyword, newOffset, true);
  };

  const fetchSuggestions = async (value) => {
    if (!value || !value.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
          `/api/posts/suggestions?q=${encodeURIComponent(value)}&type=event`
      );
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
      }
    } catch (err) {
      console.error("Suggestions error:", err);
    }
  };

  const debouncedSearch = useDebounce((value) => {
    fetchEvents(eventFilters, value, 0, false);
  }, 300);

  const debouncedSuggestions = useDebounce((value) => {
    fetchSuggestions(value);
  }, 200);

  const hasMore = events.length < total;

  return (
      <Box sx={{ display: "flex", width: "100%" }}>
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
              flex: 1,
            })}
        >
          <Header />

          <Container sx={{ ...styles.container, pb: 8, mb: 10 }} maxWidth="lg">
            <Autocomplete
                freeSolo
                options={suggestions}
                inputValue={searchKeyword}
                onInputChange={(e, value, reason) => {
                  setSearchKeyword(value);
                  if (reason === "input") {
                    debouncedSuggestions(value);
                    debouncedSearch(value);
                  }
                }}
                onChange={(e, value) => {
                  if (value) {
                    setSearchKeyword(value);
                    setSuggestions([]);
                    fetchEvents(eventFilters, value, 0, false);
                  }
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        size="medium"
                        placeholder="Search events"
                        variant="standard"
                        sx={styles.searchBoxField}
                        slotProps={{
                          input: {
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                  {params.InputProps.endAdornment}
                                  <InputAdornment position="end">
                                    <SearchIcon
                                        fontSize="medium"
                                        sx={{ cursor: "pointer" }}
                                        onClick={() =>
                                            fetchEvents(eventFilters, searchKeyword, 0, false)
                                        }
                                    />
                                  </InputAdornment>
                                </>
                            ),
                          },
                        }}
                    />
                )}
            />

            <Filters
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                showCond={false}
            />

            <Divider sx={styles.secDiv} />

            <Typography variant="caption" sx={styles.secLabel}>
              Upcoming events ({total} results)
            </Typography>

            <Box sx={styles.grid}>
              {loading && events.length === 0 && (
                  <Typography sx={styles.fullRowText}>
                    Loading events...
                  </Typography>
              )}

              {errorText && !loading && (
                  <Typography sx={styles.errorText}>{errorText}</Typography>
              )}

              {!errorText &&
                  events.map((event) => (
                      <EventCard key={event.id} event={event} isAdmin={isAdmin} />
                  ))}
            </Box>

            {hasMore && !loading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <CustomButton color="black" onClick={handleLoadMore}>
                    Load More
                  </CustomButton>
                </Box>
            )}

            {loading && events.length > 0 && (
                <Typography sx={{ textAlign: "center", mt: 2 }}>
                  Loading more...
                </Typography>
            )}
          </Container>

          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <MobileNav />
          </Box>
        </Stack>
      </Box>
  );
}

function EventCard({ event, isAdmin }) {
  const navigate = useNavigate();

  const { id, title, organization_name, price, thumbnail } = event;

  const imageUrl = thumbnail?.data
      ? `data:image/jpeg;base64,${thumbnail.data}`
      : "/images/placeholder.jpg";

  return (
      <Stack
          direction={{ xs: "row", md: "column" }}
          spacing={{ xs: 2, md: 1.5 }}
          sx={cardStyles.root}
          onClick={() =>
              isAdmin
                  ? navigate(`/admin/reports/events/${id}`)
                  : navigate(`/events/${id}`)
          }
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