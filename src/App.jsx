// App.jsx
import { useState } from "react";
import { Client } from 'appwrite';
import md5 from 'md5';


export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const API_BASE_URL = 'https://gateway.marvel.com:443';

  const handleSearch = async (e) => {
    e.preventDefault();
    const ts = Date.now().toString();
    const hash = md5(ts + API_PRIVATE_KEY + API_PUBLIC_KEY);}
    
  // Replace 'your-public-api-key-here' with the actual public API key from your .env.local file
  const API_PUBLIC_KEY = import.meta.env.VITE_MARVEL_PUBLIC_API_KEY;
  const API_PRIVATE_KEY = import.meta.env.VITE_MARVEL_PRIVATE_API_KEY;

  const API_OPTIONS = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const tempEndpoint = '/v1/public/characters';

  // Example function to make a request
  const fetchMarvelData = async (endpoint) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${endpoint}?apikey=${API_PUBLIC_KEY}`,
        API_OPTIONS
      );
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching Marvel data:', error);
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
              src={character.image}
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