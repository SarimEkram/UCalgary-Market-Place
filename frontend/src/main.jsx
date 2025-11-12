import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Login from "./Login";

const theme = createTheme({
  palette: {
    primary: {
      main: "#D22C22",
    },
    secondary: {
      main: "#221F1F",
    },
    headerBackground: "#FFFDFB",
  },
  text: {
    primary: "#221F1F",
    secondary: "#7D7B7B",
  },
  background: {
    paper: "#FFFFFB",
    default: "#FFFFFB",
  },
  
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <Login />
    </ThemeProvider>
  </StrictMode>
);
