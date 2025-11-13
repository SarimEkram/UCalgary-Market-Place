import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Login from "./Login";

const black = "#221F1F";
const theme = createTheme({
  palette: {
    primary: {
      main: "#D22C22",
    },
    secondary: {
      main: black,
    },
    headerBackground: "#FFFDFB",
    divider: {
      color: "#EBE7E4",
      width: 2,
    },
  },
  text: {
    primary: black,
    secondary: "#7D7B7B",
  },
  background: {
    paper: "#FFFFFB",
    default: "#FFFFFB",
  },

  components: {
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: black, // Default color for inactive buttons
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: "40px",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: black,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: black,
          fontSize: "1.2rem",
        },
        asterisk: {
          display: "none",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          color: black,
          "&::before": {
            borderColor: "#757575",
            borderWidth: 2,
          },
        },
      },
    },
    
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <Login />
    </ThemeProvider>
  </StrictMode>
);
