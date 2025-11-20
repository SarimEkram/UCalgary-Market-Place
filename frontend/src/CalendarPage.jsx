// src/CalendarPage.jsx
import { useState } from "react";
import { Box, Stack, IconButton } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import dayjs from "dayjs";
import DateRangeDialog from "./components/DateRangeDialog";

export default function CalendarPage() {
  const [range, setRange] = useState({ start: null, end: null });
  const [open, setOpen] = useState(false);

  const handleApply = (newRange) => {
    setRange(newRange);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack spacing={2} alignItems="center">

        {/* ICON ONLY */}
        <IconButton
          onClick={() => setOpen(true)}
          color="primary"
          sx={{
            backgroundColor: "rgba(210,44,34,0.1)",
            borderRadius: "12px",
            p: 1.2,
            "&:hover": {
              backgroundColor: "rgba(210,44,34,0.2)",
            },
          }}
        >
          <CalendarMonthIcon fontSize="medium" />
        </IconButton>

        <DateRangeDialog
          open={open}
          onClose={() => setOpen(false)}
          onApply={handleApply}
          initialRange={range}
        />
      </Stack>
    </Box>
  );
}
