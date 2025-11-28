import {
  Box,
  Container,
  Divider,
  FormHelperText,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ProfileIcon from "../assets/ProfileIconSVG";
import CustomButton from "../components/CustomButton";
import Header from "../components/Header";
import InputField from "../components/InputField";
import DesktopNav from "../components/DesktopNav";
import MobileNav from "../components/MobileNav";
// 1 Backend Task(s) (Ctrl+F "TODO")
export default function MySettings() {
  //get user data from local storage
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: userData.email,
      firstName: userData.fname,
      lastName: userData.lname,
    },
  });

  const [submitStatus, setSubmitStatus] = useState({
    success: null,
    msg: "No message.",
  });

  const onSubmit = (data) => {
    delete data["newPassword"];

    console.log("send create user request to the backend...", data);

    /**
     * 
      TODO: BTASK
      ------- 
      Update a user account using `data` object. 
      Update the submitstatus ased on the status.
      
      Example data
      ------------
      {
      "email": "enibalo2@gmail.com",
      "password": "butter123#",
      "firstName": "eni",
      "lastName": "balogun"
      }

     */
  };

  //component that renders the password rules
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

  //makes sure that new password meets password requirements 
  const validateNewPassword = () => {
    const passwords = getValues(["password"]);

    if (passwords[0] === "") {
      return true;
    } else if (passwords[0].length < 8) {
      return "Miniumum length of 8 characters.";
    } else if (passwords[0].length > 20) {
      return "Maxiumum length of 20 characters.";
    } else if ( !passwords[0].match(/^(?=.*\d)(?=.*[!@#$%^&*(),.?:{}|<>]).*$/) ) {
      return "Must have at least one number and one special character (!@#$%^&*(),.?:{}|<></>).";
    }
    return true;
  };

  //make sure that password fields match 
  const validateConfirmPassword = () => {
    const passwords = getValues(["newPassword", "password"]);
    return passwords[0] === passwords[1] ? true : "Passwords do not match.";
  };

  //a styled divider for easy re-use
  const CustomDivider = ({ props, style, variant, thin, marginThin }) => (
    <Box>
      <Divider
        variant={variant ? variant : "fullWidth"}
        {...props}
        sx={(theme) => ({
          borderBottom: thin ? 0.75 : theme.palette.dividerWidth,
          borderColor: theme.palette.divider,
          boxSizing: "border-box",
          marginTop: marginThin ? 0 : 3,
          marginBottom: marginThin ? 0 : 3,
        })}
      ></Divider>
    </Box>
  );

  return (
    <Stack
      direction="row"
      sx={{ bgcolor: "background.paper", minHeight: "100vh" }}
    >
      <DesktopNav></DesktopNav>
      <Box sx={{ flex: "1", m: 0 }}>
        <Header></Header>
        <Container
          maxWidth="lg"
          sx={{
            flexGrow: 1,
            py: { xs: 2, md: 4 },
            px: { xs: 2, sm: 3, md: 6 },
            display: "flex",
            flexDirection: "column",
            gap: { xs: 3, md: 4 },
            mb: 10,
          }}
        >
          <Box>
            <Typography variant="h4">Settings</Typography>
            <CustomDivider thin></CustomDivider>
          </Box>
          <Container maxWidth={"sm"} sx={styles.main}>
            <Box sx={styles.icon}>
              <ProfileIcon></ProfileIcon>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack direction="column" component={"div"} spacing={4}>
                <InputField
                  placeholder={"joe.doe@ucalgary.ca"}
                  label={"Email"}
                  disabled
                  disableUnderline={true}
                  sx={(theme) => ({
                    "& .Mui-disabled": {
                      color: theme.palette.text.primary,
                      WebkitTextFillColor: "unset",
                    },
                  })}
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
                  inputProps={{ type: "password" }}
                  autoComplete={"new-password"}
                  helpText={<PassHelpText></PassHelpText>}
                  errorMsg={
                    errors["password"] ? errors["password"].message : null
                  }
                  {...register("password", {
                    validate: validateNewPassword,
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
                    validate: validateConfirmPassword,
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
                  inputProps={{ type: "text" }}
                  autoComplete={"family-name"}
                  errorMsg={
                    errors["lastName"] ? errors["lastName"].message : null
                  }
                  {...register("lastName", {
                    required: "Last name is required.",
                    pattern: {
                      value: /^[A-Za-z]+$/,
                      message: "Must only contain letters.",
                    },
                  })}
                ></InputField>
                <CustomButton type="submit">Save Changes</CustomButton>
              </Stack>
            </form>
            <Stack spacing={2} sx={styles.bottomContent}>
              <FormHelperText
                error={true}
                sx={[
                  { textAlign: "center", fontSize: "1rem" },
                  {
                    visibility:
                      submitStatus.success != null ? "visible" : "hidden",
                  },
                ]}
              >
                {submitStatus.msg}.<br></br>Please try again.
              </FormHelperText>
            </Stack>
          </Container>
        </Container>
      </Box>
      <MobileNav></MobileNav>
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
    paddingTop: 3,
  },

  bottomContent: {
    paddingTop: 2,
  },

  stackRow: {
    justifyContent: "center",
    alignItems: "center",
  },
};
