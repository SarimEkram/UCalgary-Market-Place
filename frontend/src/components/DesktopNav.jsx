import { useState } from "react";
import Calendar from "../assets/CalendarSVG.jsx";
import Home from "../assets/HomeSVG.jsx";
import Settings from "../assets/SettingsSVG.jsx";
import Shoppingbag from "../assets/ShoppingbagSVG.jsx";
import User from "../assets/UserSVG.jsx";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";

import { Icon as MUIIcon, useMediaQuery, useTheme } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link, useLocation } from "react-router";

export default function DesktopNav() {
  // set the options based on the role of the user
  const [options, setOptions] = useState(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    let options = [];
    if (userData.isAdmin) {
      options = ["Home", "Admin", "Market", "Events", "Settings"];
    } else {
      options = ["Home", "User", "Market", "Events"];
    }
    return options;
  });

  // navigate urls, and change the current selected page, when a user clicks on an item in the nav bar
  function getURL(newValue) {
    const url = newValue === "settings" ? "/admin/settings" : "/" + newValue;
    
    return url;
  }

  //get the current path
  const location = useLocation();

  //the currently selected page in the navigation bar
  //which is initialized to the root path on the current page
  const [value, setValue] = useState(location.pathname.split("/")[1]);

  //constant width of the navigation bar
  const drawerWidth = 180;

  //render icon assocaited with a given value. ex: render Home icon
  const Icon = function ({ value }) {
    if (value == "home") {
      return <Home></Home>;
    } else if (value == "user" || value == "admin") {
      return <User></User>;
    } else if (value == "market") {
      return <Shoppingbag></Shoppingbag>;
    } else if (value == "settings") {
      return <Settings></Settings>;
    } else {
      return <Calendar></Calendar>;
    }
  };

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Drawer
      id="desktop-nav"
      slotProps={{ transition: { unmountOnExit: true } }}
      sx={(theme) => ({
        width: drawerWidth,
        // flexShrink: 0,
        display: matches ? "block" : "none",
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          color: theme.palette.primary,
        },

        "& .MuiDrawer-root": {
          color: theme.palette.primary,
        },
      })}
      variant="persistent"
      anchor="left"
      open={matches}
    >
      <List id="list" sx={{ paddingTop: 10 }}>
        {options.map((title) => (
          <ListItem key={"nav-" + title.toLowerCase()} disablePadding>
            <Link
              to={getURL(title.toLowerCase())}
              style={{ textDecoration: "none" }}
            >
              <ListItemButton component="div">
                <ListItemIcon
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MUIIcon
                    fontSize="medium"
                    sx={(theme) => ({
                      padding: 0,
                      color:
                        value == title.toLowerCase()
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
                    })}
                  >
                    <Icon value={title.toLowerCase()}></Icon>
                  </MUIIcon>
                </ListItemIcon>
                <ListItemText
                  sx={(theme) => ({
                    color:
                      value == title.toLowerCase()
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main,
                  })}
                  primary={title}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
