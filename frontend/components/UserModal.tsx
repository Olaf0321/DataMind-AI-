import React from 'react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';


interface UserFormValues {
  userName: string;
  email: string;
}
interface AddUserModalProps {
  isOpen: boolean;
  isChange: boolean;
  onClose: () => void;
  onChange: () => void;
  onSubmit: (data: UserFormValues) => void;
}

interface UserInfo {
  名前: string;
  メールアドレス: string;
  アバター?: string;
  権限?: string;
}

interface DatabaseFormValues {
  id: string;
  タイプ: string;
  ホスト: string;
  ポート: string;
  データベース名: string;
  接続ID: string;
  パスワード: string;
  ファイルパス: string;
  ユーザーID: number;
}

interface SignupForm {
  名前: string;
  メールアドレス: string;
  パスワード: string;
  パスワード確認: string;
  avatar?: FileList;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, isChange, onChange, onClose, onSubmit }) => {
  const [databaseList, setDatabaseList] = useState([]);
  const [userId, setUserId] = useState<number | -1>(-1);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignupForm>();
  const [user, setUser] = useState<UserInfo | null>(null);

  const [formData, setFormData] = React.useState<UserFormValues>({
    userName: '',
    email: '',
  });

  const getUserDatabaseList = async (userId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/database/list/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const resdata = await response.json();
      setDatabaseList(resdata);
    } catch (error) {
      console.error('Error fetching database list:', error);
      alert('データベースの取得に失敗しました');
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = Number(JSON.parse(localStorage.getItem("user") || "{}").id);
      setUserId(id);
      getUserDatabaseList(id);
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setFormData({
            userName: userData['名前'],
            email: userData['メールアドレス']
          })
        } catch {
          setUser(null);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal content */}
      <div className="relative bg-[#F5F5F5] rounded-lg p-8 w-[400px] max-h-[80vh] overflow-y-auto">
        <button className="cursor-pointer absolute top-4 right-4" onClick={onClose}>
          <Image src="/images/close.png" alt="close" width={20} height={20} />
        </button>
        <div className="flex justify-center items-center mb-3">
          <h2 className="text-[25px] text-black">ユーザー情報</h2>
        </div>

        <form className="space-y-4 text-[15px]">
          <div className="flex justify-center items-center mb-4 ml-2">
            <div className="mt-1 flex items-center space-x-4">
              <label
                htmlFor="avatar"
                className={`avatar ${isChange ? 'cursor-pointer' : 'cursor-not-allowed pointer-events-none'}`}
              >
                <div className={`relative w-25 aspect-square rounded-full shadow-md overflow-hidden ${isChange ? 'group' : ''}`}>
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="アバター"
                      fill
                      className="object-cover transition-all duration-300"
                    />
                  ) : (
                    <Image
                      src={
                        user !== undefined &&
                        `${process.env.NEXT_PUBLIC_SERVER_URL}/${user["アバター"].replace(/^uploads\//, "")}`
                      }
                      alt="アバター"
                      width={160}
                      height={160}
                      className="object-cover rounded-full transition-all duration-300 w-25 h-25"
                    />
                  )}

                  {/* Overlay appears only when change is true */}
                  {isChange && (
                    <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-70 transition-opacity duration-300">
                      <Image src="/images/editicon.png" width={32} height={32} alt="Camera Icon" />
                    </div>
                  )}
                </div>
              </label>
              <input
                id="avatar"
                {...register('avatar')}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleAvatarChange(e);
                  register('avatar').onChange?.(e);
                }}
                ref={(e) => {
                  register('avatar').ref(e);
                  fileInputRef.current = e;
                }}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="hidden px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                画像を選択
              </button>
            </div>
          </div>
          <div className="flex relative">
            <label className="text-[#898989] flex justify-center w-[40%] bg-white border-none p-3 rounded-l-md focus:outline-none focus:ring-0 relative">
              <span>ユーザー名</span>
            </label>
            <input
              type="text"
              className={`w-[60%] bg-white border-none p-2 rounded-r-md focus:outline-none focus:ring-0 ${isChange === false && 'cursor-not-allowed'}`}
              value={formData.userName}
              disabled={!isChange}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
            />
          </div>

          <div className="flex relative">
            <label className="text-[#898989] flex justify-center w-[40%] bg-white border-none p-3 rounded-l-md focus:outline-none focus:ring-0 relative">
              <span>メールアドレス</span>
            </label>
            <input
              type="text"
              className={`w-[60%] bg-white border-none p-2 rounded-r-md focus:outline-none focus:ring-0 ${isChange === false && 'cursor-not-allowed'}`}
              placeholder="example@domain.com"
              value={formData.email}
              disabled={!isChange}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="flex relative">
            <label className="text-[#898989] flex justify-center w-[40%] bg-white border-none p-3 rounded-l-md focus:outline-none focus:ring-0 relative">
              <span>データベース</span>
            </label>
            <select
              className="w-[60%] bg-white border-none p-2 rounded-md cursor-pointer focus:outline-none focus:ring-0 text-[12px]"
            >
              {databaseList.length === 0 && (
                <option value="0" disabled className='text-[12px]'>
                  データベースがありません
                </option>
              )}
              {databaseList.length > 0 && databaseList.map((db: DatabaseFormValues) => (
                <option key={db.データベース名} value={db.id}>
                  {db.データベース名}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between space-x-4 mt-6">
            <button
              type="button"
              onClick={isChange === false ? onClose : onChange}
              className="px-8 py-2 bg-[#ED601E] rounded-md text-white hover:bg-[#d6541b] cursor-pointer"
            >
              {isChange == false ? "閉   じ   る" : "キャンセル"}
            </button>
            <button
              type="button"
              className="px-8 py-2 bg-[#0E538C] text-white rounded-md hover:bg-[#1c2d5a] cursor-pointer"
              onClick={()=>
                (isChange === false) ? onChange() : onSubmit(formData)
              }
            >
              {isChange == false ? "編     集" : "保     存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal; 