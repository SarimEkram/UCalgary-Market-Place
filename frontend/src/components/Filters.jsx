
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

export default function Filters({ onApply, onClear, showCond = true }) {
  const [isFilterPanelOpen, setFilterPanelOpen] = useState(false);

  const [selectedDateRange, setSelectedDateRange] = useState({
    start: null,
    end: null,
  });

  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);

  const [costRange, setCostRange] = useState([25, 50]);

  const [condition, setCondition] = useState("");

  const formatRangeLabel = () => {
    const { start, end } = selectedDateRange;

    if (start && end) {
      return `${start.format("MMM D, YYYY")} - ${end.format("MMM D, YYYY")}`;
    }
    if (start) {
      return start.format("MMM D, YYYY");
    }
    return "Any time";
  };

  const handleClear = () => {
    setSelectedDateRange({ start: null, end: null });
    setCostRange([0, 50]);
    if (showCond) {
      setCondition("");
    }
    if (onClear) {
      onClear();
    } else if (onApply) {
      onApply(null);
    }
  };


  const applyFilters = () => {
    const isDefaultState =
      !selectedDateRange.start &&
      !selectedDateRange.end &&
      costRange[0] === 0 &&
      costRange[1] === 50 &&
      (showCond ? !condition : true);

    if (isDefaultState) {
      onApply?.(null);
    } else {
      const filtersToPass = {
        dateRange: selectedDateRange,
        minCost: costRange[0],
        maxCost: costRange[1],
      };

      if (showCond && condition) {
        filtersToPass.condition = condition;
      }

      onApply?.(filtersToSend);

    }

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

      {/* Filter panel */}
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
              display: "block",

            }}
          >
            <CustomButton
              color="black"
              onClick={() => setIsDateDialogOpen(true)}
              style={{
                "&&": {
                  display: "block",
                  margin: 0,
                  width: 190,
                  height: 22,
                  minHeight: 22,
                  borderRadius: 8,
                  padding: 0,
                  bgcolor: "#221F1F",
                  fontSize: 12,
                  fontWeight: 500,
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

          {/* Slider style*/}
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

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mt: 0.5, mb: 0 }}
          >
            <Typography variant="caption">$0</Typography>
            <Typography variant="caption">$50</Typography>
          </Stack>

          <Divider sx={{ my: 1.5 }} />
          
          {showCond && (
        <>
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
        </>
      )}

      {/* Clear and Apply */}
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