import { FormControl, FormHelperText, Input, InputLabel, Box } from "@mui/material";

export default function InputField({
  autoComplete,
  label,
  placeholder,
  helpText,
  errorMsg,
  addPadding,
  ...inputProps
}) {
  return (
    <FormControl
      variant="standard"
      fullWidth
      autoComplete={autoComplete}
      error={errorMsg ? true : false}
    >
      {helpText && (
        <FormHelperText
        component={"div"}
          sx={(theme) => {
            return { color: theme.palette.text.primary, paddingTop: 1};
          }}
          id={label + "-helper-text"}
        >
          {helpText}
        </FormHelperText>
      )}
      <InputLabel shrink htmlFor={label + "-input"}>
        {label}
      </InputLabel>
      { addPadding && <Box sx={{margin: 2}}></Box>}
      <Input
        {...inputProps}
        type="text"
        placeholder={placeholder}
        id={label + "-input"}
      />
      {errorMsg && (
        <FormHelperText id={label + "-error-text"}>{errorMsg}</FormHelperText>
      )}
    </FormControl>
  );
}
