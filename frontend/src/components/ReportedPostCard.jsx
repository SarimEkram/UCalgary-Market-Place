import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Icon,
  Stack,
  Typography
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { useNavigate } from "react-router";
import Reported from "../assets/ReportedSVG";
import ConfirmationPopup from "./ConfirmationPopup";
import CustomButton from "./CustomButton";

export default function PostCard({
  image,
  primaryText,
  reportDate,
  numReports,
  id,
  type,
}) {
  const navigate = useNavigate();
  dayjs.extend(relativeTime);
  const [date, setDate] = useState(dayjs(reportDate).fromNow());

  const [userID, setUserID] = useState(()=>{
      return JSON.parse(localStorage.getItem("user")).id;
  });
   
  const confirmedDelete = async () => {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body :  JSON.stringify({ adminId: userID })
      });
      return response;
  };

  const onDelete = ()=>{
    setOpen(true);
  }

  const callBackDelete = (ok)=>{
     if (ok) {
        navigate(`/reports/${type}`);
      }
  }
  
  const onView = () => {
    navigate(`/reports/${type}/${id}`);
  };

  //Alert for failed actions
  const [open, setOpen] = useState(false);

  return (
    <Card
      class="new-card"
      variant="elevation"
      elevation={1}
      sx={(theme) => ({
        position: "relative",
         p: 4,
        py: 2,
        overflow: "hidden",
        fontWeight: 0,
        backgroundColore: "red",
        boxShadow: "0px 1px 3px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minHeight: "min-content",
        minWidth: "min-content",
      })}
    >
     <ConfirmationPopup  warningMessage={
      <div>
      <div>Do You Want To Proceed With Deleting The Post Named:</div>
      <div>{primaryText} ?</div>
      </div>
      } open={open} handleClose={()=>{setOpen(false)}} executeFunction={confirmedDelete} callBack={callBackDelete}></ConfirmationPopup>
      <Stack spacing={5} direction="row" sx={{ height: "100%" }}>
        {/* IMAGE */}
        <Box sx={{ flexGrow: 1 }} position="relative">
          {image != null ? (
            <CardMedia
              sx={(theme) => ({
                width: "100%",
                maxWidth: "70px",
                height: "90%",
                objectFit: "cover",
                minHeight: "155px",
                minWidth: "155px",
                borderRadius: theme.shape.borderRadius,
              })}
              component="img"
              image={image} //image src
            />
          ) : (
            <Box
              sx={(theme) => ({
                width: "100%",
                height: "90%",
                objectFit: "cover",
                minHeight: "155px",
                minWidth: "155px",
                borderRadius: theme.shape.borderRadius,
                backgroundColor: "#b3b3b3ff",
                display:"flex", 
                justifyContent: "center",
                alignItems: "center"
              
              })}
            >
              <Typography
                variant="h3"
                sx={{ color: "#252525ff", verticalAlign: "bottom" }}
              >
                No Image
              </Typography>
            </Box>
          )}
          {reportDate && (
            <Icon
              fontSize="large"
              sx={{ position: "absolute", bottom: -3, right: -3 }}
            >
              <Reported></Reported>
            </Icon>
          )}
        </Box>
        <CardContent
          sx={{
            boxSizing: "border-box",
            p: 0,
            height: "100%",
            paddingBottom: 15,
          }}
        >
          <Stack
            direction={"column"}
            sx={{ height: "100%", justifyContent: "space-between" }}
          >
            <Box>
              <Typography
                variant="body1"
                sx={{
                  mt: 0,
                }}
              >
                {primaryText}
              </Typography>
            </Box>
            <Stack
              sx={(theme) => ({
                p: 0,
                display: "flex",
                [theme.breakpoints.down("sm")]: {
                  flexDirection: "row",
                },
                [theme.breakpoints.between("980", "1300")]: {
                  flexDirection: "column",
                },

                [theme.breakpoints.up("1300")]: {
                  flexDirection: "row",
                },
                gap: 2,
                justifyContent: "center",
                alignItems: "stretch",
                alignContent: "center",
              })}
            >
              <CustomButton
                onClick={onView}
                // style={{ width: "100%" }}
                color="black"
              >
                View
              </CustomButton>
              <CustomButton
                onClick={onDelete}
                style={{ "& .MuiCardActions-root": { margin: 0 } }}
              >
                Delete
              </CustomButton>
            </Stack>
          </Stack>
        </CardContent>
      </Stack>

      <Typography
        component="div"
        sx={{ textAlign: "center", pt: 2 }}
        variant="body1"
        color="textSecondary"
        visibility={reportDate ? "visible" : "hidden"}
      >
        {numReports} Reported • {date}
      </Typography>
    </Card>
  );
}
