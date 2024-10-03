import { Switch } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './Componets/Home';
import Login from './Componets/Login';
import Signup from './Componets/Signup';
import InvestorSignupone from './Componets/InvestorSignupone';
import InvestorSignuptwo from './Componets/InvestorSignuptwo';



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
        </Routes>
        </BrowserRouter>
      
    </div>
  );
}

export default App;
