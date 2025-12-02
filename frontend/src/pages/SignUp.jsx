import {
  Box,
  Container,
  FormHelperText,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import ProfileIcon from "../assets/ProfileIconSVG";
import CustomButton from "../components/CustomButton";
import Header from "../components/Header";
import InputField from "../components/InputField";
import { useForm } from "react-hook-form";
import { useState } from "react";
import VerifyNewUser from "../components/VerifyNewUser";
import { Link as RouterLink, useNavigate } from "react-router";

// 2 Backend Task(s) (Ctrl+F "TODO")
export default function SignUp() {
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

  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    delete formData["newPassword"];
    formData["code"] = verified.code; 

    if (verified.status) {
      try {
      const response = await fetch("/api/registration/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        //re-direct to login
        navigate("/");
      } else{
        //set status of 
        setSubmitStatus({success: false, msg: data.error})
      }
    } catch (error){
      alert("An error occurred. Please try again later.");
    }  
      
    } else {
      try {
      const emailData = { email: formData["email"] };
      const response = await fetch("/api/registration/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      const data = await response.json();
      if (response.ok) {
        //open the verification code popup 
        setOpen(true);
      } else{
        //set status of 
        setSubmitStatus({success: false, msg: data.error})
      }
    } catch (error){
      alert("An error occurred. Please try again later.");
    }  
      
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

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const [verified, setVerified] = useState({status: false, code: null});

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
              autoComplete={"email"}
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
              placeholder={"New Password"}
              label={"Password"}
              autoComplete={"new-password"}
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
              autoComplete={"new-password"}
              errorMsg={
                errors["newPassword"] ? errors["newPassword"].message : null
              }
              {...register("newPassword", {
                required: "Confirming password is required.",
                validate: validatePasswords,
              })}
            ></InputField>
            <InputField
              placeholder={"John"}
              label={"First Name"}
              autoComplete={"name"}
              inputProps={{ type: "text" }}
              errorMsg={
                errors["firstName"] ? errors["firstName"].message : null
              }
              {...register("firstName", {
                required: "First name is required.",
                pattern: {
                  value: /^[A-Za-z]+$/,
                  message: "Must only contain letters.",
                },
              })}
            ></InputField>
            <InputField
              placeholder={"Doe"}
              label={"Last Name"}
              autoComplete={"family-name"}
              inputProps={{ type: "text" }}
              errorMsg={errors["lastName"] ? errors["lastName"].message : null}
              {...register("lastName", {
                required: "Last name is required.",
                pattern: {
                  value: /^[A-Za-z]+$/,
                  message: "Must only contain letters.",
                },
              })}
            ></InputField>
            <CustomButton type="submit">Register</CustomButton>
          </Stack>
        </form>
        <Stack spacing={2} sx={styles.bottomContent}>
          <FormHelperText
            error={true}
            sx={[
              { textAlign: "center", fontSize: "1rem" },
              { visibility: submitStatus.success != null ? "visible" : "hidden" },
            ]}
          >
            {submitStatus.msg}<br></br>Please try again.
          </FormHelperText>
          <Stack direction="row" spacing={2} sx={styles.stackRow}>
            <Typography>Existing User ? </Typography>
            <RouterLink to="/">
              <Link
                component="div"
                sx={{
                  "& .MuiTypography-root": { textDecoration: "underline" },
                  "& .MuiLink-root": { textDecoration: "underline" },
                }}
                color="primary"
              >
                <Typography>Sign In</Typography>
              </Link>
            </RouterLink>
          </Stack>
        </Stack>
        <VerifyNewUser
          open={open}
          handleClose={handleClose}
          setVerified={setVerified}
        ></VerifyNewUser>
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
