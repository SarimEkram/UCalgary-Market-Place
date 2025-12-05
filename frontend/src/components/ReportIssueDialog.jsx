                                                                          
import { useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Tabs,
  Tab,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import CustomButton from "../components/CustomButton";

export default function ReportIssueDialog({
  open,
  onClose,
  onSubmit,       
  loading = false 
}) {
  const [reportType, setReportType] = useState("user");
  const [reason, setReason] = useState("inappropriate");

  const handleChangeReportType = (_event, newVal) => {
    if (newVal !== null) {
      setReportType(newVal);
    }
  };

  const handleChangeReason = (_event, newVal) => {
    if (newVal !== null) {
      setReason(newVal);
    }
  };

  const handleSubmit = () => {
    if (!onSubmit) {
      onClose();
      return;
    }

    onSubmit({
      reportType, 
      reason,    
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: "12px",
          p: 1,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: 15,
          lineHeight: 1.5,
          pb: 1,
          mb: 1,
        }}
      >
        Thank you for reporting this claim. We will do our utmost to resolve the
        situation.
      </DialogTitle>

      <Divider sx={{ mb: 1.25 }} />

      <DialogContent sx={{ pt: 0 }}>
        <Typography variant="body2" sx={{ mb: 0.5, fontSize: 14, mt: 1 }}>
          Which would you like to report ?
        </Typography>

        <Tabs
          value={reportType}
          onChange={handleChangeReportType}
          sx={{
            minHeight: 24,
            mb: 2,
            "& .MuiTab-root": {
              minHeight: 24,
              fontSize: 14,
              fontWeight: 500,
              color: "text.secondary",
              textTransform: "none",
            },
            "& .Mui-selected": {
              color: "text.primary",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#D22C22",
              height: 2,
            },
          }}
        >
          <Tab label="User" value="user" />
          <Tab label="Post" value="post" />
        </Tabs>

        <Typography variant="body2" sx={{ mb: 1, fontSize: 14, mt: 2 }}>
          What best describes your complaint ?
        </Typography>

        <ToggleButtonGroup
          value={reason}
          exclusive
          onChange={handleChangeReason}
          sx={{
            display: "inline-flex",
            borderRadius: 2,
            border: "1px solid #E0E0E0",
            height: 30,
            mt: 1,

            "& .MuiToggleButtonGroup-grouped": {
              margin: 0,
              border: 0,
              borderRadius: 0,
            },

            "& .MuiToggleButton-root": {
              fontSize: 12,
              fontWeight: 500,
              minHeight: 30,
              textTransform: "none",
              padding: "4px 12px",
              backgroundColor: "#F3F3F3",
              borderRadius: 1,
              border: "none",
              color: "rgba(0,5,9,0.89)",
            },

            "& .MuiToggleButton-root + .MuiToggleButton-root": {
              borderLeft: "1px solid #D3D3D7",
            },

            "& .MuiToggleButton-root.Mui-selected": {
              backgroundColor: "#a1a1a1ff",
              color: "rgba(0,5,9,0.89)",
              fontWeight: 600,
              boxShadow: "none",
              outline: "none",
            },

            "& .MuiToggleButton-root.Mui-selected + .MuiToggleButton-root": {
              borderLeft: "1px solid #D3D3D7",
            },
          }}
        >
          <ToggleButton value="inappropriate">Inappropriate</ToggleButton>
          <ToggleButton value="scam">Scam</ToggleButton>
          <ToggleButton value="criminal" sx={{lineHeight:1 }} >Criminal Behavior</ToggleButton>
        </ToggleButtonGroup>

        {/* Bottom buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 3,                                        
            columnGap: 5,
          }}
        >
          <CustomButton
            color="red"
            onClick={onClose}
            disabled={loading}
            style={{
              "&&": {
                width: 200,
                height: 28,
                minHeight: 26,
                borderRadius: 3,
                padding: 0,
                bgcolor: "black",
                fontSize: "12",
              },
            }}
          >
            Exit
          </CustomButton>

          <CustomButton
            color="red"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              "&&": {
                width: 200,
                height: 28,
                minHeight: 26,
                borderRadius: 3,
                padding: 0,
                bgcolor: "black",
                fontSize: "12",
                backgroundColor: "#D22C22",
              },
            }}
          >
            {loading ? "Reporting..." : "Report"}
          </CustomButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
