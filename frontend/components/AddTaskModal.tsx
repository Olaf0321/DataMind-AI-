import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

interface TaskFormValues {
  taskName: string;
  taskDescription: string;
  databaseId: string;
}

interface AddTaskModalProps {
  databaseList: DatabaseFormValues[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormValues) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ databaseList, isOpen, onClose, onSubmit }) => {
  console.log('AddTaskModal databaseList:', databaseList);
  const router = useRouter();

  const [formValues, setFormValues] = React.useState<TaskFormValues>({
    taskName: '',
    taskDescription: '',
    databaseId: '1',
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="pl-10 text-[25px] text-black">タスク追加</h2>
        </div>

        <form className="space-y-6 text-[15px]">
          <div className="flex">
            <input
              type="text"
              className="w-[60%] bg-white border-none p-2 rounded-md focus:outline-none focus:ring-0 mr-3"
              onChange={(e) => {
                setFormValues((prev) => ({
                  ...prev,
                  taskName: e.target.value,
                }));
              }}
              placeholder="タスク名を入力"
            />
            <select
              className="w-[40%] bg-white border-none p-2 rounded-md cursor-pointer focus:outline-none focus:ring-0 mr-3 text-[12px]"
              onChange={(e) => {
                setFormValues((prev) => ({
                  ...prev,
                  databaseId: e.target.value,
                }));
              }}
            >
              <option value="1">データベース選択</option>

              {databaseList.length === 0 && (
                <option value="0" disabled className='text-[12px]'>
                  データベースがありません
                </option>
              )}
              {databaseList.length > 0 && databaseList.map((db) => (
                <option key={db.データベース名} value={db.id}>
                  {db.データベース名}
                </option>
              ))}
            </select>
          </div>

          <div>
            <textarea
              className="bg-white border-none w-full p-2 max-h-[200px] border border-gray-300 rounded-md focus:outline-none focus:ring-0"
              rows={5}
              onChange={(e) => {
                setFormValues((prev) => ({
                  ...prev,
                  taskDescription: e.target.value,
                }));
              }}
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
              className="px-4 py-2 bg-[#0E538C] text-white rounded-md hover:bg-[#1c2d5a] cursor-pointer"
              onClickCapture={()=>{
                onSubmit(formValues);
                router.push('/select-query')
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

export default AddTaskModal; 