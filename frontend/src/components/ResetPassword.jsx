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
import CheckMark from "../assets/CheckMarkSVG";

// 3 Backend Tasks (Ctrl+F "BTASK")
export default function ResetPassword({ open, handleClose }) {
  const [page, setPage] = useState(3);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const closeDialog = () => {
    handleClose();
  };

  return (
    <Dialog
      onClose={closeDialog}
      open={open}
      sx={{
        "& .MuiDialog-paper": { overflowX: "hidden" },
        "& .MuiDialog-root": { overflowX: "hidden" },
      }}
    >
      <Box sx={{ padding: 3, paddingBottom: 6 }}>
        {page == 1 && (
          <FirstPage
            setPage={setPage}
            handleClose={closeDialog}
            setEmail={setEmail}
          ></FirstPage>
        )}
        {page == 2 && (
          <SecondPage handleClose={closeDialog} setPage={setPage} setCode={setCode}></SecondPage>
        )}
        {page == 3 && (
          <ThirdPage
            handleClose={closeDialog}
            setPage={setPage}
            email={email}
            code={code}
          ></ThirdPage>
        )}
        {page == 4 && (
          <FourthPage handleClose={closeDialog} setPage={setPage}></FourthPage>
        )}
      </Box>
    </Dialog>
  );
}

const FirstPage = ({ setPage, handleClose, setEmail }) => {
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
        "http://localhost:8080/api/password/forgot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      // handle successful cases where the email was sent
      if (response.ok) {
        setEmail(formData["email"]);
        setPage(2);
      } else {
        // Handle case where email failed to send
        const status = { ...submitStatus };
        status.success = false;
        status.msg = data.error;
        setSubmitStatus(status);
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
    }

    /***
       * BTASK
       * -------
       * Send a verification code to an email address using `data`.
       *
       * Example data
       * ------
       * 
       {
    "email": "enibalo2@gmail.com"
      }

       */
  };

  return (
    <>
      <DialogTitle sx={{ padding: 0, width: "520px", minWidth: "fit-content" }}>
        Please enter your email.
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
          <Stack spacing={1} sx={{ height: "fit-content" }}>
            <InputField
              placeholder={"joe.doe@ucalgary.ca"}
              label={"Email"}
              errorMsg={errors["email"] ? errors["email"].message : null}
              {...register("email", {
                required: "Email is required.",
                maxLength: {
                  value: 255,
                  message: "Maximum length of 255 characters.",
                },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email. Ex: xxx@gmail.com",
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
              {submitStatus.msg}
            </FormHelperText>
          </Stack>
          <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
            <CustomButton color="black" onClick={handleClose}>
              Exit
            </CustomButton>
            <CustomButton type="submit">Next</CustomButton>
          </Stack>
        </Stack>
      </form>
    </>
  );
};

const SecondPage = ({ setPage, handleClose, setCode }) => {
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
        "http://localhost:8080/api/password/verify",
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
        setCode(formData["code"]);
        setPage(3);
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
        <Stack spacing={2}>
          <Stack spacing={1}>
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
                  visibility:
                    submitStatus.success == null ? "hidden" : "visible",
                },
              ]}
            >
              {submitStatus.msg + ". "}
              Please try again.
            </FormHelperText>
          </Stack>
          <Stack direction={"row"} sx={{ justifyContent: "space-between" }}>
            <CustomButton color="black" onClick={handleClose}>
              Exit
            </CustomButton>
            <CustomButton color="black" type="submit">
              Next
            </CustomButton>
          </Stack>
        </Stack>
      </form>
    </>
  );
};

const ThirdPage = ({ setPage, handleClose, email, code }) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

 

  const [submitStatus, setSubmitStatus] = useState({
    success: null,
    msg: "No message.",
  });

  const onSubmit = async (formData) => {
    delete formData["password"];
    formData["email"] = email;
    formData["code"] = code;
   
    try {
      const response = await fetch(
        "http://localhost:8080/api/password/reset",
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
         setPage(4);
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
      <DialogTitle sx={{ padding: 0, width: "520px", minWidth: "fit-content" }}>
        Change your password.
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
          <Stack spacing={1}>
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
                visibility: submitStatus.success != null ? "visible" : "hidden",
              },
            ]}
          >
            {submitStatus.msg + ". "}Please try again.
          </FormHelperText>
          </Stack>
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

const FourthPage = ({ handleClose }) => {
  return (
    <>
      <Stack spacing={2}>
        <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
          <CheckMark></CheckMark>
        </Stack>
        <DialogTitle
          sx={(theme) => ({
            padding: 0,
            color: theme.palette.success.main,
            width: "520px",
            minWidth: "fit-content",
            textAlign: " center",
          })}
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
