import { Dialog, DialogContent, Typography, Box, Button, Divider, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { EventData } from "../../types/calendar";
import { format, parseISO } from "date-fns";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import google_meet from "../../assets/google-meet.webp";

interface InterviewDialogProps {
  open: boolean;
  handleClose: () => void;
  selectedEvent: EventData | null; 
}

const InterviewDialog: React.FC<InterviewDialogProps> = ({
  open,
  handleClose,
  selectedEvent,
}) => {
  if (!selectedEvent) {
    return null; 
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <IconButton
        onClick={handleClose}
        sx={{
          position: "absolute",
          top: 1,
          right: 1,
          zIndex: 1,
          backgroundColor: "rgba(81, 196, 253, 0.8)",
          "&:hover": {
            backgroundColor: "rgba(10, 113, 165, 0.1)",
          },
        }}
      >
        <CloseIcon />
      </IconButton>
      <Box
        sx={{
          margin: "20px 20px 20px 20px",
          border: "1.5px solid rgb(170, 174, 179)",
        }}
      >
        <DialogContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                gap: 1,
                width: "100%"
              }}
            >
              <Typography variant="body1" gutterBottom>
                <strong>Interview With:</strong>{" "}
                {selectedEvent?.user_det?.candidate?.candidate_firstName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Position:</strong>{" "}
                {selectedEvent?.job_id?.jobRequest_Role}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Created By:</strong> {""}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Interview Date:</strong>
                {format(parseISO(selectedEvent.start), " dd MMM yy")} 
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Interview Time:</strong>
                {format(parseISO(selectedEvent.start), " hh")} -{" "}
                {format(parseISO(selectedEvent.end), "hh:mm a")}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Interview Via:</strong> Google Meet
              </Typography>
              <Button
                variant="outlined"
                endIcon={
                  <>
                    <VisibilityIcon />
                    <DownloadIcon />
                  </>
                }
                sx={{ textTransform: "none", width: "200px" }}
              >
                Resume.docx
              </Button>
              <Button
                variant="outlined"
                endIcon={
                  <>
                    <VisibilityIcon />
                    <DownloadIcon />
                  </>
                }
                sx={{ textTransform: "none", width: "200px" }}
              >
                Aadharcard
              </Button>
            </Box>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                gap: "10px"
              }}
            >
              <img src={google_meet} style={{ border: "1.5px solid rgb(170, 174, 179)", height: "150px", width: "150px" }} />
              <Button
                variant="contained"
                sx={{ textTransform: "none" }}
              >
                Join
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default InterviewDialog;