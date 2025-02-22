import { useState } from "react";
import md5 from "md5";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const API_BASE_URL = "https://gateway.marvel.com:443";
  
  // Use the actual public and private keys from your .env.local
  const API_PUBLIC_KEY = import.meta.env.VITE_MARVEL_PUBLIC_API_KEY;
  const API_PRIVATE_KEY = import.meta.env.VITE_MARVEL_PRIVATE_API_KEY;

  const handleSearch = async (e) => {
    e.preventDefault();

    // Generate timestamp and hash
    const ts = Date.now().toString();
    const hash = md5(ts + API_PRIVATE_KEY + API_PUBLIC_KEY);
  
    // Construct the endpoint with query, ts, apiKey, and hash
    const endpoint = `/v1/public/characters?nameStartsWith=${searchTerm}&ts=${ts}&apikey=${API_PUBLIC_KEY}&hash=${hash}`;
    
    // Fetch the data
    const data = await fetchMarvelData(endpoint);
  
    // If data is available, update the results
    if (data && data.data) {
      setResults(data.data.results);
    }
  };
  
  const API_OPTIONS = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Function to fetch Marvel data from the API
  const fetchMarvelData = async (endpoint) => {
    try {
      // Make the GET request to Marvel API with ts, hash, and apikey
      const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        API_OPTIONS
      );
      const data = await response.json();
      console.log(data); // For debugging
      return data;
    } catch (error) {
      console.error("Error fetching Marvel data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Marvel Universe</h1>
        <form onSubmit={handleSearch} className="flex justify-center gap-2">
          <input
            type="text"
            placeholder="Search for a character..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg border w-64"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Search
          </button>
        </form>
      </header>

      {/* Results Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {results.map((character) => (
          <div
            key={character.id}
            className="bg-white rounded-2xl shadow p-4 text-center"
          >
            <img
              src={`${character.thumbnail.path}.${character.thumbnail.extension}`} // Use the correct image path
              alt={character.name}
              className="w-32 h-32 mx-auto rounded-full mb-4"
            />
            <h2 className="text-xl font-semibold">{character.name}</h2>
          </div>
        ))}
      </section>
    </div>
  );
}
