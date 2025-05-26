# from sqlalchemy import inspect

# def get_schema_information(engine):
#     inspector = inspect(engine)
#     schema_info = {}

#     for table_name in inspector.get_table_names():
#         columns = inspector.get_columns(table_name)
#         schema_info[table_name] = [
#             {"name": col['name'], "type": str(col['type'])}
#             for col in columns
#         ]
    
#     return schema_info

from sqlalchemy import inspect

def get_schema_information(engine):
    inspector = inspect(engine)
    schema_info = {}

    for table_name in inspector.get_table_names():
        columns = inspector.get_columns(table_name)
        primary_keys = inspector.get_pk_constraint(table_name)['constrained_columns']
        foreign_keys = inspector.get_foreign_keys(table_name)

        schema_info[table_name] = {
            "columns": [],
            "primary_keys": primary_keys,
            "foreign_keys": []
        }

        for col in columns:
            schema_info[table_name]["columns"].append({
                "name": col['name'],
                "type": str(col['type'])
            })

        for fk in foreign_keys:
            schema_info[table_name]["foreign_keys"].append({
                "column": fk['constrained_columns'][0],         # 外部キー列
                "referred_table": fk['referred_table'],         # 参照先テーブル
                "referred_column": fk['referred_columns'][0]    # 参照先カラム
            })

    return schema_info
