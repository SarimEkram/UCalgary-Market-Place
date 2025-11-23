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
import { useLocation, useNavigate } from "react-router";

export default function DesktopNav() {
   //get the value of root path which is home, market, e.t.c
  const location = useLocation();

  //the currently selected page in the navigation bar
  //which is initialized to the root path on the current page
  const [value, setValue] = useState((location.pathname.split("/"))[1]);

  //constant width of the navigation bar
  const drawerWidth = 200;

  //hook which handles navigating urls 
  const navigate = useNavigate();

    //render icon assocaited with a given value. ex: render Home icon
   const Icon = function ({ value }) {
     if (value == "home") {
       return <Home></Home>;
     } else if (value == "user") {
       return <User></User>;
     } else if (value == "events") {
       return <Shoppingbag></Shoppingbag>;
     } else {
       return <Calendar></Calendar>;
     }
   };


  // navigate urls, and change the current selected page, when a user clicks on an item in the nav bar
  function handleChange(newValue) {
    setValue(() => {
      navigate("/" + newValue);
      return newValue;
    });
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
      <List id="list" sx={{ paddingTop: 10 }}>
        {["Home", "User", "Market", "Events"].map((title) => (
          <>
            <ListItem key={"nav-" + title.toLowerCase()} disablePadding>
              <ListItemButton onClick={() => handleChange(title.toLowerCase())}>
                <ListItemIcon
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="span"
                    sx={(theme) => ({
                      width: "2rem",
                      padding: 0,
                      color:
                        (value ==  title.toLowerCase() )
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
                    })}
                  >
                    <Icon value={title.toLowerCase()}></Icon>
                  </Box>
                </ListItemIcon>
                <ListItemText
                  sx={(theme) => ({
                    color:
                     (value ==  title.toLowerCase() )
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
