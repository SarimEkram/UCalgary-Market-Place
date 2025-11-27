import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Icon,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import CustomButton from "./CustomButton";
import Reported from "../assets/Reported";

export default function PostCard({
  key,
  image,
  primaryText,
  reportDate,
  numReports,
}) {
  // import relativeTime from 'dayjs/plugin/relativeTime' // ES 2015

  dayjs.extend(relativeTime);
  const [date, setDate] = useState(dayjs(reportDate).fromNow());

  return (
    <Card
      variant="elevation"
      // raised={false}
      elevation={1}
      key={key}
      sx={(theme) => ({
        // boxSizing: "border-box",
        p: 4,
        py: 2,
        overflow: "hidden",
        fontWeight: 0,
        boxShadow: "0px 1px 3px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minHeight: 'min-content',
        // my: 2,
      })}
    >
      <Stack spacing={5} direction="row" sx={{ height: "100%" }}>
        {/* IMAGE */}
        <Box sx={{ flexGrow: 1 }} position="relative">
          <CardMedia
            sx={(theme) => ({
              width: "100%",
              height: "90%",
              objectFit: "cover",
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
            sx={{ gap: 10, height: "100%" }}
          >
            <Box>
              <Typography
                variant="body1"
                sx={{
                  mt: 0,
                  // fontSize: { xs: "0.8rem", md: "0.9rem" },
                }}
              >
                {primaryText}
              </Typography>
            </Box>
            <CardActions
              sx={{
                p: 0,
                display: "flex",
                flexDirection: "row",
                gap: 2,
                justifyContent: "center",
                alignItems: "stretch",
              }}
            >
              <CustomButton style={{ width: "100%" }} color="black">
                View
              </CustomButton>
              <CustomButton style={{ width: "100%" }}>Delete</CustomButton>
            </CardActions>
          </Stack>
        </CardContent>
      </Stack>

      <Typography
        component="div"
        sx={{ textAlign: "center" }}
        variant="body1"
        color="textSecondary"
        visibility={reportDate ? "visible" : "hidden"}
      >
        {numReports} Reported • {date}
      </Typography>
    </Card>
  );
}
