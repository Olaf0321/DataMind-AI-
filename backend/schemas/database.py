from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class 外部DBBase(BaseModel):
    タイプ: str
    ホスト: str
    ポート: str
    データベース名: str
    接続ID: str
    パスワード: str
    ファイルパス: Optional[str] = None
    ユーザーID: int

class 外部DB作成(外部DBBase):
    pass

class 外部DB更新(BaseModel):
    タイプ: Optional[str] = None
    ホスト: Optional[str] = None
    ポート: Optional[str] = None
    データベース名: Optional[str] = None
    接続ID: Optional[str] = None
    パスワード: Optional[str] = None
    ファイルパス: Optional[str] = None

class 外部DB表示(外部DBBase):
    id: int
    作成日時: datetime
    更新日時: datetime

    class Config:
        orm_mode = True
