import {
  Box,
  Container,
  FormHelperText,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ProfileIcon from "../assets/ProfileIconSVG";
import CustomButton from "../components/CustomButton";
import Header from "../components/Header";
import InputField from "../components/InputField";
import ResetPassword from "../components/ResetPassword";

import { Link as RouterLink } from "react-router";
// 1 Backend Tasks (Ctrl+F "BTASK")
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loginFailed, setLoginFailed] = useState(false);
  const onSubmit = (data) => {
    console.log("send a login request to the server... using this data:", data);
    /**
     * 
     BTASK
     ------
     Validating a login attempt.
     Setting the variable `success` based on the results.   

     Example Data
     --------
     {
    "email": "enibalo2@gmail.com",
    "password": "butter123#"
    
    }
     */

    const success = true;
    if (success) {
      //navigate to home page
    } else {
      setLoginFailed(true);
    }
  };

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Stack id="login" direction="column" spacing={2} sx={styles.page}>
      <Header></Header>
      <Container maxWidth={"sm"} sx={styles.main}>
        <Box sx={styles.icon}>
          <ProfileIcon></ProfileIcon>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack direction="column" component={"div"} spacing={4}>
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
            <InputField
              placeholder={"Password"}
              label={"Password"}
              inputProps={{ type: "password" }}
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
              })}
            ></InputField>
            <CustomButton type="submit">Login</CustomButton>
          </Stack>
        </form>
        <Stack spacing={2} sx={styles.bottomContent}>
          <FormHelperText
            error={true}
            sx={[
              { textAlign: "center", fontSize: "1rem" },
              { visibility: loginFailed ? "visible" : "hidden" },
            ]}
          >
            Email or password was invalid.<br></br>Please try again.
          </FormHelperText>
          <Stack direction="row" spacing={2} sx={styles.stackRow}>
            <Typography>New User ? </Typography>
            <RouterLink to="/signup">
              <Link
                component="div"
                sx={{
                  "& .MuiTypography-root": { textDecoration: "underline" },
                  "& .MuiLink-root": { textDecoration: "underline" },
                }}
                color="primary"
              >
                <Typography>Sign Up</Typography>
              </Link>
            </RouterLink>
          </Stack>
          <Stack direction="row" sx={styles.stackRow}>
            {/*TODO: Make links clickablle, handle redirection */}
            <Link
              component={"div"}
              color="textSecondary"
              sx={{ cursor: "pointer" }}
              onClick={() => {
                setOpen(true);
              }}
            >
              <Typography>Forgot Password</Typography>
            </Link>
          </Stack>
        </Stack>
        <ResetPassword open={open} handleClose={handleClose}></ResetPassword>
      </Container>
    </Stack>
  );
}

const styles = {
  icon: {
    alignSelf: "center",
    paddingBottom: 5,
  },
  page: {
    bgcolor: "background.paper",
    minHeight: "100vh",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "space-between",
    padding: 10,
  },

  bottomContent: {
    paddingTop: 2,
  },

  stackRow: {
    justifyContent: "center",
    alignItems: "center",
  },
};
