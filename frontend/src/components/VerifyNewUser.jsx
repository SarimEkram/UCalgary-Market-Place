import {
  Box,
  Dialog,
  DialogTitle,
  Divider,
  FormHelperText,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "./CustomButton";
import InputField from "./InputField";

export default function VerifyNewUser({ open, handleClose, setVerified }) {
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
        <FirstPage
          setVerified={setVerified}
          handleClose={handleClose}
        ></FirstPage>
      </Box>
    </Dialog>
  );
}

const FirstPage = ({ handleClose, setVerified }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [submitStatus, setSubmitStatus] = useState({
    success: null,
    msg: "No message.",
  });

  const onSubmit = async (formData) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/registration/verify-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      // handle successful case
      if (response.ok) {
        setVerified({status: true, code: formData["code"]});
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
        Please enter the 8-digit code that was sent to your email.
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
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputField
          placeholder={""}
          label={"Verifcation Code"}
          inputProps={{ type: "text" }}
          errorMsg={errors["code"] ? errors["code"].message : null}
          {...register("code", {
            required: "Verification code is required.",
            minLength: {
              value: 8,
              message: "Verification code must be 8 characters. ",
            },
            maxLength: {
              value: 8,
              message: "Verification code must be 8 characters. ",
            },
          })}
        ></InputField>
        <FormHelperText
          error={true}
          sx={{
            marginTop: 1,
            visibility: submitStatus.success == null ? "hidden" : "visible",
            textAlign: "center",
          }}
        >
          {submitStatus.msg}.
        </FormHelperText>
        <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
          <CustomButton color="black" onClick={handleClose}>
            Exit
          </CustomButton>
          <CustomButton type="submit">Submit</CustomButton>
        </Stack>
      </form>
    </>
  );
};
