import { useState } from "react";
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
  const [selectedEvents, setSelectedEvents] = useState<EventData[] | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEventClick = (events: EventData[], target: HTMLElement) => {
    if (events.length === 1) {
      setSelectedEvents(events);
      handleOpen();
    } else {
      setSelectedEvents(events);
      setAnchorEl(target);
    }
  };

  const handleClosePopover = () => {
    setSelectedEvents(null);
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

  const renderEventCard = (events: EventData[], isSelected: boolean) => {
    const event = events[0]; // Use the first event for display
    return (
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: isSelected ? "rgb(135, 178, 248)" : "#ffffff",
          padding: "0.5rem",
          borderLeft: "10px solid #3b82f6",
          width: "198px",
          marginBottom: "0.25rem",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleEventClick(events, e.currentTarget);
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" fontWeight={500}>
            {event.job_id?.jobRequest_Title || "No Title"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Interviewer: {event.user_det?.handled_by?.firstName || "Unknown"}
          </Typography>
          <Typography  color="textSecondary" sx={{fontSize:"12px"}}>
            Time: {format(parseISO(event.start), "hh:mm a")} -{" "}
            {format(parseISO(event.end), "hh:mm a")}
          </Typography>
        </Box>
        {events.length > 1 && (
          <Box
            sx={{
              position: "absolute",
              top: "0.25rem",
              right: "0.25rem",
              backgroundColor: "rgb(202, 228, 4)",
              color: "rgb(2, 2, 0)",
              borderRadius: "50%",
              width: "1.5rem",
              height: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
            }}
          >
            {events.length}
          </Box>
        )}
      </Paper>
    );
  };

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
              const groupedEvents = events.reduce((acc, event) => {
                const key = `${format(parseISO(event.start), "yyyy-MM-dd-HH")}`;
                if (!acc[key]) {
                  acc[key] = [];
                }
                acc[key].push(event);
                return acc;
              }, {} as Record<string, EventData[]>);

              return (
                <Box
                  key={`${currentDate.toISOString()}-${hour}`}
                  sx={{
                    height: "6rem",
                    borderBottom: "1px solid #d1d5db",
                    position: "relative",
                  }}
                >
                  {Object.values(groupedEvents).map((group, index) => {
                    const top = index * 70;
                    return (
                      <Box
                        key={group[0].id}
                        sx={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          margin: "0.25rem",
                          top: `${top}px`,
                        }}
                      >
                        {renderEventCard(
                          group,
                          selectedEvents?.some((e) => e.id === group[0].id) ??
                            false
                        )}
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
                const groupedEvents = events.reduce((acc, event) => {
                  const key = `${format(
                    parseISO(event.start),
                    "yyyy-MM-dd-HH"
                  )}`;
                  if (!acc[key]) {
                    acc[key] = [];
                  }
                  acc[key].push(event);
                  return acc;
                }, {} as Record<string, EventData[]>);

                return (
                  <Box
                    key={`${day.toISOString()}-${hour}`}
                    sx={{
                      height: "6rem",
                      borderBottom: "1px solid #d1d5db",
                      position: "relative",
                    }}
                  >
                    {Object.values(groupedEvents).map((group, index) => {
                      const top = index * 70;
                      return (
                        <Box
                          key={group[0].id}
                          sx={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            margin: "0.25rem",
                            top: `${top}px`,
                          }}
                        >
                          {renderEventCard(
                            group,
                            selectedEvents?.some((e) => e.id === group[0].id) ??
                              false
                          )}
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
            const groupedEvents = eventsForDay.reduce((acc, event) => {
              const key = `${format(parseISO(event.start), "yyyy-MM-dd-HH")}`;
              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(event);
              return acc;
            }, {} as Record<string, EventData[]>);

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
                  {Object.values(groupedEvents).map((group) => (
                    <Box
                      key={group[0].id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(group, e.currentTarget);
                      }}
                    >
                      {renderEventCard(
                        group,
                        selectedEvents?.some((e) => e.id === group[0].id) ??
                          false
                      )}
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
        {selectedEvents && (
          <div>
            {selectedEvents.map((event) => (
              <Paper
                key={event.id}
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
                <Box sx={{ marginBottom: "1rem" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography fontWeight={600}>
                      {event.job_id?.jobRequest_Title || "No Title"}
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
                    {event.summary} | Interviewer:{" "}
                    {event.user_det?.handled_by?.firstName || "Unknown"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Date: {format(parseISO(event.start), "dd MMM yy")} | Time:{" "}
                    {format(parseISO(event.start), "hh:mm a")} -{" "}
                    {format(parseISO(event.end), "hh:mm a")}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </div>
        )}
      </Popover>
      <InterviewDialog
        open={open}
        handleClose={handleClose}
        selectedEvent={selectedEvents?.[0] || null}
      />
    </Box>
  );
};