import React, { useState, useEffect } from "react";
import axios from "axios";
import StockChart from "./components/StockChart";


function App() {
  const [stocks, setStocks] = useState([]); // Stores stock data
  const [editingStockId, setEditingStockId] = useState(null); // Tracks which row is being edited
  const [editedStock, setEditedStock] = useState({}); // Stores edited values

  // Fetch stock data from backend
  useEffect(() => {
    axios
      .get("https://internproject-janatawifi-backend.onrender.com/data")
      .then((response) => {
        const sortedData = response.data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setStocks(sortedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Enable editing for a row
  const handleEdit = (stock) => {
    setEditingStockId(stock.id);
    setEditedStock({ ...stock });
  };

  // Handle input changes
  const handleChange = (e, field) => {
    setEditedStock({ ...editedStock, [field]: e.target.value });
  };

  // Save updated data to backend
  const handleSave = async () => {
    try {
      await axios.put(
        `https://internproject-janatawifi-backend.onrender.com/data/${editedStock.id}`,
        editedStock
      );
      setStocks(
        stocks.map((stock) =>
          stock.id === editedStock.id ? editedStock : stock
        )
      );
      setEditingStockId(null); // Exit edit mode
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Delete a stock record
  const handleDelete = async (stockId) => {
    try {
      await axios.delete(`https://internproject-janatawifi-backend.onrender.com/data/${stockId}`);
      setStocks(stocks.filter((stock) => stock.id !== stockId));
    } catch (error) {
      console.error("Error deleting stock:", error);
    }
  };

  return (
    <div className="App">
      {/* Stock Chart Component */}
      <StockChart stocks={stocks} />

      <h2>Stock Market Data</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Date</th>
            <th>Trade Code</th>
            <th>High</th>
            <th>Low</th>
            <th>Open</th>
            <th>Close</th>
            <th>Volume</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.id}>
              {["date", "trade_code", "high", "low", "open", "close", "volume"].map(
                (field) => (
                  <td key={field}>
                    {editingStockId === stock.id ? (
                      <input
                        type="text"
                        value={editedStock[field]}
                        onChange={(e) => handleChange(e, field)}
                      />
                    ) : (
                      stock[field]
                    )}
                  </td>
                )
              )}
              <td>
                {editingStockId === stock.id ? (
                  <button onClick={handleSave}>Save</button>
                ) : (
                  <>
                    <button onClick={() => handleEdit(stock)}>Edit</button>
                    <button onClick={() => handleDelete(stock.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
