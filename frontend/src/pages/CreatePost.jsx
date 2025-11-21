import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  Box,
  Container,
  Divider,
  FormHelperText,
  Input,
  Link,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ProfileIcon from "../assets/ProfileIconSVG";
import CustomButton from "../components/CustomButton";
import Header from "../components/Header";
import InputField from "../components/InputField";
import { Link as RouterLink } from "react-router";
// 1 Backend Tasks (Ctrl+F "BTASK")
export default function CreatePost() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [createFailed, setCreateFailed] = useState(false);
  const [newImages, setNewImages] = useState([]);

  //set the current image in image slider
  const [currentImage, setCurrentImage] = useState(null);

  const fileInputRef = useRef(null);

  const onSubmit = (data) => {
    data["condition"] = condition;
    data["images"] = Array.from(newImages);
    console.log(
      "send create post request to the server... using this data:",
      data
    );
    /*
    *
     * 
     BTASK
     ------
    create post.    

     Example Data
     --------
    {
    "name": "eni",
    "description": "rni",
    "location": "t3a2m1",
    "price": 13,
    "condition": "new",
    "images": [Fileobject, Fileobject  ]
}
}
     */

    const success = true;
    if (success) {
      //navigate to home page
    } else {
      setCreateFailed(true);
    }
  };

  const [condition, setCondition] = useState("new");

  const handleConditionChange = (event, value) => {
    if (value != null) {
      setCondition(value);
    }
    console.log(condition);
  };

  function handleDeletedImage() {
    //tldr xD
  }

  const handleImagesChange = (event) => {
    const newFiles = event.target.files;
    if (newFiles.length != 0) {
      setNewImages(newFiles);
    }
  };

  const printImageNames = (files) => {
    let result = "";
    console.log("files", files);
    for (let i = 0; i < files.length; i++) {
      result += (result != "" ? ", " : "") + files[i].name;
    }

    return result;
  };

  return (
    <Stack direction="column" spacing={2} sx={styles.page}>
      <Header></Header>
      <Container maxWidth={"sm"} sx={styles.main}>
        <RouterLink to=".." style={{textDecoration : "none"}}>
          <Link
            color="secondary"
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              textDecoration: "none",
            }}
            variant="text"
          >
            <ChevronLeftIcon></ChevronLeftIcon>
            <Typography variant="h6" sx={{ fontWeight: "400" }}>
              Back to My Posts
            </Typography>
          </Link>
        </RouterLink>
        <Divider
          variant="fullWidth"
          sx={(theme) => ({
            boxSizing: "border-box",
            borderBottom: theme.palette.dividerWidth,
            borderColor: theme.palette.divider,
            marginTop: 3,
            marginBottom: 3,
          })}
        ></Divider>
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
              placeholder={"15.00"}
              label={"Price"}
              type="number"
              errorMsg={errors["price"] ? errors["price"].message : null}
              {...register("price", {
                required: "Price is required.",
                valueAsNumber: true,
              })}
            ></InputField>
            <ToggleButtonGroup
              id="condition-toggle"
              value={condition}
              exclusive
              onChange={handleConditionChange}
              sx={{
                "& .MuiToggleButtonGroup-root": {
                  color: "#000509",
                  backgroundColor: "#F0F0F3",
                  textTransform: "none",
                  fontWeight: "400",
                  lineHeight: 0.7,
                },

                "& .MuiButtonBase-root": {
                  color: "#000509",
                  backgroundColor: "#F0F0F3",
                  textTransform: "none",
                  fontWeight: "400",
                  lineHeight: 0.7,
                },
              }}
            >
              <ToggleButton value="new" data-selected={condition == "new"}>
                New
              </ToggleButton>
              <ToggleButton value="good" data-selected={condition == "good"}>
                Good
              </ToggleButton>
              <ToggleButton value="fair" data-selected={condition == "fair"}>
                Fair
              </ToggleButton>
            </ToggleButtonGroup>
            <Box id="edit-images" sx={{ position: "relative" }}>
              {/* temporary placeholder until the image slider is done */}
              <div style={{ backgroundColor: "grey" }}>
                <div style={{ visibility: "hidden" }}>
                  <ProfileIcon></ProfileIcon>
                </div>
              </div>
              <CustomButton
                style={{
                  width: "fit-content",
                  position: "absolute",
                  top: 0,
                  right: 0,
                  margin: 2,
                }}
                color={"red"}
                onClick={handleDeletedImage}
              >
                {"Delete"}
              </CustomButton>
            </Box>
            <Stack spacing={3}>
              <CustomButton
                color="black"
                onClick={() => {
                  fileInputRef.current.children[0].click();
                }}
              >
                Add Image
              </CustomButton>

              <Typography
               
                sx={[{ fontSize: "1rem", visibility: newImages.length != 0 }]}
              >
                Selected files:{" "}
                {newImages.length != 0 && printImageNames(newImages)}
              </Typography>

              <CustomButton type="submit">Edit</CustomButton>
            </Stack>
          </Stack>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            sx={{ display: "none" }}
            inputProps={{ multiple: true }}
            onChange={handleImagesChange}
            disableUnderline
          ></Input>
        </form>
        <Stack spacing={2} sx={styles.bottomContent}>
          <FormHelperText
            error={true}
            sx={[
              { textAlign: "center", fontSize: "1rem" },
              { visibility: createFailed ? "visible" : "hidden" },
            ]}
          >
            Failed to create the post.<br></br>Please try again.
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
    paddingTop: 3,
  },

  bottomContent: {
    paddingTop: 2,
  },

  stackRow: {
    justifyContent: "center",
    alignItems: "center",
  },
};
