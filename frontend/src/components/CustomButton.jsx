import { Button } from "@mui/material";

export default function CustomButton({
  color = "red",
  style,
  children,
  ...props
}) {
  const buttonColor = color == "red" ? "primary" : "secondary";
  return (
    <Button
      variant="contained"
      color={buttonColor}
      sx={[style, buttonStyle]}
      {...props}
    >
      {children}
    </Button>
  );
}

const buttonStyle = {
  boxShadow: "none",
  fontSize: "1rem",
  paddingTop: 0.5,
  paddingBottom: 0.5,
  textTransform: "none",
  '&.MuiButton-root': {
      textTransform: 'none', // Overrides text transformation
    },
    '&.MuiButtonBase-root': {
      textTransform: 'none', // Overrides text transformation
    },
};

// Documentation
// -----------------------
// color: "red" or "black"
// style: to override styling
