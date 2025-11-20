import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import Login from "./Login";
import Home from "./Home";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Market from "./Market";
import SignUp from "./SignUp";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

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
    dividerWidth: 2,
    divider: "#EBE7E4",
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
          color: black,
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="signup" element={<SignUp></SignUp>}></Route>
          <Route path="user">
            <Route index element={<div>Not finished</div>} />
            <Route path="create-post" element={<div>Not finished</div>}></Route>
            <Route
              path="create-event"
              element={<div>Not finished</div>}
            ></Route>
            <Route
              path="edit-post/:id"
              element={<div>Not finished</div>}
            ></Route>
            <Route
              path="edit-event/:id"
              element={<div>Not finished</div>}
            ></Route>
          </Route>
          {/* @ Deep, feel free to customize as needed. i made this for testing. */}
          <Route path="home" element={<Home></Home>}></Route>
          <Route path="market" element={<Market></Market>}></Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
