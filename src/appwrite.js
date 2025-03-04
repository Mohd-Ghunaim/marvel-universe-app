import { Client, Account, Databases, ID, Query } from 'appwrite';

// Initialize the Appwrite Client
const client = new Client();
client
  .setEndpoint('https://cloud.appwrite.io/v1')  // Ensure this is the correct endpoint
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// Create instances of Appwrite services
const account = new Account(client);
const database = new Databases(client);

// Function to get the user ID
export async function getUserId() {
  try {
    const user = await account.get();
    console.log("User ID:", user.$id);
    return user.$id;
  } catch (error) {
    console.error("Error retrieving user:", error.message);
    return null;
  }
}

// Function to log in the user
export async function loginUser(email, password) {
  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    console.log("Attempting login with Email:", email);

    const session = await account.createEmailPasswordSession(email, password);
    console.log("Session created successfully:", session);

    const user = await account.get();
    console.log("User info:", user);
    return user.$id;
  } catch (error) {
    console.error("Login failed:", error.message);
    return null;
  }
}

// Function to add an item to favorites
export async function addToFavourites(userId, item) {
  try {
    console.log('Adding to favourites:', userId, item);
    
    const existingFavourite = await isFavourite(userId, item.id);
    if (existingFavourite) {
      console.warn('Item already in favourites.');
      return;
    }

    const doc = await database.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_FAVOURITES_COLLECTION_ID,
      ID.unique(),
      {
        user_id: userId,
        item_id: item.id.toString(),
        item_type: item.type || 'default',
        title: item.name || item.title || 'Unknown Title',
        thumbnail_url: item.thumbnail || 'default-image-url.jpg',
        created_at: new Date().toISOString(),
      }
    );
    console.log('Added to favourites:', doc);
  } catch (error) {
    console.error('Error adding to favourites:', error.message);
  }
}

// Function to get user favorites
export async function getUserFavourites(userId, limit = 20, offset = 0) {
  try {
    const result = await database.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_FAVOURITES_COLLECTION_ID,
      [
        Query.equal('user_id', userId),
        Query.limit(limit),
        Query.offset(offset),
      ]
    );
    return result.documents;
  } catch (error) {
    console.error('Error fetching favourites:', error.message);
    return [];
  }
}

// Function to remove an item from favorites
export async function removeFromFavourites(documentId) {
  try {
    await database.deleteDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_FAVOURITES_COLLECTION_ID,
      documentId
    );
    console.log("Removed from favourites:", documentId);
  } catch (error) {
    console.error('Error removing from favourites:', error.message);
  }
}

// Function to check if an item is already in favorites
export const isFavourite = async (userId, itemId) => {
  if (!userId || !itemId) {
    console.error("isFavourite error: Missing userId or itemId", { userId, itemId });
    return null;
  }

  try {
    console.log("Checking favourite for userId:", userId, "itemId:", itemId);

    const result = await database.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_FAVOURITES_COLLECTION_ID,
      [
        Query.equal("user_id", [userId]),
        Query.equal("item_id", [itemId.toString()]),
      ]
    );

    console.log("Favourite check result:", result);
    return result.documents.length > 0 ? result.documents[0] : null;
  } catch (error) {
    console.error("Error checking favourite:", error.message);
    return null;
  }
};
