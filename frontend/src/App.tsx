import { useState } from 'react'
import './App.css'

function App() {
  const [itemID, setItemID] = useState<number>(0);

  return (
    <>
      <label>Enter an itemID:</label>
      <br/>
      <input type='text' name='itemID'></input>

      <h2>Collaborative Filtering Recommendations</h2>
      <br />
      <h2>Content Filtering Recommendations</h2>
      <br />
      <h2>Azure Recommendations</h2>
    </>
  )
}

export default App
