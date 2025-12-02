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
import DesktopNav from "../components/DesktopNav";
import Header from "../components/Header";
import InputField from "../components/InputField";
import MobileNav from "../components/MobileNav";
import UserMenu from "../components/UserMenu";
import { useNavigate } from "react-router";

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
      fname: userData.fname,
      lname: userData.lname,
    
    },
  });

  const navigate =  useNavigate();

  const [submitStatus, setSubmitStatus] = useState({
    success: null,
    msg: "No message.",
  });

  const onSubmit = async (formData) => {
    delete formData["password"];

    const response = await fetch(`http://localhost:8080/api/settings/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();

    if (response.ok) {
        //re-fresh page with new details 
        const newData = {...userData};
        newData.fname = formData.fname; 
        newData.lname = formData.lname;
        localStorage.setItem("user", JSON.stringify(newData));
        navigate("/user"); 

      } else{
        //set status of 
        setSubmitStatus({success: false, msg: data.error})
      }

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
    } else if (!passwords[0].match(/^(?=.*\d)(?=.*[!@#$%^&*(),.?:{}|<>]).*$/)) {
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
        <Container maxWidth={"sm"} sx={styles.main}>
          <Stack direction={"row"} spacing={1}>
            <UserMenu></UserMenu>
            <Typography variant="h4">My Settings</Typography>
          </Stack>
          <CustomDivider thin></CustomDivider>
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
                autoComplete={"new-password"}
                inputProps={{ type: "password" }}
                helpText={<PassHelpText></PassHelpText>}
                errorMsg={
                  errors["password"] ? errors["password"].message : null
                }
                {...register("password", {
                 validate : validateNewPassword
                })}
              ></InputField>
              <InputField
                placeholder={"New Password"}
                autoComplete={"new-password"}
                label={"Re-enter Your Password"}
                inputProps={{ type: "password" }}
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
                  errors["fname"] ? errors["fname"].message : null
                }
                {...register("fname", {
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
                errorMsg={
                  errors["lname"] ? errors["lname"].message : null
                }
                {...register("lname", {
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
    p: 5,
    mb: 10,
  },

  bottomContent: {
    paddingTop: 2,
  },

  stackRow: {
    justifyContent: "center",
    alignItems: "center",
  },
};
