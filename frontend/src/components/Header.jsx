import { Box, Stack } from "@mui/material";
import Logo from "../assets/logo.svg";

export default function Header() {
  return (
    <Stack id="hello" direction="row" spacing={2} sx={styles.container}>
      <Box
        component="img"
        src={Logo}
        alt="Site Logo: A red price tag with letters (UC) written on it in yellow."
        sx={styles.tinyLogo}
      ></Box>
      <Box component="h2">STUDENT MARKETPLACE</Box>
    </Stack>
  );
}

const styles = {
  container: {
    bgcolor: "headerBackground",
    spacing: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 2,
    paddingTop: 2,
    width: "100%",
  },

  tinyLogo: {
    width: "auto",
    height: "1.5rem",
  },
  title: {},
};
