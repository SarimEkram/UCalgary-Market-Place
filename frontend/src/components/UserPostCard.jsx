import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";

export default function PostCard({
  key,
  link,
  image,
  primaryText,
  secondaryText,
  tertiaryText,
  TopLeftAction,
  disableNavigation = false, //for cards that shouldn't navigate to the post details page when clicked
}) {
  const navigate = useNavigate();
  if (disableNavigation == false) {
    return (
      <Card
        variant="outlined"
        raised={false}
        square
        key={key}
        sx={(theme) => ({
          boxSizing: "border-box",
          padding: 3,
          overflow: "hidden",
          border: "0px",
          borderTop: 0.75,
          borderColor: theme.palette.divider,
          fontWeight: 0,
        })}
      >
        <Stack spacing={2} direction="row">
          <CardActionArea sx={{p: 3}} onClick={() => navigate(link)}>
            {/* IMAGE */}
            <CardContent sx={{ px: 0 }}>
              <Stack
                direction={"row"}
                spacing={2}
                sx={{ alignItems: "flex-start" }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      mt: 0,
                    }}
                  >
                    {primaryText}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{}}
                    noWrap
                  >
                    {secondaryText}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        display: "block",
                      },
                    }}
                    noWrap
                  >
                    {tertiaryText}
                  </Typography>
                </Box>
                <TopLeftAction sx={{ flexGrow: 0 }}></TopLeftAction>
              </Stack>
            </CardContent>
            <CardMedia
              sx={(theme) => ({
                width: "100%",
                height: { xs: 220, sm: 260, md: 320 },
                objectFit: "cover",
                borderRadius: theme.shape.borderRadius,
              })}
              component="img"
              image={image} //image src
            />
          </CardActionArea>
        </Stack>
      </Card>
    );
  } else {
    return (
      <Card
        variant="outlined"
        raised={false}
        square
        key={key}
        sx={(theme) => ({
          boxSizing: "border-box",
          padding: 3,
          overflow: "hidden",
          border: "0px",
          borderTop: 0.75,
          borderColor: theme.palette.divider,
          fontWeight: 0,
        })}
      >
        <Box>
          {/* IMAGE */}
          <CardContent sx={{ px: 0 }}>
            <Stack
              direction={"row"}
              spacing={2}
              sx={{ alignItems: "flex-start" }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    mt: 0,
                  }}
                >
                  {primaryText}
                </Typography>

                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{}}
                  noWrap
                >
                  {secondaryText}
                </Typography>

                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      display: "block",
                    },
                  }}
                  noWrap
                >
                  {tertiaryText}
                </Typography>
              </Box>
              <TopLeftAction sx={{ flexGrow: 0 }}></TopLeftAction>
            </Stack>
          </CardContent>
          <CardMedia
            sx={(theme) => ({
              width: "100%",
              height: { xs: 220, sm: 260, md: 320 },
              objectFit: "cover",
              borderRadius: theme.shape.borderRadius,
            })}
            component="img"
            image={image} //image src
          />
        </Box>
      </Card>
    );
  }
}
