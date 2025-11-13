import { Button } from "@mui/material";

export default function CustomButton({
  color = "red",
  style,
  onClick,
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
  paddingTop: 1,
  paddingBottom: 1,
};

// Documentation
// -----------------------
// color: "red" or "black"
// style: style object passed to sx
// onCLick:  onClick function
