import React from 'react';

const CharacterCard = ({ character }) => {
  // Destructure necessary properties from character object
  const { name, thumbnail, description } = character;

  return (
    <div className="result-card">
      {/* Display character image */}
      <img
        src={`${thumbnail.path}.${thumbnail.extension}`}
        alt={name}
        className="result-image"
      />
      <h2 className="result-name">{name}</h2>
      {/* Display character description */}
      {description ? (
        <p className="result-description">{description}</p>
      ) : (
        <p className="result-description">No description available</p>
      )}
    </div>
  );
};

export default CharacterCard;
