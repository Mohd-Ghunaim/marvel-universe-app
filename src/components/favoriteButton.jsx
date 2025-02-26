import React, { useEffect, useState } from 'react';
import { addToFavourites, removeFromFavourites, isFavourite } from '../appwrite';

const FavoriteButton = ({ userId, item }) => {
  const [favourite, setFavourite] = useState(false);

  useEffect(() => {
    const checkFavourite = async () => {
      const favStatus = await isFavourite(userId, item.id);
      setFavourite(favStatus);
    };
    checkFavourite();
  }, [userId, item.id]);

  const handleClick = async () => {
    if (favourite) {
      await removeFromFavourites(userId, item.id);
    } else {
      await addToFavourites(userId, item);
    }
    setFavourite(!favourite);
  };

  return (
    <button
    className={`favorite-button ${favourite ? 'active' : ''}`}
      onClick={handleClick}
    >
      <img
        src={favourite ? '/star-filled.png' : '/star-outline.png'}
        alt="favourite"
      />
    </button>
  );
};

export default FavoriteButton;
