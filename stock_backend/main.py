from fastapi import FastAPI, HTTPException
import mysql.connector
from pydantic import BaseModel
from typing import List

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://internproject-janatawifi.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Connection
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="StockMarketDB"
    )

# Data Model for Validation
class Stock(BaseModel):
    date: str
    trade_code: str
    high: float
    low: float
    open: float
    close: float
    volume: int

# 1️⃣ **Fetch all stocks**
@app.get("/data")
def get_stocks():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Stocks")
    stocks = cursor.fetchall()
    cursor.close()
    connection.close()
    return stocks

# 2️⃣ **Insert new stock data**
@app.post("/data")
def create_stock(stock: Stock):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO Stocks (date, trade_code, high, low, open, close, volume)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (stock.date, stock.trade_code, stock.high, stock.low, stock.open, stock.close, stock.volume))

    connection.commit()
    cursor.close()
    connection.close()
    return {"message": "Stock data inserted successfully!"}

# 3️⃣ **Update stock data**
@app.put("/data/{stock_id}")
def update_stock(stock_id: int, stock: Stock):
    connection = get_db_connection()
    cursor = connection.cursor()

    print(f"Updating stock ID {stock_id} with: {stock}")  # Debugging line

    cursor.execute("""
        UPDATE Stocks
        SET date=%s, trade_code=%s, high=%s, low=%s, open=%s, close=%s, volume=%s
        WHERE id=%s
    """, (stock.date, stock.trade_code, stock.high, stock.low, stock.open, stock.close, stock.volume, stock_id))

    connection.commit()
    cursor.close()
    connection.close()
    return {"message": f"Stock with ID {stock_id} updated successfully!"}


# 4️⃣ **Delete stock data**
@app.delete("/data/{stock_id}")
def delete_stock(stock_id: int):
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("DELETE FROM Stocks WHERE id=%s", (stock_id,))
    connection.commit()
    cursor.close()
    connection.close()
    return {"message": f"Stock data with ID {stock_id} deleted successfully!"}

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (frontend)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
