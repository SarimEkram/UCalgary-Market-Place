import {
    Box, Card, CardActionArea,
    CardContent,
    CardMedia, Stack, Typography
} from "@mui/material";


export default function PostCard({
  key,
  image,
  primaryText,
  secondaryText,
  tertiaryText,
  TopLeftAction,
}) {
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
        <CardActionArea>
          {/* IMAGE */}
          <CardContent sx={{px: 0}}>
            <Stack direction={"row"} spacing={2} sx={{  alignItems: "flex-start"}}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    mt: 0,
                    // fontSize: { xs: "0.8rem", md: "0.9rem" },
                  }}
                >
                  {primaryText}
                </Typography>

                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{
                    // fontSize: { xs: "0.7rem", md: "0.75rem", display: "block" },
                  }}
                  noWrap
                >
                  {secondaryText}
                </Typography>

                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      // xs: "0.7rem",
                      // md: "0.75rem",
                      display: "block",
                    },
                  }}
                  noWrap
                >
                  {tertiaryText}
                </Typography>
              </Box>
              <TopLeftAction style={{ flexGrow: 0 }}></TopLeftAction>
            </Stack>
          </CardContent>
          <CardMedia
            sx={(theme)=>({
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
}
