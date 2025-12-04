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
import { Link as RouterLink, useNavigate, useParams } from "react-router";
import CustomButton from "../components/CustomButton";
import DateRangeDialog from "../components/DateRangeDialog";
import Header from "../components/Header";
import ImageSlider from "../components/ImageSlider";
import InputField from "../components/InputField";
import DesktopNav from "../components/DesktopNav";
import MobileNav from "../components/MobileNav";
import ConfirmationPopup from "../components/ConfirmationPopup";

import dayjs from "dayjs";

// incomplete backend tasks, can be found using ctrl+f "TODO".
export default function EditEvent() {
  //get user data from local storage
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const navigate = useNavigate();

  //get post id from url
  let { id } = useParams();

  //keep track of selected images
  const [images, setImages] = useState([]);

  // current selected date
  const [range, setRange] = useState({ start: null, end: null });

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


  //confirmation popuop 
  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      const response = await fetch(
        `/api/posts/eventdetails/${id}`,
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

      let startDate = dayjs(data.event_start);
      let endDate = dayjs(data.event_end);
      if (endDate.$d.toDateString() == startDate.$d.toDateString()) {
        endDate = null;
      }
      setRange({ start: startDate, end: endDate });

      //set default values in the form
      reset({
        title: data.title,
        description: data.description,
        organization_name: data.organization_name,
        location: data.postal_code,
        price: data.price ?? "",
      });
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

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

  //send an edit request to the server
  const onSubmit = async (data) => {
    const { start, end } = range;

    // safety: no date selected → fail fast
    if (!start) {
      setEditFailed(true);
      return;
    }

    const eventStart = start.format("YYYY-MM-DD HH:mm:ss");
    const eventEnd =
      end == null
        ? start.format("YYYY-MM-DD HH:mm:ss")
        : end.format("YYYY-MM-DD HH:mm:ss");

    const formData = new FormData();
    formData.append("userId", userData.id); // from localStorage
    formData.append("postId", id); // from useParams

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("location", data.location);

    let priceToSend = data.price;
    if (priceToSend === undefined || priceToSend === null) {
      priceToSend = "";
    }
    formData.append("price", priceToSend);

    formData.append("organization_name", data.organization_name);
    formData.append("event_start", eventStart);
    formData.append("event_end", eventEnd);

    // deleted_images as JSON string for backend
    formData.append("deleted_images", JSON.stringify(deletedImages || []));

    // attach new images
    Array.from(newImages).forEach((file) => {
      formData.append("new_images", file); // matches upload.array("new_images")
    });

    try {
      const resp = await fetch("/api/my-events/edit", {
        method: "PUT",
        body: formData,
      });

      if (!resp.ok) {
        console.error("Edit event failed:", resp.status);
        setEditFailed(true);
        return;
      }

      const result = await resp.json();
      console.log("Edit event success:", result);
      navigate("/user/events");
    } catch (err) {
      console.error("Network error editing event:", err);
      setEditFailed(true);
    }
  };

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

  //turn new uploads into rendable URLs
  const getNewImages = () => {
    let imgs = Array.from(newImages);
    imgs = imgs.map((img) => ({
      src: URL.createObjectURL(img),
      label: img.name,
    }));
    console.log(imgs);
    return imgs;
  };

  //send delete request to server
  const onDelete = async () => {
    setConfirmOpen(true);
  };

  const confirmedDelete = async()=>{
    const resp =   await fetch(
        "/api/my-events/delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userData.id, postId: id }),
        }
      );

      return resp; 

  };


  const callBackDelete = (ok)=>{
    if (ok) {
        navigate("/user/events");
      } else {
        console.error("Delete event failed:", data.error);
        
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
          <ConfirmationPopup
            warningMessage={" Do You Want To Proceed With Deleting Your Post ?"}
            open={confirmOpen}
            handleClose={() => {
              setConfirmOpen(false);
            }}
            executeFunction={confirmedDelete}
            callBack={callBackDelete}
          ></ConfirmationPopup>
          <CustomButton
            onClick={onDelete}
            style={{ alignSelf: "flex-end", pb: 2 }}
          >
            Delete
          </CustomButton>

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
                  validate: (value) =>
                    value === "" ||
                    Number(value) >= 0 ||
                    "Price must be 0 or greater.",
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
