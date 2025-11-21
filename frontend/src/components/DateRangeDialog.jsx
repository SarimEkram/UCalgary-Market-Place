import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { styled, alpha } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import dayjs from "dayjs";

const RangePickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== "isStart" && prop !== "isEnd" && prop !== "isBetween",
})(({ theme, isStart, isEnd, isBetween }) => {
  const isInRange = isStart || isEnd || isBetween;

  const primary = theme.palette.primary.main;
  const primaryDark = theme.palette.primary.dark || theme.palette.primary.main;

  return {
    margin: 0,
    "&.MuiPickersDay-dayWithMargin": {
      margin: 0,
    },
    borderRadius: "50%",
    position: "relative",

    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: alpha(primary, 0.08),
    },
    "&.Mui-selected, &.Mui-selected:hover": {
      backgroundColor: "transparent",
      boxShadow: "none",
    },

    ...(isInRange && {
      backgroundColor: alpha(primary, 0.15),
      color: theme.palette.text.primary,
    }),

    ...(isStart || isEnd
      ? {
          boxShadow: `0 0 0 2px ${primaryDark}`,
        }
      : {}),

    "& > span": {
      position: "relative",
      zIndex: 1,
      fontWeight: 400,
    },
  };
});


export default function DateRangeDialog({
  open,
  onClose,
  onApply,
  initialRange,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [startDate, setStartDate] = useState(initialRange?.start ?? null);
  const [endDate, setEndDate] = useState(initialRange?.end ?? null);

  useEffect(() => {
    setStartDate(initialRange?.start ?? null);
    setEndDate(initialRange?.end ?? null);
  }, [initialRange, open]);

  const handleDaySelect = (newDay) => {
    if (!newDay) return;

    if (!startDate || (startDate && endDate)) {
      setStartDate(newDay.startOf("day"));
      setEndDate(null);
    } else if (newDay.isBefore(startDate, "day")) {
      setStartDate(newDay.startOf("day"));
    } else {
      setEndDate(newDay.startOf("day"));
    }
  };

  const handleCancel = () => {
    setStartDate(initialRange?.start ?? null);
    setEndDate(initialRange?.end ?? null);
    onClose?.();
  };

  const handleOk = () => {
    if (!startDate && !endDate) {
      onApply?.({ start: null, end: null });
    } else {
      onApply?.({
        start: startDate ?? endDate,
        end: endDate ?? startDate,
      });
    }
    onClose?.();
  };

  const currentValue = endDate || startDate || dayjs();

  const DayWithRange = (dayProps) => {
    const { day, outsideCurrentMonth, ...other } = dayProps;

    const isStart = !!startDate && day.isSame(startDate, "day");
    const isEnd = !!endDate && day.isSame(endDate, "day");
    const isBetween =
      !!startDate &&
      !!endDate &&
      day.isAfter(startDate, "day") &&
      day.isBefore(endDate, "day");

    return (
      <RangePickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
        isStart={isStart}
        isEnd={isEnd}
        isBetween={isBetween}
        selected={false}
      />
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={handleCancel}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: isMobile ? "92vw" : 380,
          },
        }}
      >
        <DialogContent sx={{ p: 0, pt: 1 }}>
          <DateCalendar
            value={currentValue}
            onChange={handleDaySelect}
            disableHighlightToday
            views={["year", "month", "day"]}
            openTo="day"
            slots={{ day: DayWithRange }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
            pt: 0,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={handleCancel}
            sx={{ textTransform: "none" }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleOk}
            sx={{ textTransform: "none" }}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
