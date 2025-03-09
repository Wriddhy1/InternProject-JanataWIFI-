import json
import mysql.connector

# Connect to MySQL
db_connection = mysql.connector.connect(
    host="localhost",
    user="root",  # Default MySQL username in XAMPP
    password="",  # Default MySQL password is empty
    database="StockMarketDB"
)
cursor = db_connection.cursor()

# Load JSON data
with open("stock_market_data.json", "r") as file:
    stock_data = json.load(file)

# Insert data into the database
for stock in stock_data:
    cursor.execute("""
        INSERT INTO Stocks (date, trade_code, high, low, open, close, volume)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (
        stock['date'],
        stock['trade_code'],
        stock['high'],
        stock['low'],
        stock['open'],
        stock['close'],
        stock['volume'].replace(",", "")  # Remove commas from volume
    ))

db_connection.commit()
cursor.close()
db_connection.close()

print("✅ Data successfully inserted into MySQL!")
