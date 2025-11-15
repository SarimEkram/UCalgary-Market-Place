import {
  Box,
  Dialog,
  DialogTitle,
  Divider,
  FormHelperText,
  Stack
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import CustomButton from "./CustomButton";
import InputField from "./InputField";

export default function VerifyNewUser({ open, handleClose, setVerified }) {
  console.log("dupe for messaging the backend to send an email....");
  return (
    <Dialog onClose={handleClose} open={open}>
      <Box sx={{ padding: 3, paddingBottom: 6 }}>
          <FirstPage setVerified={setVerified} handleClose={handleClose}></FirstPage>
      </Box>
    </Dialog>
  );
}

const FirstPage = ({  handleClose, setVerified }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [failed, setFailed] = useState(false);

  const onSubmit = (data) => {
    console.log("dupe for checking verification code using this data: ", data);
    // fake a succesful rsponse from the backend
    const validated = true;
    if (validated == false) {
      setFailed(true);
    } else {
      setVerified(true);
      handleClose();
    }
  };

  return (
    <>
      <DialogTitle sx={{ padding: 0 }}>
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
          sx={[
            {
              textAlign: "center",
              fontSize: "1rem",
              paddingTop: 1,
              paddingBottom: 1,
              visibility: failed ? "visible" : "hidden",
            },
          ]}
        >
          Verification code was invalid.<br></br>Please try again.
        </FormHelperText>
        <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
          <CustomButton color="black" onClick={handleClose}>
            Exit
          </CustomButton>
          <CustomButton type="submit">
            Submit
          </CustomButton>
        </Stack>
      </form>
    </>
  );
};


