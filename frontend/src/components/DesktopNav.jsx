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

export default function DesktopNav() {
  const [value, setValue] = useState("Home");
  const drawerWidth = 200;
  const GetIcon = function ({ value }) {
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
        {["Home", "User", "Market", "Events"].map((text) => (
          <>
            <ListItem
              key={text}
              disablePadding
            >
              <ListItemButton
              onClick={() => setValue(text)}>
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
                    sx={(theme)=>(
                      {  width: "2rem",
                         padding: 0, 
                        color:
                          value == text
                            ? theme.palette.primary.main
                            : theme.palette.secondary.main,
                     })}
                  >
                    <GetIcon value={text}></GetIcon>
                  </Box>
                </ListItemIcon>
                <ListItemText 
                sx={(theme)=>({ color:
                          value == text
                            ? theme.palette.primary.main
                            : theme.palette.secondary.main,
                     })}
              primary={text} />
              </ListItemButton>
            </ListItem>
          </>
        ))}
      </List>
    </Drawer>
  );
}
