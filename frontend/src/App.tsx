import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [itemID, setItemID] = useState('');
  const [collaborativeRecs, setCollaborativeRecs] = useState([]);
  const [contentRecs, setContentRecs] = useState([]);
  const [azureRecs, setAzureRecs] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Request recommendations from your ASP.NET API
      const response = await axios.get(
        `http://localhost:5000/api/recommendations?itemId=${itemID}`
      );
      setCollaborativeRecs(response.data.collaborative);
      setContentRecs(response.data.content);
      setAzureRecs(response.data.azure);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  return (
    <div className="App">
      <h1>News Article Recommendations</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Item ID:
          <input
            type="text"
            value={itemID}
            onChange={(e) => setItemID(e.target.value)}
          />
        </label>
        <button type="submit">Get Recommendations</button>
      </form>

      <h2>Collaborative Filtering Recommendations:</h2>
      <ul>
        {collaborativeRecs.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>

      <h2>Content-Based Filtering Recommendations:</h2>
      <ul>
        {contentRecs.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>

      <h2>Azure ML Recommendations:</h2>
      <ul>
        {azureRecs.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
