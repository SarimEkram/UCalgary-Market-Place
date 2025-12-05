import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  IconButton,
  MobileStepper,
  Typography,
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import CustomButton from "../components/CustomButton";

// Use a shared empty array so default props are stable across renders
const EMPTY_ARRAY = [];

// Sample input
//-------------------------
// images = [
//   {
//     label: "Img 1",
//     src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
//   },
//   {
//     label: "Img 2",
//     src: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c",
//   },
//   {
//     label: "Img 3",
//     src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
//   },
// ];

export default function ImageSlider({
  images = EMPTY_ARRAY,
  uploadedImages = EMPTY_ARRAY,
  setDeletedImages,
  showDelete = false,
}) {
  const [internalImages, setInternalImages] = useState([]);
  //keep track of number of images uploaded by user
  const [uploadLength, setUploadLength]  = useState(0);

  const [currStep, setCurrStep] = useState(0); // Current step index of image



  useEffect(()=>{
    // remove all previously uploaded images, from the front of the array 
    let newImages = [...internalImages].slice(uploadLength); 
    //add newly uploaded images to the front of the array 
    newImages = uploadedImages.concat(newImages);
    //update the internal images for the slider
    setInternalImages(newImages);
    //update the length of the newly ulpaded images 
    setUploadLength(uploadedImages.length);
    //reset the current index shown in the slider
    setCurrStep(0);
    
  }
  ,[uploadedImages]);


  useEffect(()=>{
    setInternalImages(images);
    setCurrStep(0);
   
  }
  ,[images]);




  //handle deleted images
  function handleDeletedImage() {
    if (!internalImages.length || !setDeletedImages) return;
    const current = internalImages[currStep];

    if (!current || current.image_id == null) return;

    // Inform parent which image_id to delete
    setDeletedImages((imgs) => {
      const next = Array.from(imgs);
      next.push(current.image_id);
      return next;
    });
    //this is necessary to avoid accessing an index that doesn't exist
    if (currStep !== 0){
      handleBackButton();
    }
    setInternalImages((imgs) =>
      imgs.filter((item) => item.image_id !== current.image_id)
    );
  }
  function handleNextButton()
    //Move to next image
    {
    if (!internalImages.length) return;
    setCurrStep((prev) => {
      const total = internalImages.length;
      const newStep = (prev + 1) % total;
      return newStep;
    });
  }

  function handleBackButton () 
      //Move to previous image
  {
    if (!internalImages.length) return;
    setCurrStep((prev) => {
      const total = internalImages.length;
      const newStep = (prev - 1 + total) % total;
      return newStep;
    });
  }
  
  if (internalImages.length !== 0) {
    return (
      <Box id="edit-images" sx={{ position: "relative" }}>
        <Card //Outer container
          sx={{
            position: "relative", //for positioning arrows and dots on top
            borderRadius: 3, //to make rounded corners
            overflow: "hidden",
          }}
        >
          {/* IMAGE */}
          <CardMedia
            sx={{
              width: "100%", //full width of image
              height: { xs: 220, sm: 260, md: 320 }, //responsive height
              objectFit: "contain", //maintains aspect ratio
            }}
            component="img"
            image={internalImages[currStep].src} //Source of image
            alt={internalImages[currStep].label} //For accessibility
          />

          {/* LEFT ARROW */}
          <IconButton
            onClick={handleBackButton} //previous image
            sx={{
              top: "50%", //center vertically
              left: 5, //left padding
              position: "absolute", //to place on top of image
              transform: "translateY(-50%)", //center vertically

              width: 20, //Size of circular button
              height: 20,
              borderRadius: "50%", //make rounded button

              border: "1px solid #E0E0E0", //border color
              backgroundColor: "#FFFFFF", //white background

              color: "#0a0a0aff", //arrow color
              padding: 0, //remove padding

              "&:hover": {
                //hover effect
                backgroundColor: "#FFFFFF", // white background
                boxShadow: "0px 2px 4px rgba(0,0,0,0.12)", //shadow on hovering
              },
            }}
          >
            <KeyboardArrowLeft fontSize="small" /> {/*left arrow icon <*/}
          </IconButton>

          {/* RIGHT ARROW */}
          <IconButton
            onClick={handleNextButton} //next image
            sx={{
              position: "absolute", //to place on top of image
              transform: "translateY(-50%)", //center vertically
              top: "50%", //center vertically
              right: 5, //right padding

              width: 20, //Size of circular button
              height: 20, //Size of circular button
              borderRadius: "50%", //make rounded button

              border: "1px solid #E0E0E0", //border color
              backgroundColor: "#FFFFFF", //white background

              color: "#0a0a0aff", //arrow color
              padding: 0, //remove padding

              "&:hover": {
                //hover effect
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 2px 4px rgba(0,0,0,0.12)",
              },
            }}
          >
            <KeyboardArrowRight fontSize="small" /> {/*right arrow icon >*/}
          </IconButton>

          {/* Image Dots */}
          <MobileStepper
            variant="dots" //Dots type
            steps={internalImages.length} //Total dots
            activeStep={currStep} //Active dot
            position="static" //Static position
            sx={{
              position: "absolute", //position on top of image
              bottom: 15, // bottom padding
              left: "50%", // center horizontally
              transform: "translateX(-50%)", // center horizontally

              bgcolor: "transparent", // no background
              width: "100%", //full width
              justifyContent: "center", //center dots
              padding: 0, //remove padding

              "& .MuiMobileStepper-dot": {
                //style inactive dots
                backgroundColor: "#D6D6D6", // inactive dot
                width: 8, // dot size
                height: 8,
              },

              "& .MuiMobileStepper-dotActive": {
                //style active dot
                backgroundColor: "#000000", //  active dot
              },
            }}
            nextButton={<Box />} // no built-in buttons
            backButton={<Box />}
          />
        </Card>
        {showDelete && (
          <CustomButton
            style={{
              width: "fit-content",
              position: "absolute",
              top: 0,
              right: 0,
              margin: 2, //hide delete button for uploaded images
              display: currStep < uploadedImages.length ?"none" : "initial",
            }}
            color={"red"}
            onClick={handleDeletedImage}
            disabled={currStep < uploadedImages.length}
          >
            {"Delete"}
          </CustomButton>
        )}
      </Box>
    );
  } else
    return (
      <Box
        sx={{
          width: "100%",
          height: { xs: 220, sm: 260, md: 320 },
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
          backgroundColor: "grey",
        }}
      >
        <Typography
          variant="h3"
          sx={{ color: "#b8b4b4ff", alignSelf: "center" }}
        >
          No Image
        </Typography>
      </Box>
    );
}
