import AvailabilityForm from "./AvailabilityForm";

const Hero = () => (
  <>
  <style>
    {
      `
      .site-hero {
  position: relative;
  color: white;
  z-index: 1;
}

.site-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7); /* Adjust darkness here */
  z-index: 0;
}

      `
    }
  </style>
  <section className="site-hero"style={{
      backgroundImage: `url(${process.env.PUBLIC_URL}/images/hero_4.jpg)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      position: 'relative',
    }}>
    <div className="container">
        <div className="row site-hero-inner justify-content-center align-items-center">
          <div className="col-md-10 text-center" data-aos="fade-up">
            <span className="custom-caption text-uppercase text-white d-block mb-3">
              Welcome Home <span className="fa fa-star text-primary"></span> 
            </span>
            <h1 className="heading">Find Your Perfect Stay</h1>
          </div>
        </div>
      </div>
       <div className="availability-overlay-wrapper">
      <AvailabilityForm />
        </div>
      <a className="mouse smoothscroll" href="#next">
        <div className="mouse-icon mb-5">
          <span className="mouse-wheel"></span>
        </div>
      </a>
  </section>
  </>
  
);

export default Hero;