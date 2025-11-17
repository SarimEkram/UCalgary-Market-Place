import {
  Box,
  Container,
  FormHelperText,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ProfileIcon from "./assets/ProfileIconSVG";
import CustomButton from "./components/CustomButton";
import Header from "./components/Header";
import InputField from "./components/InputField";

// 1 Backend Tasks (Ctrl+F "BTASK")
export default function MyPosts() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [editFailed, setEditFailed] = useState(false);
  const onSubmit = (data) => {
    data["condition"] = condition;
    console.log("send edit post request to the server... using this data:", data);
    /**
     * 
     BTASK
     ------
     Validating a login attempt.
     Setting the variable `success` based on the results.   

     Example Data
     --------
     {
    "email": "enibalo2@gmail.com",
    "password": "butter123#"
    
    }
     */

    const success = true;
    if (success) {
      //navigate to home page
    } else {
      setEditFailed(true);
    }
  };

  const [condition, setCondition] = useState("new");
  const handleConditionChange = (value) => {
    setCondition(value);
  };

  return (
    <Stack id="login" direction="column" spacing={2} sx={styles.page}>
      <Header></Header>
      <Container maxWidth={"sm"} sx={styles.main}>
        
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack direction="column" component={"div"} spacing={4}>
            <InputField
              placeholder={"Name"}
              label={"Name"}
              errorMsg={errors["name"] ? errors["name"].message : null}
              {...register("name", {
                required: "Name is required.",
                maxLength: {
                  value: 255,
                  message: "Maximum length of 255 characters.",
                },
              })}
            ></InputField>
            <InputField
              multiline
              disableUnderline
              addPadding
              sx={(theme) => ({
                boxSizing: "border-box",
                padding: 1,
                border: 2,
                borderColor: theme.palette.inputBorderColor,
                borderRadius: 2,
              })}
              minRows={5}
              placeholder={"Description"}
              label={"Description"}
              inputProps={{ type: "description" }}
              errorMsg={
                errors["description"] ? errors["description"].message : null
              }
              {...register("description", {
                required: "Description is required.",
              })}
            ></InputField>
            <InputField
              placeholder={"T1B 2C3"}
              label={"Location (Your Postal Code)"}
              errorMsg={errors["location"] ? errors["location"].message : null}
              {...register("location", {
                required: "Location is required.",
                maxLength: {
                  value: 20,
                  message: "Maximum length of 20 characters.",
                },
              })}
            ></InputField>
            <InputField
              placeholder={"Ex: 15.00/hr, 15.00/session, 20.00"}
              label={"Price"}
              errorMsg={errors["price"] ? errors["price"].message : null}
              {...register("price", {
                required: "Price is required.",
              })}
            ></InputField>
            <ToggleButtonGroup
              color="secondary"
              value={condition}
              exclusive
              onChange={handleConditionChange}
            >
              <ToggleButton value="new">New</ToggleButton>
              <ToggleButton value="good">Good</ToggleButton>
              <ToggleButton value="fair">Fair</ToggleButton>
            </ToggleButtonGroup>
             <CustomButton color="black" type="submit">Add Image</CustomButton>
            <CustomButton type="submit">Edit</CustomButton>
          </Stack>
        </form>
        <Stack spacing={2} sx={styles.bottomContent}>
          <FormHelperText
            error={true}
            sx={[
              { textAlign: "center", fontSize: "1rem" },
              { visibility: editFailed ? "visible" : "hidden" },
            ]}
          >
            Failed to updat the post.<br></br>Please try again.
          </FormHelperText>
        </Stack>
      </Container>
    </Stack>
  );
}

const styles = {
  icon: {
    alignSelf: "center",
    paddingBottom: 5,
  },
  page: {
    bgcolor: "background.paper",
    minHeight: "100vh",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "space-between",
    padding: 10,
  },

  bottomContent: {
    paddingTop: 2,
  },

  stackRow: {
    justifyContent: "center",
    alignItems: "center",
  },
};
