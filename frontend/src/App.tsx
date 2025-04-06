import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [contentId, setContentId] = useState<number | string>('');
  const [result, setResult] = useState<string | null>(null);
  const [collabData, setCollabData] = useState<string[][]>([]);
  const [contentData, setContentData] = useState<string[][]>([]);
  const [item, setItem] = useState<string[][] | null>(null);

  const parseCsv = (csvString: string): string[][] => {
    const rows = csvString.split('\n');
    return rows.map((row) => row.split(','));
  }

  const fetchCsvData = async () => {
    try {
      const response1 = await fetch('/data/collaborative_filtering_results.csv');
      const data1 = await response1.text();
      setCollabData(parseCsv(data1));

      const response2 = await fetch('/data/content_filtering_results.csv');
      const data2 = await response2.text();
      setContentData(parseCsv(data2));
    } catch (error) {
      console.error('Error loading CSV files:', error);
    }
  };

  useEffect(() => {
    fetchCsvData();
  }, []);

  const handleSearch = () => {
    let foundItems: string[][] = [];

    // Search in both CSV files and collect matches
    const collabMatches = collabData.filter(row => row[0] === contentId.toString());
    const contentMatches = contentData.filter(row => row[0] === contentId.toString());

    console.log('collabMatches:', collabMatches);
    console.log('contentMatches:', contentMatches);

    // Combine the matches from both CSV files
    foundItems = [...collabMatches, ...contentMatches];

    // Set the found items (can be null if no matches found)
    setItem(foundItems.length > 0 ? foundItems : null);
  };



  const callAzure = async () => {
  try {
    const payload = {
      Inputs: {
        input1: [
          {
            personId: 782843067739729200,
            contentId: contentId,
            eventType: 2
          }
        ]
      },
      GlobalParameters: {}
    };

    console.log('Request Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch('http://localhost:5000/azure/call', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status} - ${error}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    setResult(JSON.stringify(data, null, 2));  // Assuming `setResult` handles the result display

  } catch (error: any) {
    console.error("Error calling backend:", error);
    setResult(`Error: ${error.message}`);
  }
};



  return (
    <>

      <label>Enter an contentId:
      <input type='number' value={contentId} onChange={(e) => setContentId(e.target.value)}></input>
      </label>
      <br/>

      <button onClick={handleSearch}>Search for Recommendations</button>

      {item ? (
      <>
        <h3>Search Result:</h3>
        <p>Item found based on contentId {contentId}:</p>
        <div>
          {item.map((row, index) => (
            <div key={index}>
              <p>{row.join('\n ')}</p> {/* Display each row in a readable format */}
            </div>
          ))}
        </div>
      </>
        ) : (
          <p>No item found for contentId: {contentId}</p>
        )}
      <br />
      <br />
      <h2>Azure Recommendations</h2>
      <button onClick={callAzure}>Click for Recommendations</button>
    </>
  )
}

export default App
