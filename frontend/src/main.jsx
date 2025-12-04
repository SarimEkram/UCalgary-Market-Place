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
import MyPosts from "./pages/MyPosts";
import MyContacted from "./pages/MyContacted";
import MySaved from "./pages/MySaved";
import  MyEvents from "./pages/MyEvents";
import Event from "./pages/Event";
import EventItemPage from "./pages/EventItemPage";
import MarketItemPage from "./pages/MarketItemPage";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import UserProfile from "./pages/UserProfile";
import ViewReportedEvents from "./pages/ViewReportedEvents";
import ViewReportedPosts from "./pages/ViewReportedPosts";
import AdminSettings from "./pages/AdminSettings";
import AdminProfile from "./pages/AdminProfile";
import FindUser from "./pages/FindUser";
import AdminDashboard from "./pages/AdminDashboard";
import ViewReportedUsers from "./pages/ViewReportedUsers";
import ReportedMarketItemPage from "./pages/ReportedMarketItemPage";
import ReportedEventItemPage from "./pages/ReportEventItemPage";


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
    dullPrimary: "#F8E0DE"
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
            <Route path="market">
              <Route
              index
              element={<MyPosts></MyPosts>}
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
              element={<MyEvents></MyEvents>}
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
             <Route path="saved" element={<MySaved></MySaved>}></Route>
             <Route path="contacted" element={<MyContacted></MyContacted>}></Route>
          </Route>
          <Route path="home" element={<Home></Home>}></Route>
          <Route path="market" element={<Market></Market>}></Route>
          <Route path="/market/:id" element={<MarketItemPage />} />
          <Route path="events" element={<Event />} />
          <Route path="events/:id" element={<EventItemPage />} />
          <Route path="admin">
            <Route index element={<AdminDashboard />} />
            <Route path ="find-user" element={<FindUser></FindUser>}></Route>
             <Route path="reported-users" element={<ViewReportedUsers></ViewReportedUsers>}></Route>
             <Route path="profile/:id" element={<AdminProfile></AdminProfile>}></Route>
             <Route path="settings" element={<AdminSettings></AdminSettings>}></Route>
             <Route path="profile/user/:id" element={<UserProfile></UserProfile>}></Route>
            <Route path="reports">
              <Route path="events">
                    <Route index element={<ViewReportedEvents></ViewReportedEvents>}></Route>
                    <Route path=":id" element={<ReportedEventItemPage></ReportedEventItemPage>}></Route>
              </Route>
                <Route path="market">
                    <Route index element={<ViewReportedPosts></ViewReportedPosts>}></Route>
                    <Route path=":id" element={<ReportedMarketItemPage></ReportedMarketItemPage>}></Route>
              </Route>
          </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
