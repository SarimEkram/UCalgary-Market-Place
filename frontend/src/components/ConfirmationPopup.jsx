import {
  Box,
  Dialog,
  DialogTitle,
  Divider,
  Stack
} from "@mui/material";
import { useState } from "react";
import CustomButton from "./CustomButton";

export default function ConfirmationPopup({ callBack, open, handleClose, warningMessage, executeFunction }) {
  return (
    <Dialog
      onClose={handleClose}
      open={open}
      sx={{
        "& .MuiDialog-paper": { overflowX: "hidden" },
        "& .MuiDialog-root": { overflowX: "hidden" },
      }}
    >
      <Box sx={{ padding: 3, paddingBottom: 6 }}>
        <FirstPage callBack={callBack} warningMessage={warningMessage} executeFunction={executeFunction} handleClose={handleClose}></FirstPage>
      </Box>
    </Dialog>
  );
}

const FirstPage = ({ callBack, handleClose,  warningMessage, executeFunction }) => {

  const [submitStatus, setSubmitStatus] = useState({
    success: null,
    msg: "No message.",
  });

  const onSubmit = async () => {
    try {
      const response = await executeFunction();
      const data = await response.json();
      // handle successful case
      const ok = response.ok; 
      callBack(ok);
      if (ok) {
        handleClose();
      } else {
        // Handle failures
        const status = { ...submitStatus };
        status.success = false;
        status.msg = data.error;
        setSubmitStatus(status);
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
    }
  };
  return (
    <>
      <DialogTitle sx={{ padding: 0, width: "520px", minWidth: "fit-content" }}>
       {warningMessage}
      </DialogTitle>
      <Divider
        variant="fullWidth"
        sx={(theme) => ({
          boxSizing: "border-box",
          borderBottom: theme.palette.dividerWidth,
          borderColor: theme.palette.divider,
          marginTop: 3,
          marginBottom: 3,
        })}
      ></Divider>
      <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "center"}}>
        <CustomButton color="black" onClick={handleClose}>Exit</CustomButton>
        <CustomButton onClick={onSubmit}>Confirm</CustomButton>
      </Stack>
    </>
  );
};
