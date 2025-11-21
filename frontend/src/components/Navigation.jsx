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
  const [value, setValue] = useState((location.pathname.split("/"))[1]);

  const navigate = useNavigate();

  function handleChange(newValue) {
    setValue(() => {
      navigate("/" + newValue);
      return newValue;
    });
  }

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
          sx={(theme) => ({
            color:
              value == title.toLowerCase()
                ? theme.palette.primary.main
                : theme.palette.secondary.main,
          })}
          label={title}
          value={title.toLowerCase()}
          icon={<Icon value={title}></Icon>}
        />
      ))}
    </BottomNavigation>
  );
}
