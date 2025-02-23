import { useState } from "react";
import md5 from "md5";
import "./App.css";
import CharacterCard from "./components/CharacterCard";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // Track if search has been performed

  const API_BASE_URL = "https://gateway.marvel.com:443";
  const API_PUBLIC_KEY = import.meta.env.VITE_MARVEL_PUBLIC_API_KEY;
  const API_PRIVATE_KEY = import.meta.env.VITE_MARVEL_PRIVATE_API_KEY;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return; // Prevent search if input is empty

    setIsLoading(true);
    setHasSearched(true); // Mark that search has been performed

    const ts = Date.now().toString();
    const hash = md5(ts + API_PRIVATE_KEY + API_PUBLIC_KEY);

    const endpoint = `/v1/public/characters?nameStartsWith=${searchTerm}&ts=${ts}&apikey=${API_PUBLIC_KEY}&hash=${hash}`;
    const data = await fetchMarvelData(endpoint);

    if (data && data.data) {
      setResults(data.data.results);
    }

    setIsLoading(false);
  };

  const fetchMarvelData = async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching Marvel data:", error);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">Marvel DataBase</h1>
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

      <section className="results-grid">
        {isLoading ? (
          <p className="loading">Loading...</p>
        ) : hasSearched && results.length === 0 ? ( // Check if a search has been performed and no results are found
          <p className="no-results">No results found.</p>
        ) : (
          results.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))
        )}
      </section>
    </div>
  );
}
