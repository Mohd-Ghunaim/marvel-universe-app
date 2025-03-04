import React, { useEffect, useState } from 'react';
import { addToFavourites, removeFromFavourites, isFavourite } from '../appwrite';

const FavoriteButton = ({ userId = "", item }) => {
  const [favourite, setFavourite] = useState(false);
  const [loading, setLoading] = useState(false);

  // Wait until userId is available
  useEffect(() => {
    if (!userId) {
      console.warn("Skipping checkFavourite: Missing userId", { userId, item });
      return;
    }

    if (!item?.id) {
      console.warn("Skipping checkFavourite: Missing item.id", { userId, item });
      return;
    }

    const checkFavourite = async () => {
      setLoading(true);
      try {
        console.log("Checking favourite for userId:", userId, "itemId:", item.id);
        const favStatus = await isFavourite(userId, item.id);
        setFavourite(favStatus);
      } catch (error) {
        console.error("Error in checkFavourite:", error.message);
      } finally {
        setLoading(false);
      }
    };

    checkFavourite();
  }, [userId, item?.id]);

  const handleClick = async () => {
    if (!userId || !item?.id) return;

    setLoading(true);
    try {
      if (favourite) {
        await removeFromFavourites(userId, item.id);
      } else {
        await addToFavourites(userId, item);
      }
      setFavourite(!favourite);
    } catch (error) {
      console.error("Error updating favourite:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // If userId is empty, don't render the button yet
  if (!userId || !item?.id) {
    console.warn("Missing userId or item.id, not rendering button", { userId, item });
    return null;
  }

  return (
    <button
      className={`favorite-button ${favourite ? 'active' : ''}`}
      onClick={handleClick}
      disabled={loading || !userId || !item?.id}
      aria-label={favourite ? "Remove from favourites" : "Add to favourites"}
    >
      <img
        src={favourite ? '/star-filled.png' : '/star-outline.png'}
        alt="favourite"
      />
    </button>
  );
};

export default FavoriteButton;
