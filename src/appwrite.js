import { Client, Databases, ID, Query } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const database = new Databases(client);

export const addToFavourites = async (userId, item, itemType) => {
  try {
    await database.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_FAVOURITES_COLLECTION_ID,
      ID.unique(),
      {
        user_id: userId,
        item_id: item.id.toString(),
        item_type: itemType,
        title: item.name || item.title,
        thumbnail_url: `${item.thumbnail.path}.${item.thumbnail.extension}`,
        created_at: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error('Error adding to favourites:', error);
  }
};

export const getUserFavourites = async (userId) => {
  try {
    const result = await database.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_FAVOURITES_COLLECTION_ID,
      [Query.equal('user_id', userId)]
    );
    return result.documents;
  } catch (error) {
    console.error('Error fetching favourites:', error);
    return [];
  }
};

export const removeFromFavourites = async (documentId) => {
  try {
    await database.deleteDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_FAVOURITES_COLLECTION_ID,
      documentId
    );
  } catch (error) {
    console.error('Error removing from favourites:', error);
  }
};

export const isFavourite = async (userId, itemId) => {
  try {
    const result = await database.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_FAVOURITES_COLLECTION_ID,
      [
        Query.equal('user_id', userId),
        Query.equal('item_id', itemId.toString()),
      ]
    );
    return result.documents.length > 0 ? result.documents[0] : null;
  } catch (error) {
    console.error('Error checking favourite:', error);
    return null;
  }
};
