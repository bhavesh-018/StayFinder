import Hero from "../components/Hero";
import WelcomeSection from "../components/WelcomeSection";
import AppFooter from "../components/AppFooter";
import RoomsSection from "../components/RoomsSection";
import ListingsSection from "../components/ListingsSection";

const Home = () => {
  return <>
      <Hero />
      <WelcomeSection />
      <ListingsSection />
      <RoomsSection />
      <AppFooter />
    </>;
};

export default Home;
