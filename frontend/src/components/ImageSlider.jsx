import { useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  IconButton,
  MobileStepper,
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

//TODO: Replace these images with actual images from BACKEND.
const images = [
  {
    label: "Img 1",
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  },
  {
    label: "Img 2",
    src: "https://images.unsplash.com/photo-1470770903676-69b98201ea1c",
  },
  {
    label: "Img 3",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
];

export default function ImageSlider() {
  const [currStep, setCurrStep] = useState(0);  //Current step index of image
  const numberOfSteps = images.length;          //Total number of images

  const handleNextButton = () =>                //Move to next image
    setCurrStep((prev) => (prev + 1) % numberOfSteps);

  const handleBackButton = () =>                //Move to previous image
    setCurrStep((prev) => (prev - 1 + numberOfSteps) % numberOfSteps);

  return (
    <Card                                       //Outer container
      sx={{ 
        position: "relative",               //for positioning arrows and dots on top
        borderRadius: 3,                    //to make rounded corners
        overflow: "hidden",          
      }}
    >
      {/* IMAGE */}
      <CardMedia
        sx={{
          width: "100%",                                //full width of image
          height: { xs: 220, sm: 260, md: 320 },        //responsive height
          objectFit: "cover",                           //maintains aspect ratio 
        }}
        component="img"
        image={images[currStep].src}                    //Source of image
        alt={images[currStep].label}                    //For accessibility
        
      />

{/* LEFT ARROW */}
<IconButton
  onClick={handleBackButton}                            //previous image
  sx={{         
    top: "50%",                                         //center vertically
    left: 5,                                            //left padding
    position: "absolute",                               //to place on top of image
    transform: "translateY(-50%)",                     //center vertically

    width: 20,                                         //Size of circular button
    height: 20,
    borderRadius: "50%",                               //make rounded button

    border: "1px solid #E0E0E0",                    //border color
    backgroundColor: "#FFFFFF",                     //white background

    color: "#0a0a0aff",                             //arrow color
    padding: 0,                                        //remove padding 

    "&:hover": {                                        //hover effect 
      backgroundColor: "#FFFFFF",                      // white background
      boxShadow: "0px 2px 4px rgba(0,0,0,0.12)",        //shadow on hovering
    },

  }}
>
  <KeyboardArrowLeft fontSize="small" />                   {/*left arrow icon <*/}
</IconButton>

{/* RIGHT ARROW */}
<IconButton
  onClick={handleNextButton}                                //next image
  sx={{
    position: "absolute",                                   //to place on top of image
    transform: "translateY(-50%)",                          //center vertically
    top: "50%",                                             //center vertically 
    right: 5,                                               //right padding     

    width: 20,                                              //Size of circular button   
    height: 20,                                             //Size of circular button
    borderRadius: "50%",                                     //make rounded button   

    border: "1px solid #E0E0E0",                            //border color
    backgroundColor: "#FFFFFF",                             //white background

    color: "#0a0a0aff",                                     //arrow color   
    padding: 0,                                               //remove padding                           

    "&:hover": {                                               //hover effect    
      backgroundColor: "#FFFFFF",
      boxShadow: "0px 2px 4px rgba(0,0,0,0.12)",
    },
  }}
>
  <KeyboardArrowRight fontSize="small" />               {/*right arrow icon >*/}
</IconButton>



{/* Image Dots */}
<MobileStepper
  variant="dots"                                        //Dots type
  steps={numberOfSteps}                                 //Total dots    
  activeStep={currStep}                                 //Active dot              
  position="static"                                     //Static position
  sx={{
    position: "absolute",                               //position on top of image
    bottom: 15,                                         // bottom padding
    left: "50%",                                        // center horizontally   
    transform: "translateX(-50%)",                      // center horizontally   

    bgcolor: "transparent",                             // no background
    width: "100%",                                      //full width  
    justifyContent: "center",                           //center dots   
    padding: 0,                                         //remove padding

    "& .MuiMobileStepper-dot": {                      //style inactive dots
      backgroundColor: "#D6D6D6",                   // inactive dot
      width: 8,                                         // dot size
      height: 8,
    },

    "& .MuiMobileStepper-dotActive": {                  //style active dot
      backgroundColor: "#000000",                   //  active dot
    },
  }}
  nextButton={<Box />}                                  // no built-in buttons
  backButton={<Box />}
/>

    </Card>
  );
}
