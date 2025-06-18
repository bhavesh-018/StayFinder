import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../AvailabilityForm.css';
import { Country, State, City } from 'country-state-city';

const AvailabilityForm = () => {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuest] = useState(1);
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    const indiaStates = State.getStatesOfCountry('IN');
    let allCities = [];
    indiaStates.forEach((st) => {
      const stCities = City.getCitiesOfState('IN', st.isoCode);
      allCities = allCities.concat(stCities);
    });
    setCities(allCities);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/listings?location=${encodeURIComponent(selectedCity)}`);
  };

  return (
    <div className="availability-form">
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Location */}
          <div className="col-md-6 col-lg-3">
            <label htmlFor="location" className="label">Location</label>
            <select
              id="location"
              className="form-control"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">Select City</option>
              {cities.map((c) => (
                <option key={`${c.stateCode}-${c.name}`} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Check-in */}
          <div className="col-md-6 col-lg-3">
            <label className="label">Check In</label>
            <div className="field-icon-wrap">
              <DatePicker
                selected={checkIn}
                onChange={(date) => setCheckIn(date)}
                className="form-control"
                dateFormat="dd MMMM, yyyy"
                placeholderText="Select check-in"
              />
            </div>
          </div>

          {/* Check-out */}
          <div className="col-md-6 col-lg-3">
            <label className="label">Check Out</label>
            <div className="field-icon-wrap">
              <DatePicker
                selected={checkOut}
                onChange={(date) => setCheckOut(date)}
                className="form-control"
                dateFormat="dd MMMM, yyyy"
                placeholderText="Select check-out"
              />
            </div>
          </div>

          {/* Adults & Children */}
          <div className="col-md-6 col-lg-3">
            <div className="row">
              <div className="col-md-6">
                <label className="label">Guests</label>
                <select
                  className="form-control"
                  
                  onChange={(e) => setGuest(e.target.value)}
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4+</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
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