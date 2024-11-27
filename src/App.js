
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './Componets/Home';
import Login from './Componets/Login';
import Signup from './Componets/Signup';
import InvestorSignupone from './Componets/InvestorSignupone';
import InvestorSignuptwo from './Componets/InvestorSignuptwo';

import FounderDashboard from './Componets/FounderDashboard';
import CreatePost from './Componets/CreatePost';
import ProfileUpdate from "./Componets/ProfileUpdate"
import Explore from './Componets/Explore';
import Help from "./Componets/Help"
// import FounderHomepage from './Componets/FounderHomepage';
import EditProfileModal from "./Componets/EditProfileModal";
import FounderPostHome from './Componets/FounderPostHome';
import PostFullDetails from "./Componets/PostFullDetails";

// admin
// import AdminLogin from "./Componets/AdminLogin";
// import AdminDashboard from "./Componets/AdminDashboard";






function App() {
  return (
    <div className="App">
   <BrowserRouter>
      <Routes>
        {/* Public Routes */}
      <Route exact path="/login" element={<Login/>} />
      <Route exact path="/" element={<Home/>} />
      <Route exact path='/signup' element={<Signup/>}/>
      <Route exact path='/InvestorSignupone' element={<InvestorSignupone/>}/>
      <Route exact path='/InvestorSignuptwo' element={<InvestorSignuptwo/>}/>


        {/* Founder Routes */}
        <Route exact path='/founder/CreatePost' element={<CreatePost/>}/>
      <Route exact path='/founder/EditProfileModal' element={<EditProfileModal/>}/>
      <Route exact path='/founder/FounderDashboard' element={<FounderDashboard/>}/>
      <Route exact path='/founder/ProfileUpdate' element={<ProfileUpdate/>}/>
      <Route exact path='/founder/FounderPostHome' element={<FounderPostHome/>}/>
      <Route exact path='/founder/PostFullDetails' element={<PostFullDetails/>}/>
      <Route exact path='/founder/Explore' element={<Explore/>}/>
      <Route exact path='/founder/Help' element={<Help/>}/>

        {/* Admin Routes */}
        {/* <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}

        {/* Investor Routes */}
        {/* <Route 
          path="/investor/*" 
          element={<ProtectedRoute role="investor"><InvestorRoutes /></ProtectedRoute>} 
        /> */}
      </Routes>
      </BrowserRouter>
  </div>
    
  );
}

export default App;
