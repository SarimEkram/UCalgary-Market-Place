// // // // // // src/components/MarketFilters.jsx
// // // // // import { useState } from "react";
// // // // // import {
// // // // //   Box,
// // // // //   Stack,
// // // // //   Typography,
// // // // //   IconButton,
// // // // //   Divider,
// // // // //   Button,
// // // // //   Paper,
// // // // //   Slider,
// // // // //   ToggleButton,
// // // // //   ToggleButtonGroup,
// // // // // } from "@mui/material";
// // // // // import FilterListIcon from "@mui/icons-material/FilterList";

// // // // // export default function Filters({
// // // // //   onApply,
// // // // //   initialDateRange = "Aug 17 2025 – Aug 21 2025",
// // // // // }) {
// // // // //   const [open, setOpen] = useState(false);
// // // // //   const [dateRange, setDateRange] = useState(initialDateRange);
// // // // //   const [priceRange, setPriceRange] = useState([25, 100]);
// // // // //   const [condition, setCondition] = useState("new");

// // // // //   const handleClear = () => {
// // // // //     setDateRange(initialDateRange);
// // // // //     setPriceRange([0, 100]);
// // // // //     setCondition("new");
// // // // //   };

// // // // //   const handleApply = () => {
// // // // //     onApply?.({
// // // // //       dateRange,
// // // // //       priceMin: priceRange[0],
// // // // //       priceMax: priceRange[1],
// // // // //       condition,
// // // // //     });
// // // // //     setOpen(false);
// // // // //   };

// // // // //   const handleChangeDateClick = () => {
// // // // //     // later connect this to your DateFilterDialog
// // // // //     console.log("Change Date selectedDateRange clicked");
// // // // //   };

// // // // //   return (
// // // // //     <Box sx={{ mb: 1.5 }}>
// // // // //       {/* Top “Filters” row */}
// // // // //       <Stack
// // // // //         direction="row"
// // // // //         alignItems="center"
// // // // //         spacing={1}
// // // // //         sx={{ mt: 2, mb: 1, cursor: "pointer", width: "fit-content" }}
// // // // //         onClick={() => setOpen((prev) => !prev)}
// // // // //       >
// // // // //         <IconButton size="small" sx={{ p: 0.5 }}>
// // // // //           <FilterListIcon fontSize="small" />
// // // // //         </IconButton>
// // // // //         <Typography
// // // // //           variant="body2"
// // // // //           sx={{ fontWeight: 500, fontSize: "0.85rem" }}
// // // // //         >
// // // // //           Filters
// // // // //         </Typography>
// // // // //       </Stack>

// // // // //       {/* Panel card */}
// // // // //       {open && (
// // // // //         <Box sx={{ position: "relative", mt: 1 }}>
// // // // //           <Paper
// // // // //             elevation={3}
// // // // //             sx={(theme) => ({
// // // // //               borderRadius: 3,
// // // // //               p: 2,
// // // // //               width: "100%",
// // // // //               maxWidth: 360,
// // // // //               bgcolor: theme.palette.background.paper,
// // // // //               position: "relative",
// // // // //               "&::before": {
// // // // //                 content: '""',
// // // // //                 position: "absolute",
// // // // //                 top: -8,
// // // // //                 left: 32,
// // // // //                 borderLeft: "8px solid transparent",
// // // // //                 borderRight: "8px solid transparent",
// // // // //                 borderBottom: `8px solid ${theme.palette.background.paper}`,
// // // // //               },
// // // // //             })}
// // // // //           >
// // // // //             {/* DATE */}
// // // // //             <Typography
// // // // //               variant="subtitle2"
// // // // //               sx={{ fontWeight: 600, fontSize: "0.8rem", mb: 0.5 }}
// // // // //             >
// // // // //               Date
// // // // //             </Typography>
// // // // //             <Typography
// // // // //               variant="caption"
// // // // //               sx={{ color: "text.secondary", mb: 1 }}
// // // // //             >
// // // // //               Posted: {dateRange}
// // // // //             </Typography>
// // // // //             <Button
// // // // //               fullWidth
// // // // //               variant="contained"
// // // // //               onClick={handleChangeDateClick}
// // // // //               sx={{
// // // // //                 textTransform: "none",
// // // // //                 fontSize: "0.8rem",
// // // // //                 borderRadius: 999,
// // // // //                 bgcolor: "grey.900",
// // // // //                 "&:hover": { bgcolor: "grey.800" },
// // // // //                 mb: 2,
// // // // //               }}
// // // // //             >
// // // // //               Change Date selectedDateRange
// // // // //             </Button>

// // // // //             <Divider sx={{ my: 1.5 }} />

// // // // //             {/* PRICE */}
// // // // //             <Stack direction="row" justifyContent="space-between" mb={1}>
// // // // //               <Typography
// // // // //                 variant="subtitle2"
// // // // //                 sx={{ fontWeight: 600, fontSize: "0.8rem" }}
// // // // //               >
// // // // //                 Price
// // // // //               </Typography>
// // // // //               <Typography
// // // // //                 variant="body2"
// // // // //                 sx={{ fontSize: "0.8rem", fontWeight: 500 }}
// // // // //               >
// // // // //                 ${priceRange[0]}–{priceRange[1]}
// // // // //               </Typography>
// // // // //             </Stack>

// // // // //             <Slider
// // // // //               value={priceRange}
// // // // //               min={0}
// // // // //               max={100}
// // // // //               step={5}
// // // // //               onChange={(_, v) => setPriceRange(v)}
// // // // //               sx={{
// // // // //                 mb: 0.5,
// // // // //                 "& .MuiSlider-thumb": { boxShadow: "none" },
// // // // //               }}
// // // // //             />

// // // // //             <Stack direction="row" justifyContent="space-between" mb={2}>
// // // // //               <Typography variant="caption">$0</Typography>
// // // // //               <Typography variant="caption">$100</Typography>
// // // // //             </Stack>

// // // // //             <Divider sx={{ my: 1.5 }} />

// // // // //             {/* CONDITION */}
// // // // //             <Typography
// // // // //               variant="subtitle2"
// // // // //               sx={{ fontWeight: 600, fontSize: "0.8rem", mb: 1 }}
// // // // //             >
// // // // //               Condition
// // // // //             </Typography>

// // // // //             <ToggleButtonGroup
// // // // //               exclusive
// // // // //               value={condition}
// // // // //               onChange={(_, val) => {
// // // // //                 if (val !== null) setCondition(val);
// // // // //               }}
// // // // //               sx={{
// // // // //                 display: "flex",
// // // // //                 gap: 1,
// // // // //                 "& .MuiToggleButton-root": {
// // // // //                   flex: 1,
// // // // //                   textTransform: "none",
// // // // //                   fontSize: "0.8rem",
// // // // //                   borderRadius: 999,
// // // // //                   border: "none",
// // // // //                   bgcolor: "grey.100",
// // // // //                   "&.Mui-selected": {
// // // // //                     bgcolor: "grey.900",
// // // // //                     color: "common.white",
// // // // //                     "&:hover": { bgcolor: "grey.800" },
// // // // //                   },
// // // // //                 },
// // // // //               }}
// // // // //             >
// // // // //               <ToggleButton value="new">New</ToggleButton>
// // // // //               <ToggleButton value="good">Good</ToggleButton>
// // // // //               <ToggleButton value="fair">Fair</ToggleButton>
// // // // //             </ToggleButtonGroup>

// // // // //             {/* ACTION BUTTONS */}
// // // // //             <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
// // // // //               <Button
// // // // //                 fullWidth
// // // // //                 variant="contained"
// // // // //                 onClick={handleClear}
// // // // //                 sx={{
// // // // //                   textTransform: "none",
// // // // //                   fontSize: "0.8rem",
// // // // //                   borderRadius: 999,
// // // // //                   bgcolor: "grey.900",
// // // // //                   "&:hover": { bgcolor: "grey.800" },
// // // // //                 }}
// // // // //               >
// // // // //                 Clear
// // // // //               </Button>
// // // // //               <Button
// // // // //                 fullWidth
// // // // //                 variant="contained"
// // // // //                 onClick={handleApply}
// // // // //                 sx={{
// // // // //                   textTransform: "none",
// // // // //                   fontSize: "0.8rem",
// // // // //                   borderRadius: 999,
// // // // //                   bgcolor: "error.main",
// // // // //                   "&:hover": { bgcolor: "error.dark" },
// // // // //                 }}
// // // // //               >
// // // // //                 Apply
// // // // //               </Button>
// // // // //             </Stack>
// // // // //           </Paper>
// // // // //         </Box>
// // // // //       )}
// // // // //     </Box>
// // // // //   );
// // // // // }
// // // // // src/components/MarketFilters.jsx
// // // // import { useState } from "react";
// // // // import {
// // // //   Box,
// // // //   Stack,
// // // //   Typography,
// // // //   IconButton,
// // // //   Divider,
// // // //   Button,
// // // //   Paper,
// // // //   Slider,
// // // //   ToggleButton,
// // // //   ToggleButtonGroup,
// // // // } from "@mui/material";
// // // // import FilterListIcon from "@mui/icons-material/FilterList";
// // // // import DateRangeDialog from "./DateRangeDialog";

// // // // export default function Filters({ onApply }) {
// // // //   // panel open/close
// // // //   const [isFilterPanelOpen, setFilterPanelOpen] = useState(false);

// // // //   // date selectedDateRange for filter (dayjs or null)
// // // //   const [selectedDateRange, setSelectedDateRange] = useState({ start: null, end: null });
// // // //   const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);

// // // //   // price + condition
// // // //   const [priceRange, setPriceRange] = useState([25, 100]);
// // // //   const [condition, setCondition] = useState("new");

// // // //   const formatRangeLabel = () => {
// // // //     const { start, end } = selectedDateRange;
// // // //     if (start && end) {
// // // //       return `${start.format("MMM D, YYYY")} – ${end.format("MMM D, YYYY")}`;
// // // //     }
// // // //     if (start) {
// // // //       return start.format("MMM D, YYYY");
// // // //     }
// // // //     return "Any time";
// // // //   };

// // // //   const handleClear = () => {
// // // //     setSelectedDateRange({ start: null, end: null });
// // // //     setPriceRange([0, 100]);
// // // //     setCondition("new");
// // // //   };

// // // //   const applyFilters = () => {
// // // //     onApply?.({
// // // //       dateRange: selectedDateRange, // { start: dayjs|null, end: dayjs|null }
// // // //       minPrice: priceRange[0],
// // // //       maxPrice: priceRange[1],
// // // //       condition,
// // // //     });
// // // //     setFilterPanelOpen(false);
// // // //   };

// // // //   const applyDate = (newRange) => {
// // // //     // newRange = { start: dayjs|null, end: dayjs|null } from DateRangeDialog
// // // //     setSelectedDateRange(newRange);
// // // //   };

// // // //   return (
// // // //     <Box sx={{ mb: 1.5 }}>
// // // //       {/* Top “Filters” row */}
// // // //       <Stack
// // // //         direction="row"
// // // //         alignItems="center"
// // // //         spacing={1}
// // // //         sx={{ mt: 2, mb: 1, cursor: "pointer", width: "fit-content" }}
// // // //         onClick={() => setFilterPanelOpen((prev) => !prev)}
// // // //       >
// // // //         <IconButton size="small" sx={{ p: 0.5 }}>
// // // //           <FilterListIcon fontSize="small" />
// // // //         </IconButton>
// // // //         <Typography
// // // //           variant="body2"
// // // //           sx={{ fontWeight: 500, fontSize: "0.85rem" }}
// // // //         >
// // // //           Filters
// // // //         </Typography>
// // // //       </Stack>

// // // //       {/* Filter panel card */}
// // // //       {isFilterPanelOpen && (
// // // //         <Paper
// // // //           elevation={3}
// // // //           sx={{
// // // //             borderRadius: 3,
// // // //             p: 2,
// // // //             width: "100%",
// // // //             maxWidth: 360,
// // // //             position: "relative",
// // // //           }}
// // // //         >
// // // //           {/* DATE SECTION */}
// // // //           <Typography
// // // //             variant="subtitle2"
// // // //             sx={{ fontWeight: 600, fontSize: "0.8rem", mb: 0.5 }}
// // // //           >
// // // //             Date
// // // //           </Typography>
// // // //           <Typography
// // // //             variant="caption"
// // // //             sx={{ color: "text.secondary", mb: 1 }}
// // // //           >
// // // //             Posted: {formatRangeLabel()}
// // // //           </Typography>

// // // //           <Button
// // // //             fullWidth
// // // //             variant="contained"
// // // //             onClick={() => setIsDateDialogOpen(true)}
// // // //             sx={{
// // // //               textTransform: "none",
// // // //               fontSize: "0.8rem",
// // // //               borderRadius: 999,
// // // //               bgcolor: "grey.900",
// // // //               "&:hover": { bgcolor: "grey.800" },
// // // //               mb: 2,
// // // //             }}
// // // //           >
// // // //             Change Date selectedDateRange
// // // //           </Button>

// // // //           <Divider sx={{ my: 1.5 }} />

// // // //           {/* PRICE SECTION */}
// // // //           <Stack direction="row" justifyContent="space-between" mb={1}>
// // // //             <Typography
// // // //               variant="subtitle2"
// // // //               sx={{ fontWeight: 600, fontSize: "0.8rem" }}
// // // //             >
// // // //               Price
// // // //             </Typography>
// // // //             <Typography
// // // //               variant="body2"
// // // //               sx={{ fontSize: "0.8rem", fontWeight: 500 }}
// // // //             >
// // // //               ${priceRange[0]}–{priceRange[1]}
// // // //             </Typography>
// // // //           </Stack>

// // // //           <Slider
// // // //             value={priceRange}
// // // //             min={0}
// // // //             max={100}
// // // //             step={5}
// // // //             onChange={(_, v) => setPriceRange(v)}
// // // //             sx={{
// // // //               mb: 0.5,
// // // //               "& .MuiSlider-thumb": { boxShadow: "none" },
// // // //             }}
// // // //           />

// // // //           <Stack direction="row" justifyContent="space-between" mb={2}>
// // // //             <Typography variant="caption">$0</Typography>
// // // //             <Typography variant="caption">$100</Typography>
// // // //           </Stack>

// // // //           <Divider sx={{ my: 1.5 }} />

// // // //           {/* CONDITION SECTION */}
// // // //           <Typography
// // // //             variant="subtitle2"
// // // //             sx={{ fontWeight: 600, fontSize: "0.8rem", mb: 1 }}
// // // //           >
// // // //             Condition
// // // //           </Typography>

// // // //           <ToggleButtonGroup
// // // //             exclusive
// // // //             value={condition}
// // // //             onChange={(_, val) => {
// // // //               if (val !== null) setCondition(val);
// // // //             }}
// // // //             sx={{
// // // //               display: "flex",
// // // //               gap: 1,
// // // //               "& .MuiToggleButton-root": {
// // // //                 flex: 1,
// // // //                 textTransform: "none",
// // // //                 fontSize: "0.8rem",
// // // //                 borderRadius: 999,
// // // //                 border: "none",
// // // //                 bgcolor: "grey.100",
// // // //                 "&.Mui-selected": {
// // // //                   bgcolor: "grey.900",
// // // //                   color: "common.white",
// // // //                   "&:hover": { bgcolor: "grey.800" },
// // // //                 },
// // // //               },
// // // //             }}
// // // //           >
// // // //             <ToggleButton value="new">New</ToggleButton>
// // // //             <ToggleButton value="good">Good</ToggleButton>
// // // //             <ToggleButton value="fair">Fair</ToggleButton>
// // // //           </ToggleButtonGroup>

// // // //           {/* ACTION BUTTONS */}
// // // //           <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
// // // //             <Button
// // // //               fullWidth
// // // //               variant="contained"
// // // //               onClick={handleClear}
// // // //               sx={{
// // // //                 textTransform: "none",
// // // //                 fontSize: "0.8rem",
// // // //                 borderRadius: 999,
// // // //                 bgcolor: "grey.900",
// // // //                 "&:hover": { bgcolor: "grey.800" },
// // // //               }}
// // // //             >
// // // //               Clear
// // // //             </Button>
// // // //             <Button
// // // //               fullWidth
// // // //               variant="contained"
// // // //               onClick={applyFilters}
// // // //               sx={{
// // // //                 textTransform: "none",
// // // //                 fontSize: "0.8rem",
// // // //                 borderRadius: 999,
// // // //                 bgcolor: "error.main",
// // // //                 "&:hover": { bgcolor: "error.dark" },
// // // //               }}
// // // //             >
// // // //               Apply
// // // //             </Button>
// // // //           </Stack>
// // // //         </Paper>
// // // //       )}

// // // //       {/* DATE selectedDateRange DIALOG (reused from your CalendarPage) */}
// // // //       <DateRangeDialog
// // // //         open={isDateDialogOpen}
// // // //         onClose={() => setIsDateDialogOpen(false)}
// // // //         onApply={applyDate}
// // // //         initialRange={selectedDateRange}
// // // //       />
// // // //     </Box>
// // // //   );
// // // // }
// // // // Import React state handling
// // // import { useState } from "react";
// // // import {
// // //   Box,
// // //   Stack,
// // //   Typography,
// // //   IconButton,
// // //   Divider,
// // //   Button,
// // //   Paper,
// // //   Slider,
// // //   ToggleButton,
// // //   ToggleButtonGroup,
// // // } from "@mui/material";

// // // import FilterListIcon from "@mui/icons-material/FilterList";
// // // import DateRangeDialog from "./DateRangeDialog"; 


// // // export default function Filters({ onApply }) {
// // //   // Controls whether the filter panel card (Paper) is open or closed
// // //   const [isFilterPanelOpen, setFilterPanelOpen] = useState(false);

// // //   // Stores selected date selectedDateRange { start: dayjs|null, end: dayjs|null }
// // //   const [selectedDateRange, setSelectedDateRange] = useState({ start: null, end: null });

// // //   // Controls whether date dialog is visible
// // //   const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);

// // //   //Price filter
// // //   const [costRange, setCostRange] = useState([25, 100]);

// // //   // Condition filter state ("new", "good", "fair")
// // //   const [condition, setCondition] = useState("new");

// // //   // Label
// // //   const formatRangeLabel = () => {
// // //     const { start, end } = selectedDateRange;

// // //     if (start && end) {
// // //       return `${start.format("MMM D, YYYY")} – ${end.format("MMM D, YYYY")}`;
// // //     }
// // //     if (start) {
// // //       return start.format("MMM D, YYYY");
// // //     }
// // //     return "Any time";
// // //   };

// // //   // Reset all filters to default
// // //   const handleClear = () => {
// // //     setSelectedDateRange({ start: null, end: null });
// // //     setCostRange([0, 100]);
// // //     setCondition("new");
// // //   };

// // //   // Apply filter values 
// // //   const applyFilters = () => {
// // //     onApply?.({
// // //       dateRange: selectedDateRange,        // { start, end }
// // //       minCost: costRange[0],   // variable name MUST match Market.jsx
// // //       maxCost: costRange[1],   // "
// // //       condition,               // ("new" | "good" | "fair")
// // //     });

// // //     // Close panel after applying
// // //     setFilterPanelOpen(false);
// // //   };

// // //   // Receive updated date selectedDateRange from DateRangeDialog
// // //   const applyDate = (newRange) => {
// // //     setSelectedDateRange(newRange);
// // //   };


// // //   return (
// // //     <Box sx={{ mb: 1.5 }}>
      
// // //       <Stack
// // //         direction="row"
// // //         alignItems="center"
// // //         spacing={1}
// // //         sx={{
// // //           mt: 2,
// // //           mb: 1,
// // //           cursor: "pointer",
// // //           width: "fit-content",
// // //         }}
// // //         onClick={() => setFilterPanelOpen((prev) => !prev)}
// // //       >
// // //         <IconButton size="small" sx={{ p: 0.5 }}>
// // //           <FilterListIcon fontSize="small" />
// // //         </IconButton>

// // //         <Typography
// // //           variant="body2"
// // //           sx={{ fontWeight: 500, fontSize: "0.85rem" }}
// // //         >
// // //           Filters
// // //         </Typography>
// // //       </Stack>

// // //       {/* collapse filter panel*/}
// // //       {isFilterPanelOpen && (
// // //         <Paper
// // //           elevation={3}
// // //           sx={{
// // //             borderRadius: 3,
// // //             p: 2,
// // //             width: "100%",
// // //             maxWidth: 360,
// // //           }}
// // //         >
// // //           {/* Date Filter */}
// // //           <Typography
// // //             variant="subtitle2"
// // //             sx={{ fontWeight: 600, fontSize: "0.8rem", mb: 0.5 }}
// // //           >
// // //             Date
// // //           </Typography>

// // //           <Typography
// // //             variant="caption"
// // //             sx={{ color: "text.secondary", mb: 1 }}
// // //           >
// // //             Posted: {formatRangeLabel()}
// // //           </Typography>

// // //           <Button
// // //             fullWidth
// // //             variant="contained"
// // //             onClick={() => setIsDateDialogOpen(true)}
// // //             sx={{
// // //               textTransform: "none",
// // //               fontSize: "0.8rem",
// // //               borderRadius: 999,
// // //               bgcolor: "grey.900",
// // //               "&:hover": { bgcolor: "grey.800" },
// // //               mb: 2,
// // //             }}
// // //           >
// // //             Change Date Range
// // //           </Button>

// // //           <Divider sx={{ my: 1.5 }} />

// // //           {/* ===== COST FILTER ===== */}
// // //           <Stack direction="row" justifyContent="space-between" mb={1}>
// // //             <Typography
// // //               variant="subtitle2"
// // //               sx={{ fontWeight: 600, fontSize: "0.8rem" }}
// // //             >
// // //               Price
// // //             </Typography>

// // //             <Typography
// // //               variant="body2"
// // //               sx={{ fontSize: "0.8rem", fontWeight: 500 }}
// // //             >
// // //               ${costRange[0]}–{costRange[1]}
// // //             </Typography>
// // //           </Stack>

// // //           <Slider
// // //             value={costRange}
// // //             min={0}
// // //             max={100}
// // //             step={5}
// // //             onChange={(_, v) => setCostRange(v)}
// // //             sx={{
// // //               mb: 0.5,
// // //               "& .MuiSlider-thumb": { boxShadow: "none" },
// // //             }}
// // //           />

// // //           <Stack direction="row" justifyContent="space-between" mb={2}>
// // //             <Typography variant="caption">$0</Typography>
// // //             <Typography variant="caption">$100</Typography>
// // //           </Stack>

// // //           <Divider sx={{ my: 1.5 }} />

// // //           {/* ===== CONDITION FILTER ===== */}
// // //           <Typography
// // //             variant="subtitle2"
// // //             sx={{ fontWeight: 600, fontSize: "0.8rem", mb: 1 }}
// // //           >
// // //             Condition
// // //           </Typography>

// // //           <ToggleButtonGroup
// // //             exclusive
// // //             value={condition}
// // //             onChange={(_, val) => {
// // //               if (val !== null) setCondition(val);
// // //             }}
// // //             sx={{
// // //               display: "flex",
// // //               gap: 1,
// // //               "& .MuiToggleButton-root": {
// // //                 flex: 1,
// // //                 textTransform: "none",
// // //                 fontSize: "0.8rem",
// // //                 borderRadius: 999,
// // //                 border: "none",
// // //                 bgcolor: "grey.100",
// // //                 "&.Mui-selected": {
// // //                   bgcolor: "grey.900",
// // //                   color: "common.white",
// // //                   "&:hover": { bgcolor: "grey.800" },
// // //                 },
// // //               },
// // //             }}
// // //           >
// // //             <ToggleButton value="new">New</ToggleButton>
// // //             <ToggleButton value="good">Good</ToggleButton>
// // //             <ToggleButton value="fair">Fair</ToggleButton>
// // //           </ToggleButtonGroup>

// // //           {/* ACTION BUTTONS */}
// // //           <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
// // //             <Button
// // //               variant="contained"
// // //               onClick={handleClear}
// // //               sx={{
// // //                 textTransform: "none",
// // //                 fontSize: "0.8rem",
// // //                 borderRadius: 999,
// // //                 bgcolor: "grey.900",
// // //                 "&:hover": { bgcolor: "grey.800" },
// // //               }}
// // //             >
// // //               Clear
// // //             </Button>

// // //             <Button
// // //               variant="contained"
// // //               onClick={applyFilters}
// // //               sx={{
// // //                 textTransform: "none",
// // //                 fontSize: "0.8rem",
// // //                 borderRadius: 999,
// // //                 bgcolor: "error.main",
// // //                 "&:hover": { bgcolor: "error.dark" },
// // //               }}
// // //             >
// // //               Apply
// // //             </Button>
// // //           </Stack>
// // //         </Paper>
// // //       )}

// // //       {/* ===== DATE selectedDateRange DIALOG ===== */}
// // //       <DateRangeDialog
// // //         open={isDateDialogOpen}
// // //         onClose={() => setIsDateDialogOpen(false)}
// // //         onApply={applyDate}
// // //         initialRange={selectedDateRange}
// // //       />
// // //     </Box>
// // //   );
// // // }
// // import { useState } from "react";
// // import {
// //   Box,
// //   Stack,
// //   Typography,
// //   IconButton,
// //   Divider,
// //   Button,
// //   Paper,
// //   Slider,
// //   ToggleButton,
// //   ToggleButtonGroup,
// // } from "@mui/material";

// // import FilterListIcon from "@mui/icons-material/FilterList";
// // import DateRangeDialog from "./DateRangeDialog";

// // export default function Filters({ onApply }) {
// //   const [isFilterPanelOpen, setFilterPanelOpen] = useState(false);

// //   // { start: dayjs|null, end: dayjs|null }
// //   const [selectedDateRange, setSelectedDateRange] = useState({
// //     start: null,
// //     end: null,
// //   });

// //   const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
// //   const [costRange, setCostRange] = useState([25, 100]);
// //   const [condition, setCondition] = useState("new");

// //   const formatRangeLabel = () => {
// //     const { start, end } = selectedDateRange;

// //     if (start && end) {
// //       return `${start.format("MMM D, YYYY")} – ${end.format("MMM D, YYYY")}`;
// //     }
// //     if (start) {
// //       return start.format("MMM D, YYYY");
// //     }
// //     return "Any time";
// //   };

// //   const handleClear = () => {
// //     setSelectedDateRange({ start: null, end: null });
// //     setCostRange([0, 100]);
// //     setCondition("new");
// //   };

// //   const applyFilters = () => {
// //     onApply?.({
// //       dateRange: selectedDateRange,
// //       minCost: costRange[0],
// //       maxCost: costRange[1],
// //       condition,
// //     });
// //     setFilterPanelOpen(false);
// //   };

// //   const applyDate = (newRange) => {
// //     setSelectedDateRange(newRange);
// //   };

// //   return (
// //     <Box
// //       sx={{
// //         mb: 1,
// //         position: "relative", 
// //         display: "inline-block",  
// //       }}
// //     >
// //       {/* Filters header row */}
// //       <Stack
// //         direction="row"
// //         alignItems="center"
// //         spacing={1}
// //         sx={{
// //           mt: 2,
// //           mb: 1,
// //           cursor: "pointer",
// //           width: "fit-content",
// //         }}
// //         onClick={() => setFilterPanelOpen((prev) => !prev)}
// //       >
// //         <IconButton size="small" sx={{ p: 0.5 }}>
// //           <FilterListIcon fontSize="small" />
// //         </IconButton>

// //         <Typography
// //           variant="body2"
// //           sx={{ fontWeight: 500, fontSize: "0.85rem" }}
// //         >
// //           Filter
// //         </Typography>
// //       </Stack>

// //       {/* Floating panel – absolutely positioned so it doesn't push content down */}
// //       {isFilterPanelOpen && (
// //         <Paper
// //           elevation={3}
// //           sx={{
// //             position: "absolute",
// //             top: "calc(100% + 8px)",        
// //             left: 0,
// //             zIndex: 10,
// //             borderRadius: 3,
// //             p: 2,
// //             width: "100%",
// //             maxWidth: { xs: 300, sm: 340, md: 360 },
// //             boxSizing: "border-box",
// //             maxHeight: "70vh",
// //             overflowY: "auto",
// //           }}
// //         >
// //           {/* Date */}
// //           <Typography
// //             variant="subtitle2"
// //             sx={{ fontWeight: 600, fontSize: "0.8rem", mb: 0.5 }}
// //           >
// //             Date
// //           </Typography>

// //           <Typography
// //             variant="caption"
// //             sx={{ color: "text.secondary", mb: 1 }}
// //           >
// //             Posted: {formatRangeLabel()}
// //           </Typography>

// //           <Button
// //             fullWidth
// //             variant="contained"
// //             onClick={() => setIsDateDialogOpen(true)}
// //             sx={{
// //               textTransform: "none",
// //               fontSize: "0.8rem",
// //               borderRadius: 999,
// //               bgcolor: "grey.900",
// //               "&:hover": { bgcolor: "grey.800" },
// //               mb: 2,
// //               py: 0.6,
// //             }}
// //           >
// //             Change Date Range
// //           </Button>

// //           <Divider sx={{ my: 1.5 }} />

// //           {/* Price */}
// //           <Stack direction="row" justifyContent="space-between" mb={1}>
// //             <Typography
// //               variant="subtitle2"
// //               sx={{ fontWeight: 600, fontSize: "0.8rem" }}
// //             >
// //               Price
// //             </Typography>

// //             <Typography
// //               variant="body2"
// //               sx={{ fontSize: "0.8rem", fontWeight: 500 }}
// //             >
// //               ${costRange[0]}–{costRange[1]}
// //             </Typography>
// //           </Stack>

// //           <Slider
// //             value={costRange}
// //             min={0}
// //             max={100}
// //             step={5}
// //             onChange={(_, v) => setCostRange(v)}
// //             sx={{
// //               mb: 0.5,
// //               "& .MuiSlider-thumb": { boxShadow: "none" },
// //               "& .MuiSlider-rail": {
// //                 opacity: 1,
// //                 color: "grey.300",
// //               },
// //               "& .MuiSlider-track": {
// //                 color: "error.main",
// //               },
// //             }}
// //           />

// //           <Stack direction="row" justifyContent="space-between" mb={2}>
// //             <Typography variant="caption">$0</Typography>
// //             <Typography variant="caption">$100</Typography>
// //           </Stack>

// //           <Divider sx={{ my: 1.5 }} />

// //           {/* Condition */}
// //           <Typography
// //             variant="subtitle2"
// //             sx={{ fontWeight: 600, fontSize: "0.8rem", mb: 1 }}
// //           >
// //             Condition
// //           </Typography>

// //           <ToggleButtonGroup
// //             exclusive
// //             value={condition}
// //             onChange={(_, val) => {
// //               if (val !== null) setCondition(val);
// //             }}
// //             sx={{
// //               display: "flex",
// //               gap: 1,
// //               "& .MuiToggleButton-root": {
// //                 textTransform: "none",
// //                 fontSize: "0.8rem",
// //                 borderRadius: 999,
// //                 border: "none",
// //                 bgcolor: "grey.100",
// //                 px: 2.5,
// //                 py: 0.6,
// //                 position: "relative",
// //                 minWidth: "auto",
// //                 "&.Mui-selected": {
// //                   bgcolor: "grey.900",
// //                   color: "common.white",
// //                   fontWeight: 600,
// //                   "&:hover": { bgcolor: "grey.800" },
// //                   "&::before": {
// //                     content: "'✓'",
// //                     position: "absolute",
// //                     left: 10,
// //                     fontSize: "0.75rem",
// //                     top: "50%",
// //                     transform: "translateY(-50%)",
// //                   },
// //                 },
// //               },
// //             }}
// //           >
// //             <ToggleButton value="new">New</ToggleButton>
// //             <ToggleButton value="good">Good</ToggleButton>
// //             <ToggleButton value="fair">Fair</ToggleButton>
// //           </ToggleButtonGroup>

// //           {/* Clear / Apply */}
// //           <Stack
// //             direction="row"
// //             justifyContent="space-between"
// //             sx={{ mt: 3 }}
// //           >
// //             <Button
// //               variant="contained"
// //               onClick={handleClear}
// //               sx={{
// //                 minWidth: 110,
// //                 textTransform: "none",
// //                 fontSize: "0.8rem",
// //                 borderRadius: 999,
// //                 bgcolor: "grey.900",
// //                 "&:hover": { bgcolor: "grey.800" },
// //                 py: 0.6,
// //               }}
// //             >
// //               Clear
// //             </Button>

// //             <Button
// //               variant="contained"
// //               onClick={applyFilters}
// //               sx={{
// //                 minWidth: 110,
// //                 textTransform: "none",
// //                 fontSize: "0.8rem",
// //                 borderRadius: 999,
// //                 bgcolor: "error.main",
// //                 "&:hover": { bgcolor: "error.dark" },
// //                 py: 0.6,
// //               }}
// //             >
// //               Apply
// //             </Button>
// //           </Stack>
// //         </Paper>
// //       )}

// //       {/* Date range dialog */}
// //       <DateRangeDialog
// //         open={isDateDialogOpen}
// //         onClose={() => setIsDateDialogOpen(false)}
// //         onApply={applyDate}
// //         initialRange={selectedDateRange}
// //       />
// //     </Box>
// //   );
// // }
// import { useState } from "react";
// import {
//   Box,
//   Stack,
//   Typography,
//   IconButton,
//   Divider,
//   Button,
//   Paper,
//   Slider,
//   ToggleButton,
//   ToggleButtonGroup,
// } from "@mui/material";
// import FilterIcon from "../assets/FilterIcon";

// import DateRangeDialog from "./DateRangeDialog";
// import CustomButton from "../components/CustomButton";
// import ConditionCheckmark from "../assets/ConditionCheckMark";

// export default function Filters({ onApply }) {
//   const [isFilterPanelOpen, setFilterPanelOpen] = useState(false);

//   const [selectedDateRange, setSelectedDateRange] = useState({
//     start: null,
//     end: null,
//   });

//   const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
//   const [costRange, setCostRange] = useState([25, 100]);
//   const [condition, setCondition] = useState("new");

//   const formatRangeLabel = () => {
//     const { start, end } = selectedDateRange;

//     if (start && end) {
//       return `${start.format("MMM D, YYYY")} – ${end.format("MMM D, YYYY")}`;
//     }
//     if (start) {
//       return start.format("MMM D, YYYY");
//     }
//     return "Any time";
//   };

//   const handleClear = () => {
//     setSelectedDateRange({ start: null, end: null });
//     setCostRange([0, 100]);
//     setCondition("new");
//   };

//   const applyFilters = () => {
//     onApply?.({
//       dateRange: selectedDateRange,
//       minCost: costRange[0],
//       maxCost: costRange[1],
//       condition,
//     });
//     setFilterPanelOpen(false);
//   };

//   const applyDate = (newRange) => {
//     setSelectedDateRange(newRange);
//   };

//   return (
//     <Box
//       sx={{
//         mb: 1,
//         position: "relative",
//         display: "inline-block",
//       }}
//     >
//       {/* Filters header row */}
//       <Stack
//         direction="row"
//         alignItems="center"
//         spacing={1}
//         sx={{
//           mt: 2,
//           mb: 1,
//           cursor: "pointer",
//           width: "fit-content",
//         }}
//         onClick={() => setFilterPanelOpen((prev) => !prev)}
//       >
//         <IconButton size="small" sx={{ p: 0.5 }}>
//           <FilterIcon style={{ width: 18, height: 12 }} />
//         </IconButton>

//         <Typography
//           variant="body2"
//           sx={{ fontWeight: 500, fontSize: "0.85rem" }}
//         >
//           Filter
//         </Typography>
//       </Stack>

//       {/* Floating panel */}
//       {isFilterPanelOpen && (
        
//         <Paper
//       elevation={0}
//       sx={{
//         position: "absolute",
//         top: "calc(100% + 22px)",
//         left: 0,
//         zIndex: 10,
//         borderRadius: 2,
//         p: 2,
//         width: "100%",
//         maxWidth: { xs: 300, sm: 340, md: 360 },
//         bgcolor: "#FFFFFF",
//         border: "1px solid #EBE7E4",
//         boxShadow:
//           "0px 12px 32px -16px rgba(0,9,50,0.12), 0px 12px 60px rgba(0,0,0,0.15)",
//       }}
    
//         >
//           {/* Date */}
//           <Typography
//             variant="subtitle2"
//             sx={{ fontWeight: 600, fontSize: "0.8rem", mb: 0.5 }}
//           >
//             Date
//           </Typography>

//           <Typography
//             variant="caption"
//             sx={{ color: "text.secondary", mb: 1 }}
//           >
//             Posted: {formatRangeLabel()}
//           </Typography>

//           {/* Change Date Range*/}
//           <CustomButton
//               color="black"
//               onClick={() => setIsDateDialogOpen(true)}
//               style={{
//                 '&&': {
//                   width: 190,          
//                   height: 22,         
//                   minHeight: 22,
//                   borderRadius: 8,
//                   paddingTop: 0,
//                   paddingBottom: 0,
//                   paddingLeft: 0,
//                   paddingRight: 0,
//                   bgcolor: "#221F1F",
//                   fontSize: "0.75rem",
//                   fontWeight: 500,
//                   justifyContent: "center",
//                 },
//                 mb: 2,
//               }}
//             >
//             Change Date Range
//           </CustomButton>
//           <Divider sx={{ my: 1.5 }} />

//           {/* Price */}
//           <Stack direction="row" justifyContent="space-between" mb={0}>
//             <Typography
//               variant="subtitle2"
//               sx={{ fontWeight: 600, fontSize: "0.8rem" }}
//             >
//               Price
//             </Typography>

//             <Typography
//               variant="body2"
//               sx={{ fontSize: "0.8rem", fontWeight: 500 }}
//             >
//               ${costRange[0]}–{costRange[1]}
//             </Typography>
//           </Stack>

//           <Slider
//             value={costRange}
//             min={0}
//             max={50}
//             step={5}
//             onChange={(_, v) => setCostRange(v)}
//             sx={{
//                 p: 0,        // remove default vertical padding
//                 mt: 0,
//                 mb: 0,
//                 "& .MuiSlider-thumb": {
//                 boxShadow: "none",
//                 bgcolor: "black",
//                 width: 15,
//                 height: 15
//               },
//               "& .MuiSlider-rail": {
//                 opacity: 1,
//                 color: "grey.300",
//               },
//               "& .MuiSlider-track": {
//                 color: "error.main",
//               },
//             }}
//           />

//           <Stack direction="row" justifyContent="space-between" mb={0}sx={{ mt: -2 }}>
//             <Typography variant="caption">$0</Typography>
//             <Typography variant="caption">$50</Typography>
//           </Stack>

//           <Divider sx={{ my: 1.5 }} />

//           {/* Condition */}
// <Typography
//   variant="subtitle2"
//   sx={{ fontWeight: 600, fontSize: "0.8rem", mb: 1 }}
// >
//   Condition
// </Typography>

//       <Stack direction="row" spacing={1}>
//         {/* New */}
//         <CustomButton
//           onClick={() => setCondition("new")}
//           style={{
//             "&&": {
//               width: condition === "new" ? 75 : 57,
//               height: 32,
//               minHeight: 32,
//               borderRadius: 8,
//               padding: 0,
//               fontSize: "0.8rem",
//               fontWeight: condition === "new" ? 600 : 500,
//               bgcolor: condition === "new" ? "#221F1F" : "#F5F5F5",
//               color: condition === "new" ? "#F5F5F5" : "#757575",
//               boxShadow: "none",
//             },
//         }}
//   >
//         {condition === "new" && (
//           <ConditionCheckmark style={{ marginRight: 6 }} />
//         )}
//         New
//       </CustomButton>

//   {/* Good */}
//   <CustomButton
//     onClick={() => setCondition("good")}
//     style={{
//       "&&": {
//         width: condition === "good" ? 75 : 57,
//         height: 32,
//         minHeight: 32,
//         borderRadius: 8,
//         padding: 0,
//         fontSize: "0.8rem",
//         fontWeight: condition === "good" ? 600 : 500,
//         bgcolor: condition === "good" ? "#221F1F" : "#F5F5F5",
//         color: condition === "good" ? "#F5F5F5" : "#757575",
//         boxShadow: "none",
//       },
//     }}
//   >
//     {condition === "good" && (
//       <ConditionCheckmark style={{ marginRight: 6 }} />
//     )}
//     Good
//   </CustomButton>

//   {/* Fair */}
//   <CustomButton
//     onClick={() => setCondition("fair")}
//     style={{
//       "&&": {
//         width: condition === "fair" ? 75 : 57,
//         height: 32,
//         minHeight: 32,
//         borderRadius: 8,
//         padding: 0,
//         fontSize: "0.8rem",
//         fontWeight: condition === "fair" ? 600 : 500,
//         bgcolor: condition === "fair" ? "#221F1F" : "#F5F5F5",
//         color: condition === "fair" ? "#F5F5F5" : "#757575",
//         boxShadow: "none",
//       },
//     }}
//   >
//     {condition === "fair" && (
//       <ConditionCheckmark style={{ marginRight: 6 }} />
//     )}
//     Fair
//   </CustomButton>
// </Stack>
// <Divider sx={{ my: 1.5 }} />
//           <Stack
//             direction="row"
//             justifyContent="space-between"
//             sx={{ mt: 3 }}
//           >
//           <CustomButton
//   color="black"
//   onClick={handleClear}
//   style={{
//     "&&": {
//       width: 87,
//       height: 22,
//       minHeight: 22,
//       borderRadius: 8,
//       padding: 0,
//       bgcolor: "#221F1F",
//       fontSize: "0.75rem",
//       fontWeight: 500,
//       justifyContent: "center",
//     },
//   }}
// >
//   Clear
// </CustomButton>



// <CustomButton
//   color="red"
//   onClick={applyFilters}
//   style={{
//     "&&": {
//       width: 87,
//       height: 22,
//       minHeight: 22,
//       borderRadius: 8,
//       padding: 0,
//       bgcolor: "#E53935",
//       fontSize: "0.75rem",
//       fontWeight: 500,
//       justifyContent: "center",
//     },
//   }}
// >
//   Apply
// </CustomButton>

//           </Stack>
//         </Paper>
//       )}

//       {/* Date range dialog */}
//       <DateRangeDialog
//         open={isDateDialogOpen}
//         onClose={() => setIsDateDialogOpen(false)}
//         onApply={applyDate}
//         initialRange={selectedDateRange}
//       />
//     </Box>
//   );
// }
import { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Divider,
  Button,
  Paper,
  Slider,
} from "@mui/material";
import FilterIcon from "../assets/FilterIcon";

import DateRangeDialog from "./DateRangeDialog";
import CustomButton from "../components/CustomButton";
import ConditionCheckmark from "../assets/ConditionCheckMark";

export default function Filters({ onApply }) {
  const [isFilterPanelOpen, setFilterPanelOpen] = useState(false);

  const [selectedDateRange, setSelectedDateRange] = useState({
    start: null,
    end: null,
  });

  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);

  // 🔧 match mock: 25–50, not 25–100
  const [costRange, setCostRange] = useState([25, 50]);

  const [condition, setCondition] = useState("new");

  const formatRangeLabel = () => {
    const { start, end } = selectedDateRange;

    if (start && end) {
      return `${start.format("MMM D, YYYY")} – ${end.format("MMM D, YYYY")}`;
    }
    if (start) {
      return start.format("MMM D, YYYY");
    }
    return "Any time";
  };

  const handleClear = () => {
    setSelectedDateRange({ start: null, end: null });
    // 🔧 reset price to whole range but still 0–50
    setCostRange([0, 50]);
    setCondition("new");
  };

  const applyFilters = () => {
    onApply?.({
      dateRange: selectedDateRange,
      minCost: costRange[0],
      maxCost: costRange[1],
      condition,
    });
    setFilterPanelOpen(false);
  };

  const applyDate = (newRange) => {
    setSelectedDateRange(newRange);
  };

  return (
    <Box
      sx={{
        mb: 1,
        position: "relative",
        display: "inline-block",
      }}
    >
      {/* Filters header row */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          mt: 2,
          mb: 1,
          cursor: "pointer",
          width: "fit-content",
        }}
        onClick={() => setFilterPanelOpen((prev) => !prev)}
      >
        <IconButton size="small" sx={{ p: 0.5 }}>
          <FilterIcon style={{ width: 18, height: 12 }} />
        </IconButton>

        <Typography
          variant="body2"
          sx={{ fontWeight: 500, fontSize: "0.85rem" }}
        >
          Filter
        </Typography>
      </Stack>

      {/* Floating panel */}
      {isFilterPanelOpen && (
        <Paper
          elevation={0}
          sx={{
            position: "absolute",
            top: "calc(100% + 22px)",
            left: 0,
            zIndex: 10,
            borderRadius: 2,
            p: 2,
            width: "100%",
            maxWidth: { xs: 300, sm: 340, md: 360 },
            bgcolor: "#FFFFFF",
            border: "1px solid #EBE7E4",
            boxShadow:
              "0px 12px 32px -16px rgba(0,9,50,0.12), 0px 12px 60px rgba(0,0,0,0.15)",
          }}
        >
          {/* Date */}
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, fontSize: "0.8rem", mb: 0.5 }}
          >
            Date
          </Typography>

          <Typography
            variant="caption"
            sx={{ color: "text.secondary", mb: 1 }}
          >
            Posted: {formatRangeLabel()}
          </Typography>

          {/* Change Date Range */}
          <Box
            sx={{
              mt: 1,                               
              mb: 2,                               
              display: "flex",
              
            }}
            >
          <CustomButton
            color="black"
            onClick={() => setIsDateDialogOpen(true)}
            style={{
              "&&": {
                display:"block",
                margin: "0",
                width: 190,
                height: 22,
                minHeight: 22,
                borderRadius: 8,
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
                bgcolor: "#221F1F",
                fontSize: "0.75rem",
                fontWeight: 500,
                justifyContent: "center",
              },
            }}
          >
            Change Date Range
          </CustomButton>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {/* Price */}
          <Stack direction="row" justifyContent="space-between" mb={0.5}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, fontSize: "0.8rem" }}
            >
              Price
            </Typography>

            <Typography
              variant="body2"
              sx={{ fontSize: "0.8rem", fontWeight: 500 }}
            >
              ${costRange[0]}–{costRange[1]}
            </Typography>
          </Stack>

          {/* 🔧 Slider styling + spacing */}
          <Slider
            value={costRange}
            min={0}
            max={50}
            step={5}
            onChange={(_, v) => setCostRange(v)}
            sx={{
              p: 0,
              mt: 0.5,
              mb: 0,
              "& .MuiSlider-thumb": {
                boxShadow: "none",
                bgcolor: "#1C1C1C",
                width: 15,
                height: 15,
              },
              "& .MuiSlider-rail": {
                opacity: 1,
                bgcolor: "#E0E0E0",
              },
              "& .MuiSlider-track": {
                bgcolor: "#E53935",
              },
            }}
          />

          {/* 🔧 cleaner spacing on labels for desktop + mobile */}
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mt: 0.5, mb: 0 }}
          >
            <Typography variant="caption">$0</Typography>
            <Typography variant="caption">$50</Typography>
          </Stack>

          <Divider sx={{ my: 1.5 }} />

          {/* Condition */}
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, fontSize: "0.8rem", mb: 1 }}
          >
            Condition
          </Typography>

          <Stack direction="row" spacing={1}>
            {/* New */}
            <CustomButton
              onClick={() => setCondition("new")}
              style={{
                "&&": {
                  width: condition === "new" ? 75 : 57,
                  height: 32,
                  minHeight: 32,
                  borderRadius: 8,
                  padding: 0,
                  fontSize: "0.8rem",
                  fontWeight: condition === "new" ? 600 : 500,
                  bgcolor: condition === "new" ? "#221F1F" : "#F5F5F5",
                  color: condition === "new" ? "#F5F5F5" : "#757575",
                  boxShadow: "none",
                },
              }}
            >
              {condition === "new" && (
                <ConditionCheckmark style={{ marginRight: 6 }} />
              )}
              New
            </CustomButton>

            {/* Good */}
            <CustomButton
              onClick={() => setCondition("good")}
              style={{
                "&&": {
                  width: condition === "good" ? 75 : 57,
                  height: 32,
                  minHeight: 32,
                  borderRadius: 8,
                  padding: 0,
                  fontSize: "0.8rem",
                  fontWeight: condition === "good" ? 600 : 500,
                  bgcolor: condition === "good" ? "#221F1F" : "#F5F5F5",
                  color: condition === "good" ? "#F5F5F5" : "#757575",
                  boxShadow: "none",
                },
              }}
            >
              {condition === "good" && (
                <ConditionCheckmark style={{ marginRight: 6 }} />
              )}
              Good
            </CustomButton>

            {/* Fair */}
            <CustomButton
              onClick={() => setCondition("fair")}
              style={{
                "&&": {
                  width: condition === "fair" ? 75 : 57,
                  height: 32,
                  minHeight: 32,
                  borderRadius: 8,
                  padding: 0,
                  fontSize: "0.8rem",
                  fontWeight: condition === "fair" ? 600 : 500,
                  bgcolor: condition === "fair" ? "#221F1F" : "#F5F5F5",
                  color: condition === "fair" ? "#F5F5F5" : "#757575",
                  boxShadow: "none",
                },
              }}
            >
              {condition === "fair" && (
                <ConditionCheckmark style={{ marginRight: 6 }} />
              )}
              Fair
            </CustomButton>
          </Stack>

          <Divider sx={{ my: 1.5 }} />

          {/* Clear / Apply */}
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mt: 3 }}
          >
            <CustomButton
              color="black"
              onClick={handleClear}
              style={{
                "&&": {
                  width: 87,
                  height: 22,
                  minHeight: 22,
                  borderRadius: 8,
                  padding: 0,
                  bgcolor: "#221F1F",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  justifyContent: "center",
                },
              }}
            >
              Clear
            </CustomButton>

            <CustomButton
              color="red"
              onClick={applyFilters}
              style={{
                "&&": {
                  width: 87,
                  height: 22,
                  minHeight: 22,
                  borderRadius: 8,
                  padding: 0,
                  bgcolor: "#E53935",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  justifyContent: "center",
                },
              }}
            >
              Apply
            </CustomButton>
          </Stack>
        </Paper>
      )}

      {/* Date range dialog */}
      <DateRangeDialog
        open={isDateDialogOpen}
        onClose={() => setIsDateDialogOpen(false)}
        onApply={applyDate}
        initialRange={selectedDateRange}
      />
    </Box>
  );
}
