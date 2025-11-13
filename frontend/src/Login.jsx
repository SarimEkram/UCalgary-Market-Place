import { Stack } from "@mui/material";
import CustomButton from "./components/CustomButton";
import Header from "./components/Header";
import Navigation from "./components/Navigation";


export default function Login() {
  return (
    <Stack id="login" direction="column" sx={styles.main}>
    <Header></Header>
    <CustomButton>this is a button</CustomButton>
    <Navigation></Navigation>
  </Stack>
  )
}

const styles = {
  main: {
   minHeight: "100vh", 
   justifyContent: "space-between"
  }
}
