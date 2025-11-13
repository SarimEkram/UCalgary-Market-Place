import { FormControl, FormHelperText, Input, InputLabel } from "@mui/material";

export default function InputField({
  autoComplete,
  label,
  placeholder,
  helpText,
  inputProps
}) {
  return (
    <FormControl
      required={true}
      variant="standard"
      fullWidth
      autoComplete={autoComplete}
    >
      <InputLabel
        shrink
        htmlFor={label + "-input"}
      >
        {label}
      </InputLabel>
      <Input {...inputProps} placeholder={placeholder} id={label + "-input"} aria-describedby={label + "-helper-text"} />
      <FormHelperText
        disabled
        sx={{
          "&.Mui-disabled": { visibility: "hidden" },
          "&.Mui-error": { visibility: "initial" },
        }}
        id={label + "-helper-text"}
      >
        *Required field. {helpText}
      </FormHelperText>
    </FormControl>
  );
}
