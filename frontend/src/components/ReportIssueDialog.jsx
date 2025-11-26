import { useState } from "react";                                               
import {                                                                        
  Box,                                                                          
  Button,                                                                       
  Dialog,                                                                       
  DialogContent,                                                                
  DialogTitle,                                                                  
  Divider,                                                                      
  Tabs,                                                                         
  Tab,                                                                          
  ToggleButton,                                                                 
  ToggleButtonGroup,                                                            
  Typography,                                                                   
} from "@mui/material";                                                         
import CustomButton from "../components/CustomButton";                          

export default function ReportIssueDialog({ open, onClose }) {                  
  const [reportType, setReportType] = useState("user");                         
  const [reason, setReason] = useState("inappropriate");                        

  const handleChangeReportType = (_event, newVal) => {                          
    if (newVal !== null) {                                                      
      setReportType(newVal);                                                    
    }                                                                           
  };                                                                            

  const handleChangeReason = (_event, newVal) => {                              
    if (newVal !== null) {                                                      
      setReason(newVal);                                                        
    }                                                                           
  };                                                                            

  const handleSubmit = () => {                                                  
    onClose();                                                                  
  };                                                                            

  return (                                                                      
    <Dialog                                                                     
      open={open}                                                               
      onClose={onClose}                                                         
      fullWidth                                                                 
      maxWidth="xs"                                                             
      PaperProps={{                                                             
        sx: {                                                                   
          borderRadius: "12px",                                                 
          p: 1,                                                                 
        },                                                                      
      }}                                                                        
    >                                                                           
      <DialogTitle                                                              
        sx={{                                                                   
          fontSize: 14,                                                         
          lineHeight: 1.2,                                                      
          pb: 1,                                                                
        }}                                                                      
      >                                                                         
        Thank you for reporting this claim. We will do our utmost to resolve the
        situation.                                                              
      </DialogTitle>                                                            

      <Divider sx={{ mb: 1.25 }} />                                             

      <DialogContent sx={{ pt: 0 }}>                                            
        <Typography variant="body2" sx={{ mb: 1, fontSize: 14 }}>               
          Which would you like to report ?                                      
        </Typography>                                                           

        <Tabs                                                                   
          value={reportType}                                                    
          onChange={handleChangeReportType}                                     
          sx={{                                                                 
            minHeight: 24,                                                      
            mb: 2,                                                              
            "& .MuiTab-root": {                                                 
              minHeight: 28,                                                    
              fontSize: 12,                                                     
              fontWeight: 500,                                                  
              color: "text.secondary",                                          
              textTransform: "none",                                            
            },                                                                  
            "& .Mui-selected": {                                                
              color: "text.primary",                                            
            },                                                                  
            "& .MuiTabs-indicator": {                                           
              backgroundColor: "#D22C22",                                       
              height: 2,                                                        
            },                                                                  
          }}                                                                    
        >                                                                       
          <Tab label="User" value="user" />                                     
          <Tab label="Post" value="post" />                                     
        </Tabs>                                                                 

        <Typography variant="body2" sx={{ mb: 1, fontSize: 14 }}>               
          What best describes your complaint ?                                  
        </Typography>                                                           

        <ToggleButtonGroup                                                      
          value={reason}                                                        
          exclusive                                                              // to allow only one button to be selected at a time
          onChange={handleChangeReason}                                         
          sx={{                                                                 
            display: "inline-flex",                                             
            borderRadius: 0,                                                    
            "& .MuiToggleButton-root": {                                        
              fontSize: 12,                                                     
              fontWeight: 500,                                                  
              minHeight: 24,                                                    
              textTransform: "none",                                            
              px: 1.2,                                                          
              py: 0.4,                                                          
              backgroundColor: "#F3F3F3",
              border: "1px solid rgba(0,0,45,0.09)",                                       
              color: "rgba(0,5,9,0.89)",                                        
              borderRadius: 0,                                                                             
              "&:not(:first-of-type)": {                                        
                marginLeft: -1,                                                 
              },                                                                
              "&:hover": {                                                      
                backgroundColor: "#F3F3F3",                                     
              },                                                                
            },                                                                  
            "& .Mui-selected": {                                                
              backgroundColor: "#FFFFFF",                                       
              color: "rgba(0,5,9,0.89)",                                        
              fontWeight: 600,                                                  
            },                                                                  
          }}                                                                    
        >                                                                       
          <ToggleButton value="inappropriate">Inappropriate</ToggleButton>      
          <ToggleButton value="scam">Scam</ToggleButton>                        
          <ToggleButton value="criminal">Criminal Behavior</ToggleButton>       
        </ToggleButtonGroup>                                                    

        {/* Bottom buttons */}                                                  
        <Box                                                                    
          sx={{                                                                 
            display: "flex",                                                    
            justifyContent: "space-between",                                    
            mt: 5.5,                                                             // ↓ smaller top margin
            columnGap: 5,                                                     
          }}                                                                    
        >                                                                       
                                                          
          <CustomButton                                                         
            color="red"                                             
            onClick={onClose}                                       
            style={{                                                
              "&&": {                                               
                width: 200,                                         
                height: 28,                                         
                minHeight: 26,                                      
                borderRadius: 3,                                    
                padding: 0,                                         
                bgcolor: "black",                                   
                fontSize: "0.75rem",                                
                fontWeight: 500,                                    
                justifyContent: "center",                           
              },                                                    
            }}                                                      
          >                                                         
            Exit                                                    
          </CustomButton>                                           

          <CustomButton                                                         
            color="red"                                                         
            onClick={handleSubmit}                                              
            style={{                                                            
              "&&": {                                                           
                width: 200,                                                     
                height: 28,                                                     
                minHeight: 26,                                                  
                borderRadius: 3,                                                
                padding: 0,                                                     
                bgcolor: "black",                                               
                fontSize: "0.75rem",                                            
                fontWeight: 500,                                                
                justifyContent: "center",                                       
                backgroundColor: "#D22C22",                                     
              },                                                                
            }}                                                                  
          >                                                                     
            Report                                                              
          </CustomButton>                                                       
        </Box>                                                                  
      </DialogContent>                                                          
    </Dialog>                                                                   
  );                                                                            
}                                                                               
