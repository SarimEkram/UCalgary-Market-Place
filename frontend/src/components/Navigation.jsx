import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useState } from "react";
import Calendar from "../assets/CalendarSVG.jsx";
import Home from "../assets/HomeSVG.jsx";
import Shoppingbag from "../assets/ShoppingbagSVG.jsx";
import User from "../assets/UserSVG.jsx";

export default function Navigation() {
  const [value, setValue] = useState("home");

  return (
    <BottomNavigation
      showLabels
      id="nav-bar"
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
       sx={(theme) => ({
        bgcolor: theme.palette.headerBackground,
        borderTop: theme.palette.divider.width,
        borderColor: theme.palette.divider.color,
        padding: 2,

      })}
    >
      <BottomNavigationAction label="Home" value="home" icon={<Home></Home>} />
      <BottomNavigationAction label="User" value="user" icon={<User></User>} />
      <BottomNavigationAction
        label="Market"
        value="market"
        icon={<Shoppingbag></Shoppingbag>}
      />
      <BottomNavigationAction
        label="Events"
        value="events"
        icon={<Calendar></Calendar>}
      />
    </BottomNavigation>
  );
}

