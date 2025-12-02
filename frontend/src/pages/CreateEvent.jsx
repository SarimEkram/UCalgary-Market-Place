import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  InputLabel,
  Box,
  Container,
  Divider,
  FormHelperText,
  Input,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router";
import ProfileIcon from "../assets/ProfileIconSVG";
import CustomButton from "../components/CustomButton";
import Header from "../components/Header";
import InputField from "../components/InputField";
import DateRangeDialog from "../components/DateRangeDialog";
import DesktopNav from "../components/DesktopNav";
import MobileNav from "../components/MobileNav";
import ImageSlider from "../components/ImageSlider";

// backend tasks, can be found using ctrl+f "TODO".
export default function CreateEvent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // get user info
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  // navigate for change page on submit
  const navigate = useNavigate();

  // keep track of status of server request
  const [createFailed, setCreateFailed] = useState(false);
  // keep track of new images
  const [newImages, setNewImages] = useState([]);

  //ref of the input[type="file"]
  const fileInputRef = useRef(null);

  // current selected date
  const [range, setRange] = useState({ start: null, end: null });

  //variable for Date Picker dialog state
  const [open, setOpen] = useState(false);

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

  // submit create request to server
  const onSubmit = async (data) => {
    const { start, end } = range;

    if (!start) {
      setCreateFailed(true);
      return;
    }

    // backend expects event_start / event_end
    const eventStart = start.format("YYYY-MM-DD HH:mm:ss");

    // if end is null (single-day event), just use same timestamp for now
    // (if you later relax backend validation, you can send null instead)
    const eventEnd = end
      ? end.format("YYYY-MM-DD HH:mm:ss")
      : eventStart;

    // files
    const imagesArray = Array.from(newImages);

    const formData = new FormData();
    formData.append("userId", userData.user_id);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("location", data.location);
    formData.append("price", data.price); // optional is handled on backend
    formData.append("organization_name", data.organization_name);
    formData.append("event_start", eventStart);
    formData.append("event_end", eventEnd);

    imagesArray.forEach((file) => {
      // matches upload.array("images") in myEventsRoute.js
      formData.append("images", file);
    });

    try {
      const resp = await fetch(
        "http://localhost:8080/api/my-events/create",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!resp.ok) {
        console.error("Create event failed:", resp.status);
        setCreateFailed(true);
        return;
      }

      const result = await resp.json();
      console.log("Create event success:", result);

      // go back to My Events page
      navigate("/user/events");
    } catch (err) {
      console.error("Network error creating event:", err);
      setCreateFailed(true);
    }
  };

  // handle newly uploaded images
  const handleImagesChange = (event) => {
    const newFiles = event.target.files;
    if (newFiles.length != 0) {
      setNewImages(newFiles);
    }
  };

  //print the names of a list of FIle objects
  const printImageNames = (files) => {
    let result = "";

    for (let i = 0; i < files.length; i++) {
      result += (result != "" ? ", " : "") + files[i].name;
    }

    return result;
  };

  const getImages = () => {
    if (newImages) {
      let tempImages = Array.from(newImages);
      return tempImages.map((img) => {
        let imgObject = {};
        imgObject["src"] = URL.createObjectURL(img);
        imgObject["label"] = img.name;
        return imgObject;
      });
    } else {
      return [];
    }
  };

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
                placeholder={"Organization Name"}
                label={"Organization Name"}
                errorMsg={
                  errors["organization_name"]
                    ? errors["organization_name"].message
                    : null
                }
                {...register("organization_name", {
                  required: "Organization name is required.",
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
              <ImageSlider images={getImages()}></ImageSlider>
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

                <CustomButton type="submit">Create</CustomButton>
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
