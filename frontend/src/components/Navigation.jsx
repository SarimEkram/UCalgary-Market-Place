import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Calendar from "../assets/CalendarSVG.jsx";
import Home from "../assets/HomeSVG.jsx";
import Shoppingbag from "../assets/ShoppingbagSVG.jsx";
import User from "../assets/UserSVG.jsx";

export default function Navigation() {
  //get the value of root path which is home, market, e.t.c
  const location = useLocation();

  //the currently selected page in the navigation bar
  //which is initialized to the root path on the current page
  const [value, setValue] = useState((location.pathname.split("/"))[1]);

   //hook which handles navigating urls 
  const navigate = useNavigate();

  // navigate urls, and change the current selected page, when a user clicks on an item in the nav bar
  function handleChange(newValue) {
    setValue(() => {
      navigate("/" + newValue);
      return newValue;
    });
  }

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

  return (
    <BottomNavigation
      showLabels
      id="nav-bar"
      onChange={(event, newValue) => {
        handleChange(newValue);
      }}
      sx={(theme) => ({
        bgcolor: theme.palette.headerBackground,
        borderTop: theme.palette.dividerWidth,
        borderColor: theme.palette.divider,
        padding: 2,
      })}
    >
      {["Home", "User", "Market", "Events"].map((title) => (
        <BottomNavigationAction
         key={"nav-" + title.toLowerCase()}
          sx={(theme) => ({
            color:
              value == title.toLowerCase()
                ? theme.palette.primary.main
                : theme.palette.secondary.main,
          })}
          label={title}
          value={title.toLowerCase()}
          icon={<Icon value={title.toLowerCase()}></Icon>}
        />
      ))}
    </BottomNavigation>
  );
}
