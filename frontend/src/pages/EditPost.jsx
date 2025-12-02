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
import { Link as RouterLink, useNavigate, useParams } from "react-router";
import CustomButton from "../components/CustomButton";
import Header from "../components/Header";
import ImageSlider from "../components/ImageSlider";
import InputField from "../components/InputField";
import DesktopNav from "../components/DesktopNav";
import MobileNav from "../components/MobileNav";

// incomplete backend tasks, can be found using ctrl+f "TODO".
export default function EditPost() {
  //get user data from local storage
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  //get post id from url
  const { id } = useParams();

  //keep track of selected images
  const [images, setImages] = useState([]);

  //store the item condition
  const [condition, setCondition] = useState("new");

  //keep trac of submit stauts
  const [editFailed, setEditFailed] = useState(false);
  //keep track of ids of deleted images
  const [deletedImages, setDeletedImages] = useState([]);
  //store file objects of the images the user uploads
  const [newImages, setNewImages] = useState([]);

  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const [deleteFailed, setDeleteFailed] = useState(false);

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

      let dataImages = data.images.map((image, index) => {
        const blob = image.data.replace(/\s/g, "");
        const src = `data:image/jpeg;base64,${blob}`;
        return {
          label: "event-image-" + index,
          image_id: image.image_id,
          src: src,
        };
      });

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
     TODO: BTASK
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
    "deleted_images": [401, 402...etc], list of image ids 
    "new_images": [Fileobject, Fileobject]
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
  };

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

    for (let i = 0; i < files.length; i++) {
      result += (result != "" ? ", " : "") + files[i].name;
    }

    return result;
  };


  //turn new uploads into rendable URLs
  const getNewImages = ()=>{
    let imgs = Array.from(newImages);
    imgs = imgs.map((img )=> ({src : URL.createObjectURL(img), label : img.name}));
    console.log(imgs);
    return imgs;
  }

   const onDelete = async ()=>{
      try {
      const response = await fetch("http://localhost:8080/api/my-posts/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({userId : userData.id, postId: id}),
      });

      const data = await response.json();
      //navigate to My posts on success
      if (response.ok) {
        navigate("/user/market");
      } else {
        // Handle case where delete failed for some reason
         setDeleteFailed(data.error);
         
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again later.");
    }  
  }

  return (
    <Stack
      direction="row"
      sx={{ bgcolor: "background.paper", minHeight: "100vh" }}
    >
      <DesktopNav></DesktopNav>
      <Box sx={{ flex: "1", m: 0 }}>
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
           <CustomButton onClick={onDelete} style={{alignSelf: 'flex-end', pb: 2}}>Delete</CustomButton>
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
                errorMsg={
                  errors["location"] ? errors["location"].message : null
                }
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
              <ImageSlider
                images={images}
                uploadedImages={getNewImages()}
                setDeletedImages={setDeletedImages}
                showDelete
              ></ImageSlider>
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
      </Box>
      <MobileNav></MobileNav>
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
    p: 5,
    mb: 10,
  },

  bottomContent: {
    paddingTop: 2,
  },

  stackRow: {
    justifyContent: "center",
    alignItems: "center",
  },
};
