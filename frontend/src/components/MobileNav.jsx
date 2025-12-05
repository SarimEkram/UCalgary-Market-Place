import {
  BottomNavigation,
  BottomNavigationAction,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import Calendar from "../assets/CalendarSVG.jsx";
import Home from "../assets/HomeSVG.jsx";
import Shoppingbag from "../assets/ShoppingbagSVG.jsx";
import User from "../assets/UserSVG.jsx";
import Settings from "../assets/SettingsSVG.jsx";

export default function Navigation() {
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

  //get the current path
  const location = useLocation();

  //the currently selected page in the navigation bar
  //which is initialized to the root path on the current page
  //the currently selected page in the navigation bar
  //which is initialized to the root path on the current page
  const [value, setValue] = useState(()=>{
    const pathComposition =  location.pathname.split("/");
    let ans = pathComposition[1];
    if (pathComposition[1] == "admin"){
       if (pathComposition[2] && pathComposition[2] == "settings"){
        ans = "settings";
       }
    } 
    console.log(ans, pathComposition);
    return ans;
  });

 // navigate urls, and change the current selected page, when a user clicks on an item in the nav bar
  function getURL(newValue) {
    const url = newValue === "settings" ? "/admin/settings" : "/" + newValue;
   
    return url;
  }


  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  //render icon assocaited with a given value. ex: render Home icon
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

  return (
    <Slide
      direction="up"
      in={matches}
      mountOnEnter
      unmountOnExit
    >
      <BottomNavigation
        id="nav-bar"
        sx={(theme) => ({
          bgcolor: theme.palette.headerBackground,
          borderTop: theme.palette.dividerWidth,
          borderColor: theme.palette.divider,
          padding: 2,
          px: 0,
          position: "fixed", 
          bottom: 0, 
          width: "100%",
        })}
      >
        {options.map((title) => (
          <Link to={getURL(title.toLowerCase())} key={"nav-" + title.toLowerCase()} style={{display: "flex",  textDecoration :"none", } }>
          <BottomNavigationAction
            
            sx={(theme) => ({
              color:
                value == title.toLowerCase()
                  ? theme.palette.primary.main
                  : theme.palette.secondary.main,
            })}
            label={title}
            value={title.toLowerCase()}
            showLabel
            icon={<Icon value={title.toLowerCase()}></Icon>}
          />
          </Link>
        ))}
        </BottomNavigation>
    </Slide>
  );
}
