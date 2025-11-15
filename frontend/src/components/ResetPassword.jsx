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

// 3 Backend Tasks (Ctrl+F "BTASK")
export default function ResetPassword({ open, handleClose }) {
  const [page, setPage] = useState(1);
  const [email, setEmail] = useState("")

  return (
    <Dialog onClose={handleClose} open={open} sx={{"& .MuiDialog-paper" :{overflowX: "hidden"}, "& .MuiDialog-root" :{overflowX: "hidden"}}}>
      <Box sx={{ padding: 3, paddingBottom: 6,}}>
        {page == 1 && (
          <FirstPage setPage={setPage} handleClose={handleClose} setEmail={setEmail}></FirstPage>
        )}
        {page == 2 && (
          <SecondPage handleClose={handleClose} setPage={setPage}></SecondPage>
        )}
        {page == 3 && (
          <ThirdPage handleClose={handleClose} setPage={setPage} email={email}></ThirdPage>
        )}
        {page == 4 && (
          <FourthPage handleClose={handleClose} setPage={setPage}></FourthPage>
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

  const onSubmit = (data) => {
    console.log(
      "mssging backend to send a verification code to a user email...",
      data
    );

    setEmail(data["email"]);
   
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
    
      setPage(2);
  };



  return (
    <>
      <DialogTitle sx={{ padding: 0, width: "520px", minWidth: "fit-content"}}>
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

const SecondPage = ({ setPage, handleClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [failed, setFailed] = useState(false);

  const onSubmit = (data) => {
    console.log("dupe for checking verification code using this data: ", data);
    /**
     * 
      BTASK
      -------
      Checking if a verification code is valid. 
      Setting the  `isValid` variable based on the results. 
      
       Example data
      ------------
            {
            "code": "12345678"
        }
     */
    const isValid = true;

    //fake succesful response from backend
    if (isValid == false) {
      setFailed(true);
    } else {
      setPage(3);
    }
  };

  return (
    <>
      <DialogTitle sx={{ padding: 0, width: "520px", minWidth: "fit-content"}}>
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

const ThirdPage = ({ setPage, handleClose, email }) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const [failed, setFailed] = useState(false);

  const onSubmit = (data) => {

    delete data["newPassword"];
    data["email"] = email;

    console.log(
      "mssging backend to change the password using this data...",
      data
    );
    /**
     * 
     BTASK
     ------
     Changing a user's password. 
     Set boolean variable `isSuccess` based on the results. 
     Example Data
     --------
     {
    "password": "password123#",
    "email": "enibalo2@gmail.com"
}
     */


    const isSuccess = true;
    // fake succesfsul response frmo backend
    if (isSuccess == false) {
      setFailed(true);
    } else {
      setPage(4);
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
       <DialogTitle sx={{ padding: 0, width: "520px", minWidth: "fit-content"}}>
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

const FourthPage = ({ handleClose }) => {
  return (
    <>
      <Stack spacing={2}>
        <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
          <CheckMark></CheckMark>
        </Stack>
        <DialogTitle
          sx={(theme) => ({ padding: 0, color: theme.palette.success.main, width: "520px", minWidth: "fit-content" })}
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
