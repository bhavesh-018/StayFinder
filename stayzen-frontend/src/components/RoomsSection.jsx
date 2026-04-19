const RoomsSection = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="row justify-content-center text-center mb-5">
          <div className="col-md-7">
            <h2 className="heading" data-aos="fade-up">Rooms &amp; Suites</h2>
            <p data-aos="fade-up" data-aos-delay="100">
              Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, 
              there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the 
              Semantics, a large language ocean.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-lg-4" data-aos="fade-up">
            <a href="#" className="room">
              <figure className="img-wrap">
                <img src="images/img_1.jpg" alt="Single Room" className="img-fluid mb-3" />
              </figure>
              <div className="p-3 text-center room-info">
                <h2>Beachside Studio</h2>
                <span className="text-uppercase letter-spacing-1">₹1200 / per night</span>
              </div>
            </a>
          </div>

          <div className="col-md-6 col-lg-4" data-aos="fade-up">
            <a href="#" className="room">
              <figure className="img-wrap">
                <img src="images/img_2.jpg" alt="Family Room" className="img-fluid mb-3" />
              </figure>
              <div className="p-3 text-center room-info">
                <h2>Mountain Cabin </h2>
                <span className="text-uppercase letter-spacing-1">₹950 / per night</span>
              </div>
            </a>
          </div>

          <div className="col-md-6 col-lg-4" data-aos="fade-up">
            <a href="#" className="room">
              <figure className="img-wrap">
                <img src="images/img_3.jpg" alt="Presidential Room" className="img-fluid mb-3" />
              </figure>
              <div className="p-3 text-center room-info">
                <h2>Urban Apartment  </h2>
                <span className="text-uppercase letter-spacing-1">₹2500 / per night</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomsSection;
