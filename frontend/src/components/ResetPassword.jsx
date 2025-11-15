import {
  Box,
  Dialog,
  DialogTitle,
  Divider,
  FormHelperText,
  Stack,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import CustomButton from "./CustomButton";
import InputField from "./InputField";
import CheckMark from "../assets/CheckMarkSVG";

export default function ResetPassword({ open, handleClose }) {
  console.log("dupe for messaging the backend to send an email....");

  const [page, setPage] = useState(1);

  return (
    <Dialog onClose={handleClose} open={open}>
      <Box sx={{ padding: 3, paddingBottom: 6 }}>
        {page == 1 && (
          <FirstPage setPage={setPage} handleClose={handleClose}></FirstPage>
        )}
        {page == 2 && (
          <SecondPage handleClose={handleClose} setPage={setPage}></SecondPage>
        )}
        {page == 3 && (
          <ThirdPage handleClose={handleClose} setPage={setPage}></ThirdPage>
        )}
      </Box>
    </Dialog>
  );
}

const FirstPage = ({ setPage, handleClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [failed, setFailed] = useState(false);

  const onSubmit = (data) => {
    console.log("dupe for checking verification code using this data: ", data);
    const validated = true;
    //fake succesful response from backend
    if (validated == false) {
      setFailed(true);
    } else {
      setPage(2);
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
          <CustomButton color="black" type="submit">
            Next
          </CustomButton>
        </Stack>
      </form>
    </>
  );
};

const SecondPage = ({ setPage, handleClose }) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const [failed, setFailed] = useState(false);

  const onSubmit = (data) => {
    console.log("mssging backend to change the password using this data...", data);
    delete data["newPassword"];
    const success = true;
    // fake succesfsul response frmo backend 
    if (success == false) {
      setFailed(true);
    } else {
      setPage(3);
    }
  };

  const PassHelpText = () => {
    return (
      <Stack
        component={"ul"}
        sx={{
          listStylePosition: "inside",
          paddingLeft: 0,
        }}
      >
        <Box component={"li"}>8-20 characters</Box>
        <Box component={"li"}>Has at least 1 number</Box>
        <Box component={"li"}>
          Has at least 1 special character (!@#$%^&*(),.?:{}|<></>)
        </Box>
      </Stack>
    );
  };

  const validatePasswords = () => {
    const passwords = getValues(["newPassword", "password"]);
    const ans = passwords[0] == passwords[1] ? true : "Passwords do not match.";
    return ans;
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
        <Stack spacing={2}>
          <InputField
            placeholder={"New Password"}
            label={"Password"}
            inputProps={{ type: "password" }}
            helpText={<PassHelpText></PassHelpText>}
            errorMsg={errors["password"] ? errors["password"].message : null}
            {...register("password", {
              required: "Password is required.",
              minLength: {
                value: 8,
                message: "Miniumum length of 8 characters.",
              },
              maxLength: {
                value: 20,
                message: "Maxiumum length of 20 characters.",
              },
              pattern: {
                value: /^(?=.*\d)(?=.*[!@#$%^&*(),.?:{}|<>]).*$/,
                message:
                  "Must have at least one number and one special character (!@#$%^&*(),.?:{}|<></>).",
              },
            })}
          ></InputField>
          <InputField
            placeholder={"New Password"}
            label={"Re-enter Your Password"}
            inputProps={{ type: "password" }}
            errorMsg={
              errors["newPassword"] ? errors["newPassword"].message : null
            }
            {...register("newPassword", {
              required: "Confirming password is required.",
              validate: validatePasswords,
            })}
          ></InputField>
          <FormHelperText
            error={true}
            sx={[
              {
                textAlign: "center",
                fontSize: "1rem",
                visibility: failed ? "visible" : "hidden",
              },
            ]}
          >
            Failed to reset password.<br></br>Please try again.
          </FormHelperText>
          <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
            <CustomButton color="black" onClick={handleClose}>
              Exit
            </CustomButton>
            <CustomButton type="submit">Save Changes</CustomButton>
          </Stack>
        </Stack>
      </form>
    </>
  );
};

const ThirdPage = ({ handleClose }) => {
  return (
    <>
      <Stack spacing={2}>
        <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
          <CheckMark></CheckMark>
        </Stack>
        <DialogTitle
          sx={(theme) => ({ padding: 0, color: theme.palette.success.main })}
        >
          Password change was succesful.
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
        <CustomButton
          sx={() => {
            width: "100%";
          }}
          color="black"
          onClick={handleClose}
        >
          Exit
        </CustomButton>
      </Stack>
    </>
  );
};
