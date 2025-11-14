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
      onClick={onClick}
      sx={[style, { bgColor: buttonColor }, buttonStyle]}
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
  paddingBottom: 0.5
};

// Documentation
// -----------------------
// color: "red" or "black"
// style: to override styling
