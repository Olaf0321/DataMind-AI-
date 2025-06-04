import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface DatabaseFormValues {
  'タイプ': string;
  'ホスト': string;
  'ポート': string;
  'データベース名': string;
  '接続ID': string;
  'パスワード': string;
  'ファイルパス': string;
  'ユーザーID': number;
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
  selectedId: number;
  selectedDatabase: DatabaseFormValues;
  userList: User[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DatabaseFormValues) => void;
}

const initialFormValues: DatabaseFormValues = {
  'タイプ': 'MySQL',
  'ホスト': '',
  'ポート': '',
  'データベース名': '',
  '接続ID': '',
  'パスワード': '',
  'ファイルパス': '',
  'ユーザーID': -1,
};

const AddDatabaseModal: React.FC<AddDatabaseModalProps> = ({ selectedDatabase, userList, isOpen, onClose, onSubmit }) => {
  console.log('userList', userList)
  const [Datatype, setDatatype] = useState('');
  const [formData, setFormData] = useState<DatabaseFormValues>({} as DatabaseFormValues);

  useEffect(() => {
    setFormData({ ...selectedDatabase });
    setDatatype(selectedDatabase['タイプ']);
  }, [selectedDatabase]);

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
              value={formData['タイプ']}
              onChange={(e) => {
                setDatatype(e.target.value)
                setFormData({ ...formData, 'タイプ': e.target.value });
              }}
            >
              <option value="MySQL">MySQL</option>
              <option value="Oracle">Oracle</option>
              <option value="Sqlite" disabled>Sqlite</option>
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
              value={formData['ホスト']}
              disabled={Datatype === "Sqlite"}
              onChange={(e) => setFormData({ ...formData, 'ホスト': e.target.value })}
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
              value={formData['ポート']}
              disabled={Datatype === "Sqlite"}
              onChange={(e) => setFormData({ ...formData, 'ポート': e.target.value })}
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
              value={formData['データベース名']}
              disabled={Datatype === "Sqlite"}
              onChange={(e) => setFormData({ ...formData, 'データベース名': e.target.value })}
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
              value={formData['接続ID']}
              placeholder="root"
              disabled={Datatype === "Sqlite"}
              onChange={(e) => setFormData({ ...formData, '接続ID': e.target.value })}
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
              value={formData['パスワード']}
              placeholder="root"
              disabled={Datatype === "Sqlite"}
              onChange={(e) => setFormData({ ...formData, 'パスワード': e.target.value })}
            />
          </div>

          <div className="flex relative">
            <label className="text-[#898989] flex justify-center w-[40%] bg-white border-none p-2 rounded-l-md focus:outline-none focus:ring-0 relative">
              <span>ファイルパス</span>
              <span 
                className={`text-[#FF6161] absolute right-2 top-2 text-[10px] ${Datatype !== "Sqlite" && 'hidden'}`}
              >必須</span>
            </label>
            <input
              type="file"
              className={`w-[60%] bg-white border-none p-2 rounded-r-md focus:outline-none focus:ring-0 ${Datatype === "MySQL" || Datatype === "Oracle" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white text-black cursor-pointer"}`}
              disabled={Datatype === "MySQL" || Datatype === "Oracle"}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // ブラウザでは本当のパスは取得できないので、擬似的に File オブジェクトをURL化して保存
                  const fileUrl = URL.createObjectURL(file);
                  setFormData({ ...formData, 'ファイルパス': fileUrl });
                  // 必要ならfile自体を別stateで保持し、アップロード時に使う
                } else {
                  setFormData({ ...formData, 'ファイルパス': '' });
                }
              }}
            />
          </div>

          <div className={`flex relative`}>
            <label className="text-[#898989] flex justify-center w-[40%] bg-white border-none p-2 rounded-l-md focus:outline-none focus:ring-0 relative">
              <span>ユーザー名</span>
              <span className="text-[#FF6161] absolute right-2 top-2 text-[10px]" >必須</span>
            </label>
            <select
              className={`w-[60%] bg-white border-noe p-2 rounded-r-md focus:outline-none focus:ring-0 cursor-pointer`}
              onChange={(e) => setFormData({ ...formData, 'ユーザーID': Number(e.target.value) })}
            >
              <option value="-1">ユーザー選択</option>
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
              onClick={() => {
                if (formData['ホスト'] === '') {
                  alert('ホストを入力してください。')
                  return
                }
                if (formData['ポート'] === '') {
                  alert('ポートを入力してください。')
                  return
                }
                if (formData['データベース名'] === '') {
                  alert('データベース名を入力してください。')
                  return
                }
                if (formData['接続ID'] === '') {
                  alert('接続IDを入力してください。')
                  return
                }
                if (formData['パスワード'] === '') {
                  alert('パスワードを入力してください。')
                  return
                }
                if (formData['ユーザーID'] === -1) {
                  alert('ユーザー名を入力してください。')
                  return
                }
                onSubmit(formData);
                setFormData(initialFormValues);
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