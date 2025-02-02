import React from "react";
import Section13 from "../components/home-1/Section13";
import Section1 from "../components/home-1/Section1";
import Section10 from "../components/home-1/Section10";
import Section11 from "../components/home-1/Section11";
import Section12 from "../components/home-1/Section12";
import Section2 from "../components/home-1/Section2";
import Section3 from "../components/home-1/Section3";
import Section4 from "../components/home-1/Section4";
import Section5 from "../components/home-1/Section5";
import Section6 from "../components/home-1/Section6";
import Section7 from "../components/home-1/Section7";
import Section8 from "../components/home-1/Section8";
import Section9 from "../components/home-1/Section9";
import AppLayout from "../components/layout/AppLayout"; // Ensure correct path
import { PageWithLayout } from "../types/pageLayouts";
import FloatingWidget from "../components/exchange/FloatingWidget"; // Import the widget
import Box from "../components/Box";
import FlashDealsSection from "../components/home-1/FlashDealsSection";


const IndexPage: PageWithLayout = () => {
   return (
     <main>
    
        <Box mt="2rem">
         <Section1 />
       </Box>
       <Box mt="2rem">
         <Section2 />
       </Box>
       <Box mt="2rem">
         <Section3 />
       </Box>
 
       <Box mt="2rem">
         <Section4 />
       </Box>
       <Box mt="2rem">
         <Section5 />
       </Box>
       <Box mt="2rem">
         <Section13 />
       </Box>
       <Box mt="2rem">
         <Section6 />
       </Box>
       <Box mt="2rem">
         <Section7 />
       </Box>
       <Box mt="2rem">
         <Section8 />
       </Box>
       <Box mt="2rem">
         <Section9 />
       </Box>
       <Box mt="2rem">
         <Section10 />
       </Box>
       <Box mt="2rem">
         <Section11 />
       </Box>
       <Box mt="2rem">
         <Section12 /> 
       </Box>
         <FloatingWidget /> 
    </main>
  );
  
};

// Explicitly assert that AppLayout satisfies the layout function type
IndexPage.layout = (props) => <AppLayout {...props} />;

export default IndexPage; 



