import { useState } from "react";
import Calendar from "../assets/CalendarSVG.jsx";
import Home from "../assets/HomeSVG.jsx";
import Shoppingbag from "../assets/ShoppingbagSVG.jsx";
import User from "../assets/UserSVG.jsx";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";

import { Box } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router";

export default function DesktopNav() {
  const [value, setValue] = useState("Home");
  const drawerWidth = 200;
  const navigate = useNavigate();

  const Icon = function ({ value }) {
    if (value == "Home") {
      return <Home></Home>;
    } else if (value == "User") {
      return <User></User>;
    } else if (value == "Events") {
      return <Shoppingbag></Shoppingbag>;
    } else {
      return <Calendar></Calendar>;
    }
  };

  const path = { Home: "home", User: "", Market: "", Events: "" };
  function handleChange(value) {
    setValue(value);
    navigate("/" + path[value]);
  }

  return (
    <Drawer
      id="desktop-nav"
      sx={(theme) => ({
        width: drawerWidth,
        flexShrink: 0,

        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          color: theme.palette.primary,
        },

        "& .MuiDrawer-root": {
          color: theme.palette.primary,
        },
      })}
      variant="permanent"
      anchor="left"
    >
      {/* TODO: FIX DEFAULT COLOR, AND DYNAMICALLY CHANGE COLR BASED ON VALUE */}
      {/* TODO: RESIZE SVG */}
      <List id="list" sx={{ paddingTop: 10 }}>
        {["Home", "User", "Market", "Events"].map((title) => (
          <>
            <ListItem key={title} disablePadding>
              <ListItemButton onClick={() => handleChange(title)}>
                <ListItemIcon
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="span"
                    // sx={{ width: "2rem", padding: 0, }}
                    sx={(theme) => ({
                      width: "2rem",
                      padding: 0,
                      color:
                        value == title
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
                    })}
                  >
                    <Icon value={title}></Icon>
                  </Box>
                </ListItemIcon>
                <ListItemText
                  sx={(theme) => ({
                    color:
                      value == title
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main,
                  })}
                  primary={title}
                />
              </ListItemButton>
            </ListItem>
          </>
        ))}
      </List>
    </Drawer>
  );
}
