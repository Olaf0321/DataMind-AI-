import React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';


interface FormValues {
  selectInfo: string;
  artifactInfo: string;
  output: string;
}

interface CopyUpdateModalProps {
  isOpen: boolean;
  taskId: number;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
}

const CopyUpdateModal: React.FC<CopyUpdateModalProps> = ({ isOpen, taskId, onSubmit, onClose }) => {
  const [outputList, setOutputList] = useState(['HTML', 'SVG', 'CSV', 'JSON']);
  const [selectInfo, setSelectInfo] = useState('');
  const [artifactInfo, setArtifactInfo] = useState('');
  const [selectedOutput, setSelectedOutput] = useState('');

  const getSelectInfo = async (taskId: number) => {
    if (taskId !== -1) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/task/${taskId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setSelectInfo(data['最終的に採用されたSelect文']);
      } catch (error) {
        console.error('Error fetching task list:', error);
      }
    }
  }

  const getArtifactInfo = async (taskId: number) => {
    if (taskId !== -1) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/artifactPrompt/${taskId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setArtifactInfo(data['artifactPrompts'][0]['プロンプト']);
      } catch (error) {
        console.error('Error fetching task list:', error);
      }
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      'selectInfo': selectInfo,
      'artifactInfo': artifactInfo,
      'output': outputList[Number(selectedOutput)-1]
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      getSelectInfo(taskId);
      getArtifactInfo(taskId);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal content */}
      <div className="relative bg-[#F5F5F5] rounded-lg p-8 w-[450px] max-h-[80vh] overflow-y-auto">
        <button className="cursor-pointer absolute top-4 right-4" onClick={onClose}>
          <Image src="/images/close.png" alt="close" width={20} height={20} />
        </button>
        <div className="flex justify-center items-center mb-5">
          <h2 className="text-[20px] text-black">SELECT文、プロンプトの修正</h2>
        </div>

        <form className="space-y-4 text-[15px]" onSubmit={handleSubmit}>
          <div>
            <label>
              <span>SELECT文</span>
            </label>
            <div className='mt-1'>
              <textarea
                className={`w-full bg-white border-none p-3 rounded-md focus:outline-none focus:ring-0 min-h-[120px]`}
                required={true}
                value={selectInfo}
                onChange={(e) => setSelectInfo(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label>
              <span>成果物生成プロンプト</span>
            </label>
            <div className='mt-1'>
              <textarea
                className={`w-full bg-white border-none p-3 rounded-md focus:outline-none focus:ring-0 min-h-[60px]`}
                required={true}
                value={artifactInfo}
                onChange={(e) => setArtifactInfo(e.target.value)}
              />
            </div>
          </div>

          <div className="flex relative">
            <label className="text-[#898989] flex justify-center w-[45%] bg-white border-none p-3 rounded-l-md focus:outline-none focus:ring-0 relative">
              <span>出力形式</span>
            </label>
            <select
              className="w-[60%] bg-white border-none p-2 rounded-md cursor-pointer focus:outline-none focus:ring-0 text-[12px]"
              required={true}
              onChange={(e) => setSelectedOutput(e.target.value)}
            >
              <option value=''>
                出力形式を選択してください。
              </option>
              {outputList.map((output, index) => (
                <option key={index} value={index + 1}>
                  {output}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2 bg-[#ED601E] rounded-md text-white hover:bg-[#d6541b] cursor-pointer"
            >
              キャンセル
            </button>

            <button
              type="submit"
              className="px-8 py-2 bg-[#0E538C] text-white rounded-md hover:bg-[#1c2d5a] cursor-pointer"
            >
              実   行
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CopyUpdateModal;