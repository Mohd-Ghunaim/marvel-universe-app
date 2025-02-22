import { useState } from "react";
import md5 from "md5";
import "./App.css";
import CharacterCard from "./components/CharacterCard";

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
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <h1 className="title">Marvel Universe</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search for a character..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </header>

      {/* Results Grid */}
      <section className="results-grid">
        {results.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </section>
    </div>
  );
}
