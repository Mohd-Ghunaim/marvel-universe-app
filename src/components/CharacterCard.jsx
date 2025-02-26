import React from 'react';
import FavoriteButton from './favoriteButton';

const CharacterCard = ({ character }) => {
  const { name, title, thumbnail, description, firstName, middleName, lastName } = character;

  // Construct full name for creators
  const creatorName = [firstName, middleName, lastName].filter(Boolean).join(' ');

  return (
    <div className="result-card">
      {thumbnail && (
        <img
          src={`${thumbnail.path}.${thumbnail.extension}`}
          alt={name || title || creatorName}
          className="result-image"
        />
      )}

      <h2 className="result-name">{name || title || creatorName}</h2>

      <FavoriteButton item={character} />

      <p className="result-description">
        {description || "No description available."}
      </p>
    </div>
  );
};

export default CharacterCard;