import React from 'react'
import Nav from '../Compoents/Nav'
import Home from '../Compoents/Home'
// import Box from '../Compoents/Box'
import Offer from '../Compoents/Offer'
import TakeCourse from '../Compoents/TakeCourse'
// import Certified from '../Compoents/Certified'
import Levels from '../Compoents/Levels'
import Experience from '../Compoents/Experience'
import Footer from '../Compoents/Footer'
import Pricing from '../Compoents/Pricing'
import For from '../Compoents/Whoisfor'
import Notfor from '../Compoents/Notfor'
import Faq from '../Compoents/Faq'

const Main = () => {
  return (
 <>
 <Nav/>
 <Home/>
 {/* <Box/> */}
 <Levels/>

 <Offer/>
 <TakeCourse/>
 {/* <Certified/> */}
 <Pricing/>
 <For/>
 <Notfor/>
 <Faq/>
 {/* <Experience/> */}

 <Footer/>
 {/* <SignUp/>
 <Login/>
 <Dashboard/> */}
 </>
  )
}

export default Main