import json
import mysql.connector
import os

# Connect to MySQL
db_connection = mysql.connector.connect(
        host=os.getenv("MYSQL_ADDON_HOST"),
        user=os.getenv("MYSQL_ADDON_USER"),
        password=os.getenv("MYSQL_ADDON_PASSWORD"),
        database=os.getenv("MYSQL_ADDON_DB"),
        port=int(os.getenv("MYSQL_ADDON_PORT")),
        ssl_disabled=False  # Enable SSL for Clever-Cloud
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
