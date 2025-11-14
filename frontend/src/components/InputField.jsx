import { FormControl, FormHelperText, Input, InputLabel } from "@mui/material";

export default function InputField({
  autoComplete,
  label,
  placeholder,
  helpText,
  errorMsg,
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
