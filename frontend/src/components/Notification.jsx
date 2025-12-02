
export default function Notification({message, open, setOpen}) {
  return (
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
          {message}
        </Alert>
      </Collapse>
  )
}
