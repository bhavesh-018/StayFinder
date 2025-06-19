import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ListingsPage from './pages/ListingsPage'
import CreateListing from '../src/pages/CreateListings';
import MyListings from './pages/MyListings';
import ListingDetails from './pages/ListingDetails';
import Bookings from './pages/Bookings';
import FixedBackground from './components/FixedBackground';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <>
    <Router>
      <FixedBackground /> 
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listings/create" element={<CreateListing />} />
        <Route path='/my-listings' element={<MyListings />} />
        <Route path='/listings/:id' element={<ListingDetails />} />
        <Route path='/bookings' element={<Bookings />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
