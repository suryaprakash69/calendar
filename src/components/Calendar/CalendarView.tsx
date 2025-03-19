import  { useState } from "react";
import {
  format,
  parseISO,
  addDays,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";
import {
  Grid,
  Paper,
  Typography,
  Box,
  IconButton,
  Popover,

} from "@mui/material";
import { CalendarHeader } from "./CalendarHeader";
import useListCalendar from "../queryHook/useListCalendar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InterviewDialog from "./InterviewDialog";
import { EventData } from "../../types/calendar";



export const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month" | "year">("week");
  const { data = [] } = useListCalendar();
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEventClick = (event: EventData, target: HTMLElement) => {
    if (target instanceof HTMLElement) {
      setSelectedEvent(event);
      setAnchorEl(target);
    }
  };

  const handleClosePopover = () => {
    setSelectedEvent(null);
    setAnchorEl(null);
  };

  const handlePrevious = () => {
    if (view === "week") {
      setCurrentDate((prev) => addDays(prev, -7));
    } else if (view === "month") {
      setCurrentDate((prev) => subMonths(prev, 1));
    } else if (view === "day") {
      setCurrentDate((prev) => addDays(prev, -1));
    }
  };

  const handleNext = () => {
    if (view === "week") {
      setCurrentDate((prev) => addDays(prev, 7));
    } else if (view === "month") {
      setCurrentDate((prev) => addMonths(prev, 1));
    } else if (view === "day") {
      setCurrentDate((prev) => addDays(prev, 1));
    }
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) => i); 

  const getEventsForTimeAndDay = (time: number, date: Date) => {
    if (!Array.isArray(data)) return [];
    return data.filter((event) => {
      const eventDate = parseISO(event.start);
      return eventDate.getHours() === time && isSameDay(eventDate, date);
    });
  };

  const getEventsForDay = (date: Date) => {
    if (!Array.isArray(data)) return []; 
    return data.filter((event) => isSameDay(parseISO(event.start), date));
  };

  const renderEventCard = (event: EventData, isSelected: boolean) => (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: isSelected ? "rgb(135, 178, 248)" : "#ffffff",
        padding: "0.5rem",
        borderLeft: "10px solid #3b82f6",
        width: "200px",
        marginBottom: "0.25rem",
        cursor: "pointer",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="body1" fontWeight={500}>
          {event.job_id?.jobRequest_Title || "No Title"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Interviewer: {event.user_det?.handled_by?.firstName || "Unknown"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Time: {format(parseISO(event.start), "hh:mm a")} -{" "}
          {format(parseISO(event.end), "hh:mm a")}
        </Typography>
      </Box>
    </Paper>
  );

  const renderDayView = () => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 5rem)",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            borderBottom: "1px solid #d1d5db",
            position: "sticky",
            top: 0,
            backgroundColor: "#ffffff",
            zIndex: 1,
          }}
        >
          <Box sx={{ width: "5rem" }} />
          <Box sx={{ flex: 1, padding: "0.5rem", textAlign: "center" }}>
            <Typography variant="body1" color="textSecondary">
              {format(currentDate, "dd MMM")}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {format(currentDate, "EEEE")}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flex: 1 }}>
          <Box
            sx={{
              width: "5rem",
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
            }}
          >
            {timeSlots.map((hour) => (
              <Box
                key={hour}
                sx={{
                  height: "6rem",
                  borderBottom: "1px solid #d1d5db",
                  paddingLeft: "1rem",
                  paddingTop: "4rem",
                }}
              >
                <Typography variant="body2" color="primary">
                  {hour % 12 || 12} {hour >= 12 ? "PM" : "AM"}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              flex: 1,
              borderLeft: "1px solid #d1d5db",
              position: "relative",
            }}
          >
            {timeSlots.map((hour) => {
              const events = getEventsForTimeAndDay(hour, currentDate);
              return (
                <Box
                  key={`${currentDate.toISOString()}-${hour}`}
                  sx={{
                    height: "6rem",
                    borderBottom: "1px solid #d1d5db",
                    position: "relative",
                  }}
                >
                  {events.map((event, index) => {
                    const top = index * 70;
                    return (
                      <Box
                        key={event.id}
                        sx={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          margin: "0.25rem",
                          top: `${top}px`,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event, e.currentTarget);
                        }}
                      >
                        {renderEventCard(event, selectedEvent?.id === event.id)}
                      </Box>
                    );
                  })}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    );
  };

  const renderWeekView = () => {
    const weekDays = Array.from({ length: 7 }, (_, i) =>
      addDays(startOfWeek(currentDate), i)
    );

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 5rem)",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            borderBottom: "1px solid #d1d5db",
            position: "sticky",
            top: 0,
            backgroundColor: "#ffffff",
            zIndex: 1,
          }}
        >
          <Box sx={{ width: "5rem" }} />
          {weekDays.map((day) => (
            <Box
              key={day.toISOString()}
              sx={{
                flex: 1,
                padding: "0.5rem",
                textAlign: "center",
                borderLeft: "1px solid #d1d5db",
              }}
            >
              <Typography variant="body1" color="textSecondary">
                {format(day, "dd MMM")}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {format(day, "EEEE")}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: "flex", flex: 1 }}>
          <Box
            sx={{
              width: "5rem",
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
            }}
          >
            {timeSlots.map((hour) => (
              <Box
                key={hour}
                sx={{
                  height: "6rem",
                  borderBottom: "1px solid #d1d5db",
                  paddingLeft: "1rem",
                  paddingTop: "4rem",
                }}
              >
                <Typography variant="body2" color="primary">
                  {hour % 12 || 12} {hour >= 12 ? "PM" : "AM"}
                </Typography>
              </Box>
            ))}
          </Box>

          {weekDays.map((day) => (
            <Box
              key={day.toISOString()}
              sx={{ flex: 1, borderLeft: "1px solid #d1d5db" }}
            >
              {timeSlots.map((hour) => {
                const events = getEventsForTimeAndDay(hour, day);
                return (
                  <Box
                    key={`${day.toISOString()}-${hour}`}
                    sx={{
                      height: "6rem",
                      borderBottom: "1px solid #d1d5db",
                      position: "relative",
                    }}
                  >
                    {events.map((event, index) => {
                      const top = index * 70;
                      return (
                        <Box
                          key={event.id}
                          sx={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            margin: "0.25rem",
                            top: `${top}px`,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event, e.currentTarget);
                          }}
                        >
                          {renderEventCard(event, selectedEvent?.id === event.id)}
                        </Box>
                      );
                    })}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  const renderMonthView = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({
      start: startOfWeek(start),
      end: endOfWeek(end),
    });

    return (
      <Box sx={{ height: "calc(100vh - 5rem)", overflow: "auto" }}>
        <Grid container columns={7}>
          {[
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ].map((day) => (
            <Grid item xs={1} key={day}>
              <Typography
                variant="body1"
                fontWeight={500}
                color="textSecondary"
                sx={{ padding: "0.5rem", textAlign: "center" }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        <Grid container columns={7}>
          {days.map((day) => {
            const eventsForDay = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <Grid
                item
                xs={1}
                key={day.toISOString()}
                sx={{
                  minHeight: "120px",
                  padding: "0.5rem",
                  borderBottom: "1px solid #d1d5db",
                  borderRight: "1px solid #d1d5db",
                  backgroundColor: isCurrentMonth ? "#ffffff" : "#f9fafb",
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight={500}
                  color={isCurrentMonth ? "textPrimary" : "textSecondary"}
                >
                  {format(day, "d")}
                </Typography>
                <Box
                  sx={{
                    marginTop: "0.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  {eventsForDay.map((event) => (
                    <Box
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event, e.currentTarget);
                      }}
                    >
                      {renderEventCard(event, selectedEvent?.id === event.id)}
                    </Box>
                  ))}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ backgroundColor: "#ffffff", height: "100%" }}>
      <CalendarHeader
        currentDate={currentDate}
        onPrevious={handlePrevious}
        onNext={handleNext}
        view={view}
        onViewChange={setView}
      />

      {view === "day" && renderDayView()}
      {view === "week" && renderWeekView()}
      {view === "month" && renderMonthView()}

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{ marginLeft: "20px" }}
      >
        {selectedEvent && (
          <Paper
            elevation={3}
            sx={{
              padding: "1rem",
              backgroundColor: "#ffffff",
              borderLeft: "10px solid #3b82f6",
              width: "300px",
              cursor: "pointer",
            }}
            onClick={handleOpen}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "space-between",
              }}
            >
              <Typography fontWeight={600}>
                {selectedEvent.job_id?.jobRequest_Title || "No Title"}
              </Typography>
              <div>
                <IconButton>
                  <EditIcon sx={{ fontSize: "20px" }} />
                </IconButton>
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </div>
            </Box>
            <Typography color="textSecondary" marginBottom={1}>
              {selectedEvent.summary} | Interviewer:{" "}
              {selectedEvent.user_det?.handled_by?.firstName || "Unknown"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Time: {format(parseISO(selectedEvent.start), "hh:mm a")} -{" "}
              {format(parseISO(selectedEvent.end), "hh:mm a")}
            </Typography>
          </Paper>
        )}
      </Popover>
      <InterviewDialog
        open={open}
        handleClose={handleClose}
        selectedEvent={selectedEvent}
      />
    </Box>
  );
};