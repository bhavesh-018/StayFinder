import '../StyledListingCard.css';

const StyledListingCard = ({ title, location, rating, reviewText, stars, images, price }) => {
  return (
    <>
    <hr className="listing-separator" /> 
    <div className="listing-card">
      <div className="listing-left">
        <img
          src={Array.isArray(images) ? images[0] : images}
          alt={title}
          className="listing-image"
        />
      </div>
      <div className="listing-center">
        <h4 className="listing-title">{title}</h4>
        <p className="listing-location">{location}</p>
        <div className="listing-rating">
          <span className={`rating-badge ${rating >= 8 ? 'good' : rating >= 6 ? 'ok' : 'low'}`}>{rating}</span>
          <span className="review-text">{reviewText}</span>
          <span className="stars">{'★'.repeat(stars)}</span>
        </div>
        <div className="listing-perks">✔ Free cancellation</div>
      </div>
      <div className="listing-right">
        <div className="price">₹{price}</div>
        <button className="view-btn">View Deal</button>
      </div>
    </div>
    </>
  );
};

export default StyledListingCard;