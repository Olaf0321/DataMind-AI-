import React from 'react';
import Image from 'next/image';
interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSubmit }) => {
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
          <h2 className="text-[25px] text-black">新規ユーザー登録</h2>
        </div>

        <form className="space-y-6 text-[15px]">
          <div className="flex relative">
            <label className="text-[#898989] flex justify-center w-[40%] bg-white border-none p-4 rounded-l-md focus:outline-none focus:ring-0 relative">
              <span>ユーザー名</span>
              <span className="text-[#FF6161] absolute right-5 top-2 text-[13px]" >必須</span>
            </label>
            <input
              type="text"
              className="w-[60%] bg-white border-none p-2 rounded-r-md focus:outline-none focus:ring-0"
              placeholder="山田太郎"
            />
          </div>

          <div className="flex relative">
            <label className="text-[#898989] flex justify-center w-[40%] bg-white border-none p-4 rounded-l-md focus:outline-none focus:ring-0 relative">
              <span>メールアドレス</span>
              <span className="text-[#FF6161] absolute right-2 top-2 text-[13px]" >必須</span>
            </label>
            <input
              type="text"
              className="w-[60%] bg-white border-none p-2 rounded-r-md focus:outline-none focus:ring-0"
              placeholder="example@domain.com"
            />
          </div>

          <div className="flex relative">
            <label className="text-[#898989] flex justify-center w-[40%] bg-white border-none p-4 rounded-l-md focus:outline-none focus:ring-0 relative">
              <span>パスワード</span>
              <span className="text-[#FF6161] absolute right-5 top-2 text-[13px]" >必須</span>
            </label>
            <input
              type="text"
              className="w-[60%] bg-white border-none p-2 rounded-r-md focus:outline-none focus:ring-0"
              placeholder="パスワードを入力"
            />
          </div>

          <div className="flex relative">
            <label className="text-[#898989] flex justify-center w-[40%] bg-white border-none p-4 rounded-l-md focus:outline-none focus:ring-0 relative">
              <span>パスワード確認</span>
              <span className="text-[#FF6161] absolute right-1 top-2 text-[13px]" >必須</span>
            </label>
            <input
              type="text"
              className="w-[60%] bg-white border-none p-2 rounded-r-md focus:outline-none focus:ring-0"
              placeholder="パスワードを再入力"
            />
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
              onClick={onSubmit}
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal; 