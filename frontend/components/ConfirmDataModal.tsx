import React from 'react';
import Image from 'next/image';

interface ConfirmDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void; // 完了ボタンで実行する処理
}

const ConfirmDataModal: React.FC<ConfirmDataModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal content */}
      <div className="relative bg-[#F5F5F5] rounded-lg p-8 w-[470px] max-h-[80vh] overflow-y-auto">
        <button className="cursor-pointer absolute top-4 right-4" onClick={onClose}>
          <Image src="/images/close.png" alt="close" width={20} height={20} />
        </button>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[25px] text-[#5E5E5E]">データの確認</h2>
        </div>

        <form className="space-y-6 text-[15px]">
          <div className="flex justify-center">
            <Image src="/images/success.png" alt="success" width={70} height={70} />
          </div>
          <div className="flex justify-center text-[#707070] text-center">
            本当に現在のデータで結果を生成しますか？
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 cursor-pointer"
              onClick={onClose}
            >
              キャンセル
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-[#0E538C] text-white rounded-md hover:bg-[#1c2d5a] cursor-pointer"
              onClick={onConfirm}
            >
              はい
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmDataModal;
