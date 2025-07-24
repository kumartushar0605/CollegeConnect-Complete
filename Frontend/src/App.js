import Details2 from './Components/Details2';
import Header from './Components/Header';
import Home from './Components/Home';
import Register from './Components/Register';
import {BrowserRouter as Router, Routes,Route} from "react-router-dom"
import TechDett from './Components/TechDett';
import RateFix from './Components/RateFix';
import TechHome from './Components/TechHome';
import Intro from './Components/Into';
import StuInput from './Components/StuInput';
import TechReg from './Components/TechReg';
import StuLogin from './Components/StuLogin';
import Accept from './Components/Accept';
import TeacherLogin from './Components/TeacherLogin';
import { Context } from './index';
import axios from 'axios';
import { useContext ,useEffect} from 'react';
import Meeting from './Components/Meeting';
import PaymentStatus from './Components/PaymentStatus';
import HeaderT from './Components/HeaderT';
import GlobalS from './Components/GlobalS';
import GlobalT from './Components/GlobalT';
import About from './Components/About';
import Contests from './Components/Contests';
import CheckoutPage from './Components/CheckoutPage';
import Page from './Components/Page';
import ContactUs from './Components/ContactUs';
import ProfileT from './Components/ProfileT';
import ProfileS from './Components/ProfileS';
import Subscription from './Components/Subscription';
import Blog from './Components/Blog';

function App() {
  const {studentt,setStudentt,teacherr,setTeacherr,setIsAuthenticated,setTeIsAuthenticated} = useContext(Context);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://collegeconnect-backend.onrender.com/Tme`, {
          credentials: "include",
          withCredentials: true,
          
        });
        setTeacherr(response.data.user);
        
        console.log(response.data.user);
        setIsAuthenticated(true);
        setTeIsAuthenticated(true);
      } catch (error) {
        console.error('Error fetching user data:', error);
         setTeacherr({})
      }
      
    };

    const fetchDataa = async () => {
      try {
        const response = await axios.get(`https://collegeconnect-backend.onrender.com/Sme`, {
          credentials: "include",
          withCredentials: true,
        });
        setStudentt(response.data.user);
        setIsAuthenticated(true)
        console.log(response.data.user);

        
      } catch (error) {
        console.error('Error fetching user data:', error);
        setStudentt({});
        
      }
      
    };

    fetchData();
    fetchDataa();

  }, [setStudentt,setTeacherr]);
  return (    
   <Router>
    <Routes>
      <Route path="/home" element={<><Header/><Home/></>}/>
      <Route path='/detT' element={<TechDett/>}/>
      <Route path='/rate' element={<RateFix/>}/>
      <Route path="/det2" element={<Details2/>}/>
      <Route path='/Slogin' element={<StuLogin/>} />
      <Route path='/Tlogin' element={<TeacherLogin/>}/>
      <Route path='/home2' element={<><HeaderT/><TechHome/></>}/>
      <Route path='/' element={<Intro/>}/>
      <Route path='/stud' element={<StuInput/>}/>
      {/* <Route path="/chapter/:chapterName" element={<Chapter />} /> */}
      <Route path='/res' element={<Register/>}/>
      <Route path='/ress' element={<TechReg/>}/>
      <Route path='/accept' element={<><Header/><Accept/></>}/>
      <Route path='/meet' element={<Meeting/>}/>
      <Route path='/payStatus' element={<PaymentStatus/>}/>
      <Route path='/globals' element={<><Header/><GlobalS/></>}/>
      <Route path='/globalt' element={<><HeaderT/><GlobalT/></>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/contest' element={<><Header/><Contests/></>}/>
      <Route path='/checkout' element={<CheckoutPage/>}/>
      <Route path='/page' element={<Page/>}/>
      <Route path='/contact' element={<><ContactUs/></>}/>
      <Route path='/profileT' element={<><HeaderT/><ProfileT/></>}/>
      <Route path='/profileS' element={<><Header/><ProfileS/></>}/>
      <Route path='/subs' element={<Subscription/>}/>
      <Route path='/blog' element={<Blog/>}/>
      {/* <Route path='/' element={<Details2/>}/> */}
    </Routes>
   </Router>
   
  );
}

export default App;
