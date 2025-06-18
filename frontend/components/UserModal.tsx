import React from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import axios from 'axios';


interface UserFormValues {
  userName: string;
  email: string;
}
interface AddUserModalProps {
  isOpen: boolean;
  isChange: boolean;
  onClose: () => void;
  onChange: () => void;
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
  avatar?: FileList;
}

interface Status {
  status: string
}

interface User {
  'id': number;
  '名前': string;
  'メールアドレス': string;
  'アバター': string;
  '権限': string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, isChange, onChange, onClose }) => {
  const [databaseList, setDatabaseList] = useState([]);
  const [userId, setUserId] = useState<number | -1>(-1);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SignupForm>();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

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

  const updateUserInfo = useCallback(async (formData: FormData) => {
    try {
      const response = await axios.post<AuthResponse>(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('response', response);

      const { access_token } = response.data;
      localStorage.setItem('token', access_token);

      // Fetch user data after successful signup
      const userResponse = await axios.get<User>(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      
      localStorage.setItem("user", JSON.stringify(userResponse.data));
      return userResponse.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const onSubmit = async (data: SignupForm) => {
    try {
      setIsLoading(true);
      setError('');

      console.log('data', data);

      const formData = new FormData();
      formData.append('名前', data.名前);
      formData.append('メールアドレス', data.メールアドレス);
      formData.append('id', String(userId));

      if (data.avatar?.[0]) {
        formData.append('avatar', data.avatar[0]);
      }

      await updateUserInfo(formData);
      onClose();
      alert('ユーザー情報が正確に変更されました。');
      // router.push('/task-list');
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.detail || '登録に失敗しました');
      } else {
        setError('登録に失敗しました');
      }
    } finally {
      setIsLoading(false);
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
          reset({
            名前: userData['名前'],
            メールアドレス: userData['メールアドレス'],
            avatar: undefined
          })
          setAvatarPreview('');
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

        <form className="space-y-4 text-[15px]" onSubmit={handleSubmit(onSubmit)}>
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
            <label className="text-[#898989] flex justify-center w-[45%] bg-white border-none p-3 rounded-l-md focus:outline-none focus:ring-0 relative">
              <span>ユーザー名</span>
            </label>
            <div>
              <input
                id="名前"
                type="text"
                {...register('名前', { required: '名前を入力してください' })}
                className={`w-full bg-white border-none p-3 rounded-r-md focus:outline-none focus:ring-0 ${isChange === false && 'cursor-not-allowed'}`}
                disabled={!isChange}
              // onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              />
            </div>
          </div>
          <div className='text-right'>
            {errors.名前 && (
              <p className="mt-2 text-sm text-red-600">{errors.名前.message}</p>
            )}
          </div>

          <div className="flex relative">
            <label className="text-[#898989] flex justify-center w-[45%] bg-white border-none p-3 rounded-l-md focus:outline-none focus:ring-0 relative">
              <span>メールアドレス</span>
            </label>
            <div>
              <input
                id="メールアドレス"
                type="email"
                {...register('メールアドレス', {
                  required: 'メールアドレスを入力してください',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: '有効なメールアドレスを入力してください',
                  },
                })}
                className={`w-full bg-white border-none p-3 rounded-r-md focus:outline-none focus:ring-0 ${isChange === false && 'cursor-not-allowed'}`}
                disabled={!isChange}
              />
            </div>
          </div>
          <div className='text-right'>
            {errors.メールアドレス && (
              <p className="mt-2 text-sm text-red-600">{errors.メールアドレス.message}</p>
            )}
          </div>

          <div className="flex relative">
            <label className="text-[#898989] flex justify-center w-[45%] bg-white border-none p-3 rounded-l-md focus:outline-none focus:ring-0 relative">
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
            {/* Submit button: only shown when isChange === true */}
            {isChange && (
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-2 bg-[#0E538C] text-white rounded-md hover:bg-[#1c2d5a] cursor-pointer"
              >
                {isLoading ? '保存中...' : '保 存'}
              </button>
            )}

            <button
              type="button"
              onClick={isChange ? onChange : onClose}
              className="px-8 py-2 bg-[#ED601E] rounded-md text-white hover:bg-[#d6541b] cursor-pointer"
            >
              {isChange ? 'キャンセル' : '閉   じ   る'}
            </button>

            {!isChange && (
              <button
                type="button"
                className="px-8 py-2 bg-[#0E538C] text-white rounded-md hover:bg-[#1c2d5a] cursor-pointer"
                onClick={onChange}
              >
                編    集
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;