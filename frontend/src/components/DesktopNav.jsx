import { useState } from "react";
import Calendar from "../assets/CalendarSVG.jsx";
import Home from "../assets/HomeSVG.jsx";
import Shoppingbag from "../assets/ShoppingbagSVG.jsx";
import User from "../assets/UserSVG.jsx";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";

import { Icon as MUIIcon } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useLocation, useNavigate } from "react-router";

export default function DesktopNav() {
  // set the options based on the role of the user 
  const [options, setOptions] = useState( () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    let options = [];
    if (userData.isAdmin){
      options = ["Home", "Admin", "Market", "Events"];
    }else{
      options = ["Home", "User", "Market", "Events"]
    }
    return options;
  });

  //get the current path 
  const location = useLocation();

  //the currently selected page in the navigation bar
  //which is initialized to the root path on the current page
  const [value, setValue] = useState((location.pathname.split("/"))[1]);

  //constant width of the navigation bar
  const drawerWidth = 180;

  //hook which handles navigating urls 
  const navigate = useNavigate();

    //render icon assocaited with a given value. ex: render Home icon
   const Icon = function ({ value }) {
     if (value == "home") {
       return <Home></Home>;
     } else if (value == "user" || value=="admin") {
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
        {options.map((title) => (
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
                  <MUIIcon
                    fontSize="medium"
                    sx={(theme) => ({
                      padding: 0,
                      color:
                        (value ==  title.toLowerCase() )
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
