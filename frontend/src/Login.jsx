import { Box, Container, Link, Stack, Typography } from "@mui/material";
import ProfileIcon from "./assets/ProfileIconSVG";
import CustomButton from "./components/CustomButton";
import Header from "./components/Header";
import InputField from "./components/InputField";

export default function Login() {
  return (
    <Stack
      id="login"
      direction="column"
      sx={(theme) => {
        ({
          bgcolor: "background.paper",
          ...styles.page,
        });
      }}
    >
      <Header></Header>
      <Container spacing={2} maxWidth={"sm"} sx={styles.main}>
        <Stack direction="column" component={"form"}>
          <Box sx={styles.icon}>
            <ProfileIcon></ProfileIcon>
          </Box>
          <InputField
            placeholder={"joe.doe@ucalgary.ca"}
            label={"Email"}
            helpText={"Please enter a valid Ucalgary email address."}
          ></InputField>
          <InputField
            placeholder={"Password"}
            label={"Password"}
            helpText={"Please enter a password."}
            inputProps={{ type: "password" }}
          ></InputField>
          <CustomButton type="submit">Submit</CustomButton>
        </Stack>
        <Stack spacing={2} sx={styles.bottomContent}>
          <Stack direction="row" spacing={2} sx={styles.stackRow}>
          <Typography>New User ? </Typography>
          <Link color="primary">
            <Typography>Sign Up</Typography>
          </Link>
        </Stack>
        <Stack direction="row" sx={styles.stackRow}>
          {/*TODO: Make links clickablle, handle redirection */}
          {/* TODO: Create Forgot password, and Sign Up page */}
          {/* TODO: Error handling/validation for forms using patterns fro online.  */}
          {/* TODO: Stub Submitting content to the backend */}
          {/* TODO: Popup email CODE */}
          <Link color="textSecondary">
          <Typography>Forgot Password</Typography>
          </Link>
        </Stack>
        </Stack>
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
    minHeight: "100vh",
    justifyContent: "space-between",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "space-between",
    padding: 10,
  },

  stackRow: {
    justifyContent: "center",
    alignItems: "center",
  },

  bottomContent:{
    paddingTop: 12, 
  }
};
