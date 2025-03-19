import { Box, Typography, Button, Tabs, Tab } from "@mui/material";
import { format, startOfWeek, endOfWeek } from "date-fns";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Plus } from "lucide-react";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  view: "day" | "week" | "month" | "year";
  onViewChange: (view: "day" | "week" | "month" | "year") => void;
}

export const CalendarHeader = ({
  currentDate,
  onPrevious,
  onNext,
  view,
  onViewChange,
}: CalendarHeaderProps) => {
  // Helper function to get the ordinal suffix
  const getOrdinalSuffix = (day: number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = day % 100;
    return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
  };

  // Helper function to format dates with ordinal suffix
  const formatWithOrdinal = (date: Date) => {
    const day = format(date, "dd");
    const suffix = getOrdinalSuffix(parseInt(day, 10));
    return (
      <>
        {day}
        <sup style={{ fontSize: "0.6em" }}>{suffix}</sup>
      </>
    );
  };

  // Function to get date range text
  const getDateRangeText = () => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy");
    } else if (view === "week") {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return (
        <>
          {formatWithOrdinal(start)} {format(start, "MMMM")} to{" "}
          {formatWithOrdinal(end)} {format(end, "MMMM, yyyy")}
        </>
      );
    } else {
      return (
        <>
          {formatWithOrdinal(currentDate)} {format(currentDate, "MMMM, yyyy")}
        </>
      );
    }
  };
  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    onViewChange(newValue as "day" | "week" | "month" | "year");
  };
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={2}
      borderBottom="1px solid"
    >
      {/* Navigation Buttons */}
      <Box display="flex" alignItems="center" gap={2}>
        <Box display="flex" gap={1}>
          <Button
            onClick={onPrevious}
            variant="outlined"
            sx={{
              height: "40px",
              minWidth: "30px",
            }}
          >
            <ArrowBackIosIcon fontSize="small" />
          </Button>
          <Button
            onClick={onNext}
            variant="outlined"
            sx={{
              height: "40px",
              minWidth: "30px",
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </Button>
        </Box>
        {/* Current Date Box */}
        <Box
          sx={{
            boxShadow: 2,
            px: 2,
            borderRadius: 2,
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" color="primary">
            {format(currentDate, "dd")}
          </Typography>
        </Box>
      </Box>

      {/* Date Range Display */}
      <Typography variant="h4" component="div">
        {getDateRangeText()}
      </Typography>

      {/* View Selector and Create Button */}
      <Box display="flex" alignItems="center" gap={2}>
        <Tabs
          value={view}
          onChange={handleTabChange}
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 500,
              minWidth: "auto",
              padding: "4px 16px",
              color: "inherit", 
            },
            "& .Mui-selected": {
              color: "inherit", 
            },
          }}
        >
          <Tab label="Day" value="day" />
          <Tab label="Week" value="week" />
          <Tab label="Month" value="month" />
          <Tab label="Year" value="year" />
        </Tabs>

        <Button
          startIcon={<Plus />}
          onClick={() => console.log("Create Schedule clicked")}
          sx={{
            boxShadow: 2,
            color: "primary.main",
          }}
        >
          Create Schedule
        </Button>
      </Box>
    </Box>
  );
};
