const WelcomeSection = () => {
  return (
    <>
    <style>
      {
        `
        .welcome-section{
          margin-top: 100px;
        }
        `
      }
    </style>
    <section className="py-5 welcome-section">
      <div className="container">
        <div className="row align-items-center">
          {/* Right side image */}
          <div
            className="col-md-12 col-lg-7 ml-auto order-lg-2 position-relative mb-5"
            data-aos="fade-up"
          >
            <figure className="img-absolute">
              <img
                src={`${process.env.PUBLIC_URL}/images/food-1.jpg`}
                alt="Decorative"
                className="img-fluid"
              />
            </figure>
            <img
              src={`${process.env.PUBLIC_URL}/images/img_1.jpg`}
              alt="Main Visual"
              className="img-fluid rounded"
            />
          </div>

          {/* Left side text */}
          <div className="col-md-12 col-lg-4 order-lg-1" data-aos="fade-up">
            <h2 className="heading">Welcome to StayFinder!</h2>
            <p className="mb-4">
              your trusted destination for booking cozy homes, luxury stays, and unique properties across India. Whether you're planning a short trip or a long stay, we connect guests with trusted hosts for comfortable and secure experiences
            </p>
            <p>
              <a href="#" className="btn btn-primary text-white py-2 mr-3">
                Learn More
              </a>
              <span className="mr-3 font-family-serif">
                <em>or</em>
              </span>
              <a
                href="https://vimeo.com/channels/staffpicks/93951774"
                className="text-uppercase letter-spacing-1"
                data-fancybox
              >
                See video
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default WelcomeSection;
