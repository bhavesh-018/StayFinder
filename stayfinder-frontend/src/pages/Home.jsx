import React, { useEffect } from "react";
import Hero from "../components/Hero";
import WelcomeSection from "../components/WelcomeSection";
import AppFooter from "../components/AppFooter";
import RoomsSection from "../components/RoomsSection";
import ListingsSection from "../components/ListingsSection";
import { useLocation, useNavigate } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.loginSuccess) {
      // toast.success("Login successful!");
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);
  return <>
      <Hero />
      <WelcomeSection />
      <ListingsSection />
      <RoomsSection />
      <AppFooter />
    </>;
};

export default Home;
