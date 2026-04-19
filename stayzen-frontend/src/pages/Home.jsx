import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import MapListings from "../components/MapListings";
import AppFooter from "../components/AppFooter";
import RoomsSection from "../components/RoomsSection";
import ListingsSection from "../components/ListingsSection";
import { useLocation, useNavigate } from "react-router-dom";
import API from '../api/axios';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (location.state?.loginSuccess) {
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await API.get("/listings");
        setListings(res.data);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    fetchListings();
  }, []);

  return (
    <>
      <Hero />

      {/* ✅ PASS DATA HERE */}
      <MapListings listings={listings} />

      <ListingsSection listings={listings} />
      <RoomsSection />
      <AppFooter />
    </>
  );
};

export default Home;