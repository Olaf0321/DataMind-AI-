import React, { useState } from 'react';
import Image from 'next/image';

interface DatabaseFormValues {
  databaseType: string;
  host: string;
  port: string;
  databaseName: string;
  connectionId: string;
  password: string;
  filePath: string;
  userId: number;
}

interface User {
  id: number;
  名前: string;
  メールアドレス: string;
  パスワード: string;
  アバター: string;
  権限: string;
  作成日時: string;
  更新日時: string;
}

interface AddDatabaseModalProps {
  userList: User[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DatabaseFormValues) => void;
}

const AddDatabaseModal: React.FC<AddDatabaseModalProps> = ({ userList, isOpen, onClose, onSubmit }) => {
  const [Datatype, setDatatype] = useState("MySQL");
  const [formData, setFormData] = useState<DatabaseFormValues>({
    databaseType: 'MySQL',
    host: '',
    port: '',
    databaseName: '',
    connectionId: '',
    password: '',
    filePath: '',
    userId: 1,
  });
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal content */}
      <div className="relative bg-[#F5F5F5] rounded-lg p-8 w-[500px] max-h-[80vh] overflow-y-auto">
        <button className="cursor-pointer absolute top-4 right-4" onClick={onClose}>
          <Image src="/images/close.png" alt="close" width={20} height={20} />
        </button>
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-[25px] text-black">新規データベース作成</h2>
        </div>

        <form className="space-y-4 text-[15px]">
          <div className="flex relative">
            <label className="text-[#898989] flex justify-center w-[40%] bg-white border-none p-2 rounded-l-md focus:outline-none focus:ring-0 relative">
              <span>タイプ</span>
              <span className="text-[#FF6161] absolute right-2 top-2 text-[10px]" >必須</span>
            </label>
            <select
              className="w-[60%] bg-white border-none p-2 rounded-r-md focus:outline-none focus:ring-0 cursor-pointer"
              onChange={(e) => {
                setDatatype(e.target.value)
                setFormData({ ...formData, databaseType: e.target.value });
              }}
            >
              <option value="MySQL">MySQL</option>
              <option value="Oracle">Oracle</option>
              <option value="Sqlite">Sqlite</option>
            </select>
          </div>

          <div className="flex relative">
            <label className="text-[#898989] flex justify-center w-[40%] bg-white border-none p-2 rounded-l-md focus:outline-none focus:ring-0 relative">
              <span>ホスト</span>
              <span className="text-[#FF6161] absolute right-2 top-2 text-[10px]" >必須</span>
            </label>
            <input
              type="text"
              className={`w-[60%] bg-white border-none p-2 rounded-r-md focus:outline-none focus:ring-0 ${Datatype === "Sqlite" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white text-black"}`} 
              placeholder="localhost"
              disabled={Datatype === "Sqlite"}
              onChange={(e) => setFormData({ ...formData, host: e.target.value })}
            />
          </div>

          <div className="flex relative">
            <label className="text-[#898989] flex justify-center w-[40%] bg-white border-none p-2 rounded-l-md focus:outline-none focus:ring-0 relative">
              <span>ポート</span>
              <span className="text-[#FF6161] absolute right-2 top-2 text-[10px]" >必須</span>
            </label>
            <input
              type="text"
              className={`w-[60%] bg-white border-none p-2 rounded-r-md focus:outline-none focus:ring-0 ${Datatype === "Sqlite" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white text-black"}`} 
              placeholder="3306"
              disabled={Datatype === "Sqlite"}
              onChange={(e) => setFormData({ ...formData, port: e.target.value })}
            />
          </div>

          <div className="flex relative">
            <label className="text-[#898989] flex justify-center w-[40%] bg-white border-none p-2 rounded-l-md focus:outline-none focus:ring-0 relative">
              <span>データベース名</span>
              <span className="text-[#FF6161] absolute right-2 top-2 text-[10px]" >必須</span>
            </label>
            <input
              type="text"
              className={`w-[60%] bg-white border-none p-2 rounded-r-md focus:outline-none focus:ring-0 ${Datatype === "Sqlite" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white text-black"}`} 
              placeholder="test"
              disabled={Datatype === "Sqlite"}
              onChange={(e) => setFormData({ ...formData, databaseName: e.target.value })}
            />
          </div>

          <div className="flex relative">
            <label className="text-[#898989] flex justify-center w-[40%] bg-white border-none p-2 rounded-l-md focus:outline-none focus:ring-0 relative">
              <span>接続ID</span>
              <span className="text-[#FF6161] absolute right-2 top-2 text-[10px]" >必須</span>
            </label>
            <input
              type="text"
              className={`w-[60%] bg-white border-none p-2 rounded-r-md focus:outline-none focus:ring-0 ${Datatype === "Sqlite" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white text-black"}`} 
              placeholder="root"
              disabled={Datatype === "Sqlite"}
              onChange={(e) => setFormData({ ...formData, connectionId: e.target.value })}
            />
          </div>

          <div className="flex relative">
            <label className="text-[#898989] flex justify-center w-[40%] bg-white border-none p-2 rounded-l-md focus:outline-none focus:ring-0 relative">
              <span>パスワード</span>
              <span className="text-[#FF6161] absolute right-2 top-2 text-[10px]" >必須</span>
            </label>
            <input
              type="password"
              className={`w-[60%] bg-white border-none p-2 rounded-r-md focus:outline-none focus:ring-0 ${Datatype === "Sqlite" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white text-black"}`} 
              placeholder="root"
              disabled={Datatype === "Sqlite"}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="flex relative">
            <label className="text-[#898989] flex justify-center w-[40%] bg-white border-none p-2 rounded-l-md focus:outline-none focus:ring-0 relative">
              <span>ファイルパス</span>
              <span className="text-[#FF6161] absolute right-2 top-2 text-[10px]" >必須</span>
            </label>
            <input
              type="file"
              className={`w-[60%] bg-white border-none p-2 rounded-r-md focus:outline-none focus:ring-0 ${Datatype === "MySQL" || Datatype === "Oracle" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white text-black cursor-pointer"}`} 
              disabled={Datatype === "MySQL" || Datatype === "Oracle"}
              onChange={(e) => setFormData({ ...formData, filePath: e.target.value })}
            />
          </div>

          <div className={`flex relative`}>
            <label className="text-[#898989] flex justify-center w-[40%] bg-white border-none p-2 rounded-l-md focus:outline-none focus:ring-0 relative">
              <span>ユーザー名</span>
              <span className="text-[#FF6161] absolute right-2 top-2 text-[10px]" >必須</span>
            </label>
            <select
              className={`w-[60%] bg-white border-noe p-2 rounded-r-md focus:outline-none focus:ring-0 cursor-pointer`} 
              onChange={(e) => setFormData({ ...formData, userId: Number(e.target.value) })}
            >
              <option value="1">ユーザー選択</option>
              {userList.length === 0 && (
                <option value="0" disabled className='text-[12px]'>
                  ユーザーがありません
                </option>
              )}
              {userList.length > 0 && userList.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.名前}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#ED601E] rounded-md text-white hover:bg-[#d6541b] cursor-pointer"
            >
              キャンセル
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-[#0E538C] text-white rounded-md hover:bg-[#1c2d5a] cursor-pointer"
              onClick={()=>{
                console.log(formData);
                onSubmit(formData);
                setFormData({
                  databaseType: 'MySQL',
                  host: '',
                  port: '',
                  databaseName: '',
                  connectionId: '',
                  password: '',
                  filePath: '',
                  userId: 1,
                });
                setDatatype("MySQL");
              }}
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDatabaseModal;