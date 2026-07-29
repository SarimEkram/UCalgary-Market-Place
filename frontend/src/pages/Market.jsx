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


const PAGE_SIZE = 20;

export default function Market() {
  const [postFilters, setPostFilters] = useState(null);
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(() => {
    return JSON.parse(localStorage.getItem("user")).isAdmin;
  });

  const createQueryParams = (filters, searchKey, currentOffset) => {
    const params = new URLSearchParams();

    params.append("limit", PAGE_SIZE);
    params.append("offset", currentOffset);

    const trimmedSearch = searchKey && searchKey.trim();
    if (trimmedSearch) {
      params.append("searchTerms", trimmedSearch);
    }

    if (!filters) return params.toString();

    const { dateRange, minCost, maxCost, condition } = filters;

    if (typeof minCost === "number") params.append("minPrice", minCost);
    if (typeof maxCost === "number") params.append("maxPrice", maxCost);

    if (dateRange?.start) {
      params.append("startDate", dayjs(dateRange.start).format("YYYY-MM-DD"));
    }
    if (dateRange?.end) {
      params.append("endDate", dayjs(dateRange.end).format("YYYY-MM-DD"));
    }
    if (condition) {
      params.append("condition", condition);
    }

    return params.toString();
  };

  const fetchMarketPosts = async (
      filters = postFilters,
      searchKey = searchKeyword,
      currentOffset = 0,
      append = false
  ) => {
    try {
      setLoading(true);
      setError(null);

      const queryString = createQueryParams(filters, searchKey, currentOffset);
      const url = `/api/posts/marketres?${queryString}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const data = await res.json();

      if (append) {
        setPosts((prev) => [...prev, ...data.results]);
      } else {
        setPosts(data.results);
      }
      setTotal(data.total);
      setOffset(currentOffset);
    } catch (err) {
      console.error("Failed to fetch market posts:", err);
      setError("Couldn't load market posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketPosts();
  }, []);

  const handleApplyFilters = (filters) => {
    setPostFilters(filters);
    fetchMarketPosts(filters, searchKeyword, 0, false);
  };

  const handleClearFilters = () => {
    setPostFilters(null);
    setSearchKeyword("");
    fetchMarketPosts(null, "", 0, false);
  };

  const handleLoadMore = () => {
    const newOffset = offset + PAGE_SIZE;
    fetchMarketPosts(postFilters, searchKeyword, newOffset, true);
  };

  const fetchSuggestions = async (value) => {
    if (!value || !value.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
          `/api/posts/suggestions?q=${encodeURIComponent(value)}&type=market`
      );
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
      }
    } catch (err) {
      console.error("Suggestions error:", err);
    }
  };

  const hasMore = posts.length < total;

  const keywordOptions = ["textbook", "tutor", "desk", "equipment"];

  return (
      <Box sx={{ display: "flex", width: "100%" }}>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <DesktopNav />
        </Box>
        <Stack
            id="market-initial-page"
            direction="column"
            sx={{ ...styles.page, flex: 1 }}
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
                    fetchSuggestions(value);
                    fetchMarketPosts(postFilters, value, 0, false);
                  }
                }}
                onChange={(e, value) => {
                  if (value) {
                    setSearchKeyword(value);
                    setSuggestions([]);
                    fetchMarketPosts(postFilters, value, 0, false);
                  }
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        size="medium"
                        placeholder="Search"
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
                                            fetchMarketPosts(postFilters, searchKeyword, 0, false)
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

            <Filters onApply={handleApplyFilters} onClear={handleClearFilters} />

            <Divider sx={styles.secDiv} />

            <Typography variant="caption" sx={styles.secLabel}>
              Possible keywords
            </Typography>

            <Stack direction="row" spacing={1} sx={styles.keywordRow}>
              {keywordOptions.map((kw) => (
                  <Typography
                      key={kw}
                      variant="caption"
                      sx={styles.kw}
                      onClick={() => {
                        setSearchKeyword(kw);
                        fetchMarketPosts(postFilters, kw, 0, false);
                      }}
                  >
                    &ldquo;{kw}&rdquo;
                  </Typography>
              ))}
            </Stack>

            <Divider sx={styles.secDiv} />

            <Typography variant="caption" sx={styles.secLabel}>
              Recent posts ({total} results)
            </Typography>

            <Box sx={styles.postGrid}>
              {loading && posts.length === 0 && (
                  <Typography sx={styles.loadingPostsText}>
                    Loading market posts...
                  </Typography>
              )}

              {error && !loading && (
                  <Typography sx={styles.noPostsText}>{error}</Typography>
              )}

              {!error &&
                  posts.map((marketPost) => (
                      <PostCard
                          key={marketPost.id}
                          isAdmin={isAdmin}
                          marketPost={marketPost}
                      />
                  ))}
            </Box>

            {hasMore && !loading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <CustomButton color="black" onClick={handleLoadMore}>
                    Load More
                  </CustomButton>
                </Box>
            )}

            {loading && posts.length > 0 && (
                <Typography sx={{ textAlign: "center", mt: 2 }}>
                  Loading more...
                </Typography>
            )}
          </Container>

          <MobileNav />
        </Stack>
      </Box>
  );
}

function PostCard({ marketPost, isAdmin }) {
  const navigate = useNavigate();

  const { id, title, posted_date, price, item_condition, thumbnail } =
      marketPost;

  const imageUrl = thumbnail?.data
      ? `data:image/jpeg;base64,${thumbnail.data}`
      : "/images/placeholder.jpg";

  return (
      <Stack
          direction={{ xs: "row", md: "column" }}
          alignItems="flex-start"
          spacing={{ xs: 2, md: 1.5 }}
          sx={cardStyles.root}
          onClick={() =>
              isAdmin
                  ? navigate(`/admin/reports/market/${id}`)
                  : navigate(`/market/${id}`)
          }
      >
        <Box component="img" src={imageUrl} alt={title} sx={cardStyles.image} />

        <Stack sx={cardStyles.textCol}>
          <Typography sx={cardStyles.title}>{title}</Typography>

          <Typography sx={cardStyles.date}>
            {posted_date ? dayjs(posted_date).format("MMM D YYYY") : "Unknown"}
          </Typography>

          <Typography sx={cardStyles.price}>
            {price != null ? `$${price}` : "Free"}
          </Typography>

          {item_condition && (
              <Typography sx={cardStyles.condition}>{item_condition}</Typography>
          )}
        </Stack>
      </Stack>
  );
}

const styles = {
  page: (theme) => ({
    minHeight: "100vh",
    bgcolor: theme.palette.background.default,
    justifyContent: "space-between",
  }),
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
  keywordRow: { mb: 1.5 },
  kw: {
    color: "text.secondary",
    textDecoration: "underline",
    cursor: "pointer",
  },
  postGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "1fr",
      md: "repeat(4, minmax(0, 220px))",
    },
    rowGap: { xs: 3, md: 4 },
    columnGap: { xs: 0, md: 6 },
  },
  loadingPostsText: { gridColumn: "1 / -1" },
  noPostsText: { gridColumn: "1 / -1", color: "error.main" },
};

const cardStyles = {
  root: { minWidth: 0, cursor: "pointer" },
  image: {
    width: { xs: 90, md: 120 },
    height: { xs: 120, md: 150 },
    borderRadius: 1,
    objectFit: "cover",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.14)",
  },
  textCol: { minWidth: 0 },
  title: { fontSize: { xs: "0.9rem", md: "0.8rem" } },
  date: { color: "text.secondary", fontSize: "0.9rem", mt: 0.5 },
  price: {
    fontWeight: 500,
    fontSize: { xs: "0.9rem", md: "0.8rem" },
    mt: 0.8,
  },
  condition: {
    fontSize: "0.8rem",
    mt: 0.3,
    textTransform: "capitalize",
    color: "text.secondary",
  },
};