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
import MyEvents from "./pages/MyEvents";
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
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import BannedUsers from "./pages/BannedUsers";

const black = "#221F1F";
const inputBorderColor = "#757575";

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
        dullPrimary: "#F8E0DE",
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
                    {/* Public */}
                    <Route path="/" element={<Login />} />
                    <Route path="signup" element={<SignUp />} />

                    {/* Protected */}
                    <Route path="home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="market" element={<ProtectedRoute><Market /></ProtectedRoute>} />
                    <Route path="/market/:id" element={<ProtectedRoute><MarketItemPage /></ProtectedRoute>} />
                    <Route path="events" element={<ProtectedRoute><Event /></ProtectedRoute>} />
                    <Route path="events/:id" element={<ProtectedRoute><EventItemPage /></ProtectedRoute>} />

                    <Route path="user">
                        <Route index element={<ProtectedRoute><MySettings /></ProtectedRoute>} />
                        <Route path="market">
                            <Route index element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
                            <Route path="new" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
                            <Route path=":id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
                        </Route>
                        <Route path="events">
                            <Route index element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
                            <Route path="new" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
                            <Route path=":id" element={<ProtectedRoute><EditEvent /></ProtectedRoute>} />
                        </Route>
                        <Route path="saved" element={<ProtectedRoute><MySaved /></ProtectedRoute>} />
                        <Route path="contacted" element={<ProtectedRoute><MyContacted /></ProtectedRoute>} />
                    </Route>

                    {/* Admin */}
                    <Route path="admin">
                        <Route index element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                        <Route path="find-user" element={<AdminRoute><FindUser /></AdminRoute>} />
                        <Route path="reported-users" element={<AdminRoute><ViewReportedUsers /></AdminRoute>} />
                        <Route path="profile/:id" element={<AdminRoute><AdminProfile /></AdminRoute>} />
                        <Route path="settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
                        <Route path="banned" element={<AdminRoute><BannedUsers /></AdminRoute>} />
                        <Route path="profile/user/:id" element={<AdminRoute><UserProfile /></AdminRoute>} />
                        <Route path="reports">
                            <Route path="events">
                                <Route index element={<AdminRoute><ViewReportedEvents /></AdminRoute>} />
                                <Route path=":id" element={<AdminRoute><ReportedEventItemPage /></AdminRoute>} />
                            </Route>
                            <Route path="market">
                                <Route index element={<AdminRoute><ViewReportedPosts /></AdminRoute>} />
                                <Route path=":id" element={<AdminRoute><ReportedMarketItemPage /></AdminRoute>} />
                            </Route>
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>
);