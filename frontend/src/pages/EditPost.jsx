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
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useParams } from "react-router";
import CustomButton from "../components/CustomButton";
import Header from "../components/Header";
import ImageSlider from "../components/ImageSlider";
import InputField from "../components/InputField";

// incomplete backend tasks, can be found using ctrl+f "TODO". 
export default function EditPost() {
  //get user data from local storage
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  //get post id from url
  let { id } = useParams();

  //keep track of selected images
  const [images, setImages] = useState([]);

  //store the item condition
  const [condition, setCondition] = useState("new");

  //react hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  //prefill form inputs
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      const response = await fetch(
        `http://localhost:8080/api/posts/itemdetails/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("json response", data);

      //TODO: BTASK 
      // Images aren't being passed in responses. 
      let dataImages = await Promise.all(
        data.images.map(async (image) => {
          let imageBlob = await image.data.blob();

          //delete if the Content/type from server is set to jpeg/png correctly.
          imageBlob = new Blob([imageBlob], { type: "image/jpeg" });

          imageBlob = URL.createObjectURL(imageBlob);

          image.data = imageBlob;

          return image;
        })
      );

      dataImages = dataImages.map((image, index) => ({
        label: "event-image-" + index,
        id: image.image_id,
        src: image.data,
      }));

      setImages(dataImages);
      setCondition(data.item_condition.toLowerCase());
      reset({
        title: data.title,
        description: data.description,
        location: data.postal_code,
        price: data.price,
      });
    }
    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const [editFailed, setEditFailed] = useState(false);
  const [deletedImages, setDeletedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const fileInputRef = useRef(null);
  // TODO: find  a way to handle deleted images
  const onSubmit = (data) => {
    data["condition"] = condition;
    data["deleted_images"] = deletedImages;
    data["new_images"] = Array.from(newImages);
    console.log(
      "send edit post request to the server... using this data:",
      data
    );
    /**
     * 
     BTASK
     ------
     Updated an edit post.    

     Example Data
     --------
    {
    "title": "eni",
    "description": "rni",
    "location": "t3a2m1",
    "price": 13,
    "condition": "new",
    "deleted_images": [image_id1, imageid_2...etc],
    "new_images": [Fileobject, Fileobject  ]
}
}
     */

    const success = true;
    if (success) {
      //navigate to home page
    } else {
      setEditFailed(true);
    }
  };

  // handle a user changing the item condition
  const handleConditionChange = (event, value) => {
    if (value != null) {
      setCondition(value);
    }
    console.log(condition);
  };

  //handle deleted images
  function handleDeletedImage() {
    let imgs = Array.from(deletedImages);
    imgs.push(currentImage);
    setDeletedImages(imgs);
    console.log("delete image using this data...", data);
  }

  //handle new image uploads
  const handleImagesChange = (event) => {
    const newFiles = event.target.files;
    if (newFiles.length != 0) {
      setNewImages(newFiles);
    }
  };

  //print the name of the uploaded images
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
        <RouterLink to=".." style={{ textDecoration: "none" }}>
          <Link
            component="div"
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
              placeholder={"Title"}
              label={"Title"}
              errorMsg={errors["title"] ? errors["title"].message : null}
              {...register("title", {
                required: "Title is required.",
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
              <ImageSlider images={images}></ImageSlider>
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

              <CustomButton type="submit">Save Changes</CustomButton>
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
