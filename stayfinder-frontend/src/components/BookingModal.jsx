// components/BookingModal.jsx
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookingModal = ({ show, onClose, onConfirm }) => {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [rooms, setRooms] = useState(1);

  const handleSubmit = () => {
    onConfirm({ checkIn, checkOut, rooms });
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header className="d-flex justify-content-between align-items-center border-0">
  <Modal.Title>Book Your Stay</Modal.Title>
  <span
    onClick={onClose}
    style={{
      cursor: 'pointer',
      fontSize: '1.5rem',
      lineHeight: '1',
      fontWeight: 'bold',
    }}
  >
    ×
  </span>
</Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Check In: </Form.Label>
            <DatePicker
              selected={checkIn}
              onChange={(date) => setCheckIn(date)}
              className="form-control"
              placeholderText="Select check-in date"
              dateFormat="dd MMM yyyy"
              wrapperClassName="w-100"
              minDate={new Date()}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Check Out:</Form.Label>
            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              className="form-control"
              placeholderText="Select check-out date"
              dateFormat="dd MMM yyyy"
               wrapperClassName="w-100"
               minDate={checkIn || new Date()}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Number of Rooms</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Confirm Booking</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookingModal;