def get_schema_information(engine):
    inspector = inspect(engine)
    schema_info = {}

    for table_name in inspector.get_table_names():
        columns = inspector.get_columns(table_name)
        schema_info[table_name] = [
            {"name": col['name'], "type": str(col['type'])}
            for col in columns
        ]
    
    return schema_info