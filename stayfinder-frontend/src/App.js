import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ListingsPage from './pages/ListingsPage'
import CreateListing from '../src/pages/CreateListings';
import MyListings from './pages/MyListings';

function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listings/create" element={<CreateListing />} />
        <Route path='/my-listings' element={<MyListings />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
