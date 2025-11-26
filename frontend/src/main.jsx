import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./index.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Market from "./pages/Market";
import SignUp from "./pages/SignUp";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost"; 
import EditEvent from "./pages/EditEvent";
import CreateEvent from "./pages/CreateEvent";
import MySettings from "./pages/MySettings";


import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import UserProfile from "./pages/UserProfile";

const black = "#221F1F";
const  inputBorderColor= "#757575"; 

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
            borderColor: inputBorderColor,
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
            <Route index element={<MySettings></MySettings>} />
            <Route path="posts">
              <Route
              index
              element={<div>My Posts page - Not finished.</div>}
            ></Route>
             <Route
              path="new"
              element={<CreatePost></CreatePost>}
            ></Route>
           <Route
              path=":id"
              element={<EditPost></EditPost>}
            ></Route>
           
            </Route>
             <Route path="events">
              <Route
              index
              element={<div>My Events page - Not finished.</div>}
            ></Route>
              <Route
              path="new"
              element={<CreateEvent></CreateEvent>}
            ></Route>
           <Route
              path=":id"
              element={<EditEvent></EditEvent>}
            ></Route>
        
            </Route>
          </Route>
          {/* @ Deep, feel free to customize as needed. i made this for testing. */}
          <Route path="home" element={<Home></Home>}></Route>
          <Route path="market" element={<Market></Market>}></Route>
          <Route path="reports">
             <Route path="events" element={<Market></Market>}>
                  <Route index element={<div>Not done Reported events</div>}></Route>
                  <Route path=":id" element={<div>Not done view reported event.</div>}></Route>
             </Route>
              <Route path="posts" element={<Market></Market>}>
                  <Route index element={<div>Not done Reported market posts</div>}></Route>
                  <Route path=":id" element={<div>Not done view reported market post.</div>}></Route>
             </Route>
          </Route>
          {/* @ Deep, feel free to customize as needed. you're in charge of the list users/admin pages*/}
          <Route path="profile" element={<UserProfile></UserProfile>}>

          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
