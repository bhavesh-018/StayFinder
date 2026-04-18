import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../AvailabilityForm.css';
import { State, City } from 'country-state-city';
import Toast from './Toast';
import { Link } from 'react-router-dom';

const AvailabilityForm = ({
  initialSearchTerm = '',
  initialCity = '',
  initialCheckIn = null,
  initialCheckOut = null,
  initialGuests = 1,
  fromListingsPage = false
}) => {
  const [selectedCity, setSelectedCity] =
    useState(initialCity);

  const [checkIn, setCheckIn] =
    useState(
      initialCheckIn
        ? new Date(initialCheckIn)
        : null
    );

  const [checkOut, setCheckOut] =
    useState(
      initialCheckOut
        ? new Date(initialCheckOut)
        : null
    );

  const [guests, setGuest] =
    useState(initialGuests);

  const [searchTerm, setSearchTerm] =
    useState('');

  const [cities, setCities] =
    useState([]);

  const [showToast, setShowToast] =
    useState(false);

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem('user')
  );

  const isHost =
    user?.role?.includes('host');

  useEffect(() => {
    const indiaStates =
      State.getStatesOfCountry('IN');

    let allCities = [];

    indiaStates.forEach((st) => {
      const stCities =
        City.getCitiesOfState(
          'IN',
          st.isoCode
        );

      allCities =
        allCities.concat(stCities);
    });

    setCities(allCities);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCity) {
      setShowToast(true);
      return;
    }

    navigate('/listings', {
      state: {
        search: searchTerm,
        location: selectedCity,
        checkIn,
        checkOut,
        guests
      }
    });
  };

  return (
  <>
    <div
      className={`availability-form p-4 rounded shadow ${
        !fromListingsPage ? 'bg-white' : 'bg-white'
      }`}
    >
      <form onSubmit={handleSubmit}>
  {fromListingsPage ? (
    <>
      <div className="mb-3">
        <label className="label">Search Stay</label>
        <input
          type="text"
          className="form-control"
          placeholder="Search by property name"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>

      <div className="mb-3">
        <label className="label">Location</label>
        <select
          className="form-control"
          value={selectedCity}
          onChange={(e) =>
            setSelectedCity(e.target.value)
          }
        >
          <option value="">
            Select City
          </option>
          {cities.map((c) => (
            <option
              key={`${c.stateCode}-${c.name}`}
              value={c.name}
            >
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="label">Check In</label>
        <DatePicker
          selected={checkIn}
          onChange={(date) =>
            setCheckIn(date)
          }
          className="form-control"
          dateFormat="dd MMMM, yyyy"
          placeholderText="Select check-in"
        />
      </div>

      <div className="mb-3">
        <label className="label">Check Out</label>
        <DatePicker
          selected={checkOut}
          onChange={(date) =>
            setCheckOut(date)
          }
          className="form-control"
          dateFormat="dd MMMM, yyyy"
          placeholderText="Select check-out"
        />
      </div>

      <div className="mb-3">
        <label className="label">Guests</label>
        <select
          className="form-control"
          value={guests}
          onChange={(e) =>
            setGuest(e.target.value)
          }
        >
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4+</option>
        </select>
      </div>

      <button
        type="submit"
        className="btn btn-warning w-100 text-white fw-bold"
      >
        Apply Filters
      </button>
    </>
  ) : (
    <>
      <div className="row g-3">
        <div className="col-md-6 col-lg-3">
          <label className="label">
            Search Stay
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by property name"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
          />
        </div>

        <div className="col-md-6 col-lg-3">
          <label className="label">
            Location
          </label>
          <select
            className="form-control"
            value={selectedCity}
            onChange={(e) =>
              setSelectedCity(
                e.target.value
              )
            }
          >
            <option value="">
              Select City
            </option>
            {cities.map((c) => (
              <option
                key={`${c.stateCode}-${c.name}`}
                value={c.name}
              >
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6 col-lg-2">
          <label className="label">
            Check In
          </label>
          <DatePicker
            selected={checkIn}
            onChange={(date) =>
              setCheckIn(date)
            }
            className="form-control"
            dateFormat="dd MMMM, yyyy"
            placeholderText="Select check-in"
          />
        </div>

        <div className="col-md-6 col-lg-2">
          <label className="label">
            Check Out
          </label>
          <DatePicker
            selected={checkOut}
            onChange={(date) =>
              setCheckOut(date)
            }
            className="form-control"
            dateFormat="dd MMMM, yyyy"
            placeholderText="Select check-out"
          />
        </div>

        <div className="col-md-6 col-lg-2">
          <label className="label">
            Guests
          </label>
          <select
            className="form-control"
            value={guests}
            onChange={(e) =>
              setGuest(
                e.target.value
              )
            }
          >
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4+</option>
          </select>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-lg-4"></div>

        <div className="col-lg-4">
          <button
            type="submit"
            className="btn btn-warning w-100 text-white fw-bold"
          >
            Check Availability
          </button>
        </div>

        {isHost && (
          <div className="col-lg-4 mt-2 mt-lg-0">
            <Link
              to="/listings/create"
              className="btn btn-outline-warning w-100 fw-bold"
            >
              + Create Listing
            </Link>
          </div>
        )}
      </div>
    </>
  )}
</form>
    </div>

    {showToast && (
      <Toast
        message="Please select a location to search"
        onClose={() =>
          setShowToast(false)
        }
      />
    )}
  </>
);
};

export default AvailabilityForm;