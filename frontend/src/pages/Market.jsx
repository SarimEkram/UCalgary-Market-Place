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
import { useState, useEffect } from "react";                 
import dayjs from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import Filters from "../components/Filters";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";             

const API_BASE = "http://localhost:8080";                    

export default function Market() {

  const [postFilters, setPostFilters] = useState(null);
  const [posts, setPosts] = useState([]);                   
  const [loading, setLoading] = useState(true);              
  const [error, setError] = useState(null);                  
  const [searchKeyword, setSearchKeyword] = useState("");       

  //const navigate = useNavigate();                           

  /* create query parameters from filters and searchKey term */
  const buildQueryParameters = (filters, searchKey) => {
    const parameters = new URLSearchParams();
    console.log("Build Query Parameters called with:", {
    filters,
    searchKey,
  });

    if (searchKey && searchKey.trim()){
      console.log("Adding Search Terms:", searchKey.trim()); 
      parameters.append("searchTerms", searchKey.trim());
    }
    if (!filters){
      console.log(" No filters applied", parameters.toString());
    return parameters.toString();
    }

    const { dateRange, minCost, maxCost, condition } = filters;
    console.log(" Filters for the market marketPost:", filters);

    if (typeof minCost === "number") parameters.append("minPrice", minCost);
    if (typeof maxCost === "number") parameters.append("maxPrice", maxCost);
    if (dateRange?.start)
      parameters.append("startDate", dayjs(dateRange.start).format("YYYY-MM-DD"));
    if (dateRange?.end)
      parameters.append("endDate", dayjs(dateRange.end).format("YYYY-MM-DD"));
    if (condition) parameters.append("condition", condition);

    return parameters.toString();
  };

  /*Fetching market posts from backend */
  const fetchMarketPosts = async (filters = postFilters, searchKey = searchKeyword) => {
    try {
      setLoading(true);
      setError(null);

      const queryString = buildQueryParameters(filters, searchKey);
      const url = queryString
        ? `${API_BASE}/api/posts/marketres?${queryString}`
        : `${API_BASE}/api/posts/marketres`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch posts");

      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setError(err.message || "Error fetching posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketPosts();
  }, []);

  
  const handleApplyFilters = (filters) => {
    setPostFilters(filters);
    fetchMarketPosts(filters, searchKeyword);
  };

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
        maxWidth="lg"
      >
        {/* Search Bar */}
        <TextField
          size="medium"
          placeholder="Search"
          variant="standard"
          value={searchKeyword}                                  
          onChange={(e) => setSearchKeyword(e.target.value)}   
          onKeyDown={(e) => { if (e.key === "Enter") fetchMarketPosts(postFilters, e.target.value); }}  
          slotProps={{
            input: {
              endAdornment: (                  //Insert searchKey icon at the end in the searchKey bar 
                <InputAdornment position="end">
                  <SearchIcon fontSize="medium" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Filters onApply={handleApplyFilters} />
        <Divider sx={{ mb: 1 }} />

        {/* Possible Keywords */}
        <Typography variant="caption" sx={{ color: "text.primary", mb: 1 }}>
          Possible Keywords
        </Typography>

        <Stack direction="row"  spacing={1} sx={{ mb: 1.5 }}>
          {["textbook", "tutor", "desk", "equipment"].map((keyword) => (
            <Typography
              key={keyword}
              variant="caption"
              sx={{
                color: "text.secondary",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => {
                setSearchKeyword(keyword);               
                fetchMarketPosts(postFilters, keyword);    
              }}
            >
              “{keyword}”
            </Typography>
          ))}
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="caption" sx={{ mb: 1.5, color: "text.primary" }}>
          Recent Posts
        </Typography>

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
          {loading && <Typography>Loading market posts</Typography>}
          {error && !loading && <Typography color="error">{error}</Typography>}
          {!loading && !error && posts.map((marketPost) => (
            <PostCard key={marketPost.id} marketPost={marketPost} />    
          ))}
        </Box>
      </Container>

      <Navigation />
    </Stack>
  );
}

function PostCard({ marketPost }) {
  const navigate = useNavigate();    

  const {
    id,
    title,
    posted_date,
    price,
    item_condition,
    thumbnail,
  } = marketPost;

  const imageUrl =
    thumbnail?.data
      ? `data:image/jpeg;base64,${thumbnail.data}`
      : "/images/placeholder.jpg"; 

  return (
    <Stack
      direction={{ xs: "row", md: "column" }}
      alignItems="flex-start"
      spacing={{ xs: 2, md: 1.5 }}
      sx={{ minWidth: 0, cursor: "pointer" }}
      onClick={() => navigate(`/market/${id}`)}      
    >
      <Box
        component="img"
        src={imageUrl}
        alt={title}
        sx={{
          width: { xs: 90, md: 120 },
          height: { xs: 120, md: 150 },
          borderRadius: 1,
          objectFit: "cover",
          boxShadow: "0px 2px 4px rgba(0,0,0,0.14)",
        }}
      />

      <Stack sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: { xs: "0.9rem", md: "0.8rem" } }}>
          {title}
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            fontSize: "0.90rem",
            mt: 0.5,
          }}
        >
          {posted_date ? dayjs(posted_date).format("MMM D YYYY") : "Unknown"}
        </Typography>

        <Typography
          sx={{
            fontWeight: 500,
            fontSize: { xs: "0.90rem", md: "0.80rem" },
            mt: 0.8,
          }}
        >
          {price != null ? `$${price}` : "Free"}
        </Typography>

        {item_condition && (
          <Typography
            sx={{
              fontSize: "0.80rem",
              mt: 0.3,
              textTransform: "capitalize",
              color: "text.secondary",
            }}
          >
            {item_condition}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}
