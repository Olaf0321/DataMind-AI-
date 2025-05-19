from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from urllib.parse import quote_plus

def connect_to_database(db_type, host, port, db_name, username, password):
    try:
        encoded_password = quote_plus(password)
        db_url = f"{db_type}+pymysql://{username}:{encoded_password}@{host}:{port}/{db_name}"
        engine = create_engine(db_url)
        with engine.connect() as connection:
            print("Connection successful")
        return engine
    except SQLAlchemyError as e:
        print(f"Error connecting to the database: {e}")
        return None