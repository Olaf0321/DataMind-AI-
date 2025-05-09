import React from 'react';
import { useRouter } from 'next/navigation';
interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal content */}
      <div className="relative bg-[#F5F5F5] rounded-lg p-8 w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="pl-10 text-[25px] text-black">タスク追加</h2>
        </div>

        <form className="space-y-6 text-[15px]">
          <div className="flex">
            <input
              type="text"
              className="w-[60%] bg-white border-none p-2 rounded-md focus:outline-none focus:ring-0 mr-3"
              placeholder="タスク名を入力"
            />
            <select className="w-[40%] bg-white border-none p-2 rounded-md cursor-pointer focus:outline-none focus:ring-0 mr-3">
              <option value="1">データベース選択</option>
              <option value="2">全体</option>
              <option value="3">作成日</option>
            </select>
          </div>

          <div>
            <textarea
              className="bg-white border-none w-full p-2 max-h-[200px] border border-gray-300 rounded-md focus:outline-none focus:ring-0"
              rows={5}
              placeholder="タスクの説明を入力"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#ED601E] rounded-md text-white hover:bg-[#d6541b] cursor-pointer"
            >
              キャンセル
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-[#243A73] text-white rounded-md hover:bg-[#1c2d5a] cursor-pointer"
              onClick={() => router.push('/select-query')}
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal; 