import { Switch } from 'react-router-dom';
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
// import FounderHomepage from './Componets/FounderHomepage';
import EditProfileModal from "./Componets/EditProfileModal";
import FounderPostHome from './Componets/FounderPostHome';
import PostFullDetails from './Componets/PostFullDetails';





function App() {
  return (
    <div className="App">
       
        <BrowserRouter>
      <Routes>
      <Route exact path="/login" element={<Login/>} />
      <Route exact path="/" element={<Home/>} />
      <Route exact path='/signup' element={<Signup/>}/>
      <Route exact path='/InvestorSignupone' element={<InvestorSignupone/>}/>
      <Route exact path='/InvestorSignuptwo' element={<InvestorSignuptwo/>}/>
      <Route exact path='/CreatePost' element={<CreatePost/>}/>
      {/* <Route exact path='/FounderHomepage' element={<FounderHomepage/>}/> */}
      <Route exact path='/EditProfileModal' element={<EditProfileModal/>}/>
      <Route exact path='/FounderDashboard' element={<FounderDashboard/>}/>
      <Route exact path='/ProfileUpdate' element={<ProfileUpdate/>}/>
      <Route exact path='/FounderPostHome' element={<FounderPostHome/>}/>
      <Route exact path='/PostFullDetails' element={<PostFullDetails/>}/>
      
      
        </Routes>
        </BrowserRouter>
      
    </div>
  );
}

export default App;
