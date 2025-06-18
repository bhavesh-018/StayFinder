import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../AvailabilityForm.css';
import { Country, State, City } from 'country-state-city';
import Toast from './Toast';
import { Link } from 'react-router-dom';

const AvailabilityForm = () => {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuest] = useState(1);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const isHost = user?.role?.includes('host');

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
    if (!selectedCity) {
      setShowToast(true);
      return;
    }
    navigate(`/listings?location=${encodeURIComponent(selectedCity)}`);
  };

  return (
    <>
      <div className="availability-form p-4 bg-white rounded shadow">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Location */}
            <div className="col-md-6 col-lg-3">
              <label className="label">Location</label>
              <select
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
              <DatePicker
                selected={checkIn}
                onChange={(date) => setCheckIn(date)}
                className="form-control"
                dateFormat="dd MMMM, yyyy"
                placeholderText="Select check-in"
              />
            </div>

            {/* Check-out */}
            <div className="col-md-6 col-lg-3">
              <label className="label">Check Out</label>
              <DatePicker
                selected={checkOut}
                onChange={(date) => setCheckOut(date)}
                className="form-control"
                dateFormat="dd MMMM, yyyy"
                placeholderText="Select check-out"
              />
            </div>

            {/* Guests */}
            <div className="col-md-6 col-lg-3">
              <label className="label">Guests</label>
              <select
                className="form-control"
                value={guests}
                onChange={(e) => setGuest(e.target.value)}
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4+</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="row mt-4">
            <div className={isHost ? 'col-md-6 col-lg-3' : 'col-md-6 col-lg-4'}></div>
            <div className={isHost ? 'col-md-6 col-lg-3' : 'col-md-6 col-lg-4'}>
              <button type="submit" className="btn btn-warning w-100 text-white fw-bold">
                Check Availability
              </button>
            </div>
            {isHost && (
              <div className="col-md-6 col-lg-3 mt-2 mt-md-0">
                <Link to="/listings/create" className="btn btn-outline-warning w-100 fw-bold">
                  + Create Listing
                </Link>
              </div>
            )}
            <div className="col-md-6 col-lg-3"></div>
          </div>
        </form>
      </div>

      {showToast && (
        <Toast
          message="Please select a location to search"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default AvailabilityForm;