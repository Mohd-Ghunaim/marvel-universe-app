import React from 'react';

const CharacterCard = ({ character }) => {
  const { name, title, thumbnail, description, firstName, middleName, lastName } = character;

  // Construct full name for creators
  const creatorName = [firstName, middleName, lastName].filter(Boolean).join(' ');

  return (
    <div className="result-card">
      {/* Display image if available */}
      {thumbnail && (
        <img
          src={`${thumbnail.path}.${thumbnail.extension}`}
          alt={name || title || creatorName}
          className="result-image"
        />
      )}

      {/* Display character, comic, series, event, story, or creator name */}
      <h2 className="result-name">{name || title || creatorName}</h2>

      {/* Display description or fallback */}
      <p className="result-description">
        {description || "No description available."}
      </p>
    </div>
  );
};

export default CharacterCard;
