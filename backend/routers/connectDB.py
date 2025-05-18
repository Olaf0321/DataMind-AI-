from sqlalchemy import create_engine, inspect

def connect_to_database(db_type, host, port, db_name, username, password):
    db_url = f"{db_type}://{username}:{password}@{host}:{port}/{db_name}"
    engine = create_engine(db_url)
    return engine
