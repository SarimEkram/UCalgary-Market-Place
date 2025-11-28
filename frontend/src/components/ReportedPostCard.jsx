import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  Icon,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { useNavigate } from "react-router";
import Reported from "../assets/ReportedSVG";
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
  const [submitSatus, setSubmitSatus] = useState({
    success: null,
    msg: "No message. ",
  });
  const onDelete = async () => {
    // TODO: BTASK
    // add delete post api
    // body of request
    // {id: id}
    try {
      const response = await fetch("http://localhost:8080/api/[]", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate(`/reports/${type}`);
      } else {
        //handle failed delete post request
        setSubmitSatus({ success: false, msg: data.error });
        setOpen(true);
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
    }
  };

  const onView = () => {
    navigate(`/reports/${type}/${id}`);
  };

  //Alert for failed actions
  const [open, setOpen] = useState(false);

  return (
    <Card
      variant="elevation"
      elevation={1}
      sx={(theme) => ({
        p: 4,
        position: "relative",
        py: 2,
        overflow: "hidden",
        fontWeight: 0,
        boxShadow: "0px 1px 3px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minHeight: "min-content",
        minWidth: "min-content",
      })}
    >
      <Collapse
        in={open}
        sx={{ position: "absolute", zIndex: 1, bottom: 5, width: "90%" }}
      >
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {submitSatus.msg}
        </Alert>
      </Collapse>

      <Stack spacing={5} direction="row" sx={{ height: "100%" }}>
        {/* IMAGE */}
        <Box sx={{ flexGrow: 1 }} position="relative">
          <CardMedia
            sx={(theme) => ({
              width: "100%",
              height: "90%",
              objectFit: "cover",
              minHeight: "155px",
              minWidth: "155px",
              borderRadius: theme.shape.borderRadius,
            })}
            component="img"
            image={image} //image src
          />
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
              sx={(theme)=>({
                p: 0,
                display: "flex",
                [theme.breakpoints.down("sm",)]: {
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
