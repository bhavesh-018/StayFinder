import '../AvailabilityForm.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AvailabilityForm = () => {
  return (
      <div className="availability-form">
        <form action="#">
          <div className="row">
            <div className="col-md-6 col-lg-3">
        <label htmlFor="location" className="label">Location</label>
          <select id="location" className="form-control">
            <option value="">Select Location</option>
            <option value="goa">Goa</option>
            <option value="manali">Manali</option>
            <option value="mumbai">Mumbai</option>
            <option value="delhi">Delhi</option>
          </select>
      </div>
            <div className="col-md-6 col-lg-3">
              <label htmlFor="checkin_date" className="label">Check In</label>
              <div className="field-icon-wrap">
                <DatePicker
                    placeholderText="Select check-in"
                    className="form-control"
                    dateFormat="dd MMMM, yyyy"
                  />
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <label htmlFor="checkout_date" className="label">Check Out</label>
              <div className="field-icon-wrap">
                <DatePicker
                    placeholderText="Select check-out"
                    className="form-control"
                    dateFormat="dd MMMM, yyyy"
                  />
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="adults" className="label">Adults</label>
                  <div className="field-icon-wrap">
                    <div className="icon"><span className="ion-ios-arrow-down" /></div>
                    <select id="adults" className="form-control">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4+</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="children" className="label">Children</label>
                  <div className="field-icon-wrap">
                    <div className="icon"><span className="ion-ios-arrow-down" /></div>
                    <select id="children" className="form-control">
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4+</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3 align-self-end mt-3">
              <button className="btn btn-primary btn-block text-white">
                Check Availability
              </button>
            </div>
          </div>
        </form>
      </div>
  );
};

export default AvailabilityForm;