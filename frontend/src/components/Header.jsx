import { Box, Stack, Typography } from "@mui/material";
import Logo from "../assets/logo.svg";

export default function Header() {
  return (
    <Stack
      id="hello"
      direction="row"
      spacing={2}
      sx={(theme) => ({
        borderBottom: theme.palette.divider.width,
        borderColor: theme.palette.divider.color,
        ...styles.container
      })}
    >
      <Box
        component="img"
        src={Logo}
        alt="Site Logo: A red price tag with letters (UC) written on it in yellow."
        sx={(theme) => ({
          width: "auto",
          height: theme.typography.h5.fontSize,
        })}
      ></Box>
      <Typography variant="h5">STUDENT MARKETPLACE</Typography>
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
};
