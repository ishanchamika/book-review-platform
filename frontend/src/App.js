import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import SignIn from './Components/signin';
import SignUp from './Components/signup';
import DashBoard from './Components/dashboard';
import UpdateReview from  './Components/updateReview';
import AddReview from './Components/addReview'


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to="/signin"/>} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/dashboard' element={<DashBoard />} />
        <Route path='/updateReview/:id' element={<UpdateReview />} />
        <Route path='/addReview' element={<AddReview/>} />
      </Routes>
    </Router>
  );
}

export default App;
