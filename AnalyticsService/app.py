from flask import Flask
import pymysql
import pandas as pd
from pymongo import MongoClient

app = Flask(__name__)

# MySQL configurations
mysql_config = {
    'host': 'mysql', 
    'user': 'root',
    'password': 'Pirate65',
    'db': 'enter_data_db'
}

# MongoDB configurations
mongo_config = {
    'host': 'mongodb',
    'username': 'root',
    'password': 'Pirate65'
}

@app.route('/process-data')
def process_data():
   
    mysql_conn = pymysql.connect(**mysql_config)
    
    df = pd.read_sql('SELECT * FROM data_entries1', mysql_conn)
   
    mysql_conn.close()
    if df.empty:
        max_value = None
        min_value = None
        avg_value = None
    else:
        max_value = df['data'].max()
        min_value = df['data'].min()
        avg_value = df['data'].mean()

    # Perform analytics
    max_value = float(max_value) if pd.notnull(max_value) else 0
    min_value = float(min_value) if pd.notnull(min_value) else 0
    avg_value = float(avg_value) if pd.notnull(avg_value) else 0

    # Connect to MongoDB
    mongo_client = MongoClient(**mongo_config)
    db = mongo_client['analytics_db']
    collection = db['statistics']

    stats_data = {
    'max': max_value if max_value is not None else "No data",
    'min': min_value if min_value is not None else "No data",
    'avg': avg_value if avg_value is not None else "No data"
    }
    collection.insert_one(stats_data)


    mongo_client.close()

    return 'Analytics processed and stored to MongoDB'

if __name__ == '__main__':
    app.run(host='0.0.0.0')
