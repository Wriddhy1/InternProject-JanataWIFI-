import React, { useEffect, useState, useMemo } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const StockChart = ({ stocks }) => {
  const [tradeCodes, setTradeCodes] = useState([]);
  const [selectedTradeCode, setSelectedTradeCode] = useState("");

  // Memoized filtered data (prevents unnecessary re-renders)
  const filteredData = useMemo(() => {
    if (!stocks || stocks.length === 0) return [];
    return selectedTradeCode
      ? stocks.filter(stock => stock.trade_code === selectedTradeCode)
      : stocks;
  }, [selectedTradeCode, stocks]);

  // Extract unique trade codes for dropdown
  useEffect(() => {
    if (Array.isArray(stocks) && stocks.length > 0) {
      setTradeCodes([...new Set(stocks.map(stock => stock.trade_code))]);
    }
  }, [stocks]);

  return (
    <div>
      <h2>Stock Price & Volume Chart</h2>

      {/* Dropdown to select trade_code */}
      <label>Select Trade Code: </label>
      <select onChange={(e) => setSelectedTradeCode(e.target.value)} value={selectedTradeCode}>
        <option value="">All Trade Codes</option>
        {tradeCodes.map((code) => (
          <option key={code} value={code}>{code}</option>
        ))}
      </select>

      {/* Only render ResponsiveContainer when data is available */}
      {filteredData.length > 0 ? (
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" label={{ value: "Close Price", angle: -90, position: "insideLeft" }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: "Volume", angle: -90, position: "insideRight" }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="close" stroke="#8884d8" />
              <Bar yAxisId="right" dataKey="volume" fill="#82ca9d" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default StockChart;