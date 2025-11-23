import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import MenuIcon from "../assets/MenuSVG";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function UserMenu() {
  // state, and functions  for menu tooltip
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (value) => {
    handleClose();
    // TODO: enable navigation once more pages are ready...
    navigate("/" + value);
  };

  //a styled divider for easy re-use
  const CustomDivider = ({ props, variant, thin, marginThin }) => (
    <Box>
      <Divider
        variant={variant ? variant : "fullWidth"}
        {...props}
        sx={(theme) => ({
          borderBottom: thin ? 0.75 : theme.palette.dividerWidth,
          borderColor: theme.palette.divider,
          boxSizing: "border-box",
          marginTop: marginThin ? 0 : 3,
          marginBottom: marginThin ? 0 : 3,
        })}
      ></Divider>
    </Box>
  );

  return (
    <Box>
      <Tooltip placement={"bottom"}>
        <IconButton
          sx={(theme) => ({
            width: theme.typography.h4.fontSize,
            padding: 0.5,
          })}
          onClick={handleClick}
          color="primary"
        >
          <MenuIcon></MenuIcon>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              paddingLeft: 1,
              paddingRight: 1,
              paddingBottom: 1,
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                left: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
      >
        <MenuItem sx={{ paddingRight: 3 }} onClick={handleClose}>
          My Settings
        </MenuItem>
        <CustomDivider marginThin></CustomDivider>
        <MenuItem sx={{ paddingRight: 3 }} onClick={handleClose}>
          My Contacted
        </MenuItem>
        <CustomDivider marginThin></CustomDivider>
        <MenuItem sx={{ paddingRight: 3 }} onClick={handleClose}>
          My Posts
        </MenuItem>
        <CustomDivider marginThin></CustomDivider>
        <MenuItem sx={{ paddingRight: 3 }} onClick={handleClose}>
          My Events
        </MenuItem>
        <CustomDivider marginThin></CustomDivider>
        <MenuItem sx={{ paddingRight: 3 }} onClick={handleClose}>
          My Saved
        </MenuItem>
        <CustomDivider marginThin></CustomDivider>
      </Menu>
    </Box>
  );
}
