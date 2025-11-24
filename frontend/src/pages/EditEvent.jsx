import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  Box,
  Container,
  Divider,
  FormHelperText,
  Input,
  InputLabel,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ProfileIcon from "../assets/ProfileIconSVG";
import CustomButton from "../components/CustomButton";
import Header from "../components/Header";
import InputField from "../components/InputField";
import { Link as RouterLink, useParams } from "react-router";
import DateRangeDialog from "../components/DateRangeDialog";
import ImageSlider from "../components/ImageSlider";
import MyImage from "../assets/career_fair_poster.jpg";

import dayjs from "dayjs";
// 2 Backend Tasks (Ctrl+F "BTASK")
export default function EditEvent() {
  //get user data from local storage
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  //get post id from url
  let { id } = useParams();

  //keep track of selected images
  const [images, setImages] = useState([]);

  // current selected date
  const [range, setRange] = useState({ start: null, end: null });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    let isMounted = true;
    const formData = { event_id: id };
    async function fetchData() {
      console.log("fetch event information using this id...", id);
      const response = await fetch(MyImage);
     

      const data = {
        name: "any comp-sci event",
        description: "be there or be square",
        location: "xxx yyy",
        price: 13,
        images: [response],
        start: "2025-09-02 00:00:00",
        end: "2025-09-13 00:00:00",
      };

      let dataImages = await Promise.all(
        data.images.map(async (image) => {
          let imageBlob = await image.blob();
          
          //delete if the Content/type from server is set to jpeg/png correctly.
          imageBlob = new Blob([imageBlob], { type: "image/jpeg" });

          imageBlob = URL.createObjectURL(imageBlob);
          

          return imageBlob;
        })
      );

      dataImages = dataImages.map((image, index) => ({
        label: "event-image-" + index,
        src: image,
      }));


      setImages(dataImages);

      setRange({ start: dayjs(data.start_date), end: dayjs(data.end_date) });

      reset({
        name: data.name,
        description: data.description,
        location: data.location,
        price: data.price,
      });


    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  //keep track of status of edit request to server
  const [editFailed, setEditFailed] = useState(false);

  //keep track of deleted images
  const [deletedImages, setDeletedImages] = useState([]);

  //keep track of new images
  const [newImages, setNewImages] = useState([]);

  //variable for Date Picker dialog state
  const [open, setOpen] = useState(false);

  //ref for input[type="file"]
  const fileInputRef = useRef(null);

  //handle a user changing the date
  const handleApply = (newRange) => {
    if (newRange.start.$d.toDateString() === newRange.end.$d.toDateString()) {
      newRange.end = null;
    }
    setRange(newRange);
  };

  //turn the current date-range into a humand-readable string
  const getDate = () => {
    const { start, end } = range;

    //handle a user not selecting any date
    if (!start) {
      return "No date selected.";
      //handle events with start and end date
    } else if (start && end) {
      //format will look like this: Nov 03 2025
      return start.format("MMM DD YYYY") + " - " + end.format("MMM DD YYYY");
      //handle evenrs with only one date
    } else {
      return start.format("MMM DD YYYY");
    }
  };

  //make sure that the user has selected a date
  const validateDate = () => {
    return !(range.end == null && range.start == null)
      ? true
      : "Date is required.";
  };

  // TODO: find  a way to handle deleted images

  //send an edit request to the server
  const onSubmit = (data) => {
    data["deleted_images"] = deletedImages;
    data["images"] = Array.from(newImages);
    const { start, end } = { range };
    data["start_date"] = start.format("YYYY-MM-DD HH:mm:ss");
    data["end_date"] = end.format("YYYY-MM-DD HH:mm:ss");
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
    "name": "eni",
    "description": "rni",
    "location": "t3a2m1",
    "price": 13,
    "start_date": YYYY-MM-DD HH:mm:ss,
    "end_date": YYYY-MM-DD HH:mm:ss or null [for one day events], 
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

  //handle deleted images
  function handleDeletedImage() {
    //tldr XD
  }

  // handle new image uploads by the user
  const handleImagesChange = (event) => {
    const newFiles = event.target.files;
    if (newFiles.length != 0) {
      setNewImages(newFiles);
    }
  };

  //print names of a list of file objects
  const printImageNames = (files) => {
    let result = "";

    for (let i = 0; i < files.length; i++) {
      result += (result != "" ? ", " : "") + files[i].name;
    }

    return result;
  };

  //TODO: finish getPost
  // send get event post request to the server
  const getPost = () => {
    /**
     * BTASK 
     * GET POST
     * ----- 
     * USER ID: 
     * POST ID: 
     * 
     {
     user_id:1234 
      post_id: 45678
      }
     * 
     */
  };

  return (
    <Stack direction="column" spacing={2} sx={styles.page}>
      <Header></Header>
      <Container maxWidth={"sm"} sx={styles.main}>
        <RouterLink to=".." style={{ textDecoration: "none" }}>
          <Link
            component={"div"}
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
              Back to My Events
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
            <Box>
              <InputLabel shrink>Date</InputLabel>
              <Input
                sx={(theme) => ({
                  width: "100%",
                  "& .Mui-disabled": {
                    color: theme.palette.text.primary,
                    WebkitTextFillColor: "unset",
                  },
                })}
                value={getDate()}
                disabled={true}
                disableUnderline={true}
                {...register("date", {
                  validate: validateDate,
                })}
              ></Input>
              <CustomButton
                style={{
                  width: "fit-content",
                }}
                color={"black"}
                onClick={() => setOpen(true)}
              >
                {"Change Date"}
              </CustomButton>
              <DateRangeDialog
                open={open}
                onClose={() => setOpen(false)}
                onApply={handleApply}
                initialRange={range}
              />
            </Box>

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
