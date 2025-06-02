"use client";

import Layout from "../../components/Layout";
import Image from "next/image";
import TaskEndModal from "../../components/TaskEndModal";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import LoadingSpinner from '../../components/LoadingSpinner';

interface TaskModel {
  id: number;
  taskName: string;
  taskDescription: string;
}

interface ArtifactPrompt {
  "id": number,
  "タスク名": string,
  "ユーザー": string,
  "プロンプト": string,
  "抽出データ数": number
  "作成日": string,
}

export default function ArtifactManagementPage() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [task, setTask] = useState<TaskModel | null>(null);
  const [artifactPrompts, setArtifactPrompts] = useState<ArtifactPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const getArtifactPrompt = async () => {
    if (!task) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/artifactPrompt/${task['id']}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const resdata = await response.json();
      setArtifactPrompts(resdata.artifactPrompts);
    } catch (error) {
      console.error('Error getting artifactPrompt:', error);
      alert('成果プロンプトのインポートに失敗しました。');
    }
  }

  const sendArtifactPromptToAIAndExecute = async () => {
    if (!task) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/artifactPrompt/sendToAIAndexecute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          taskId: task['id'],
          prompt: inputValue,
        }),
      });
      const resdata = await response.json();
      console.log('AIからの応答:', resdata);
      getArtifactPrompt();
    } catch (error) {
      console.error('Error sending artifact prompt to AI:', error);
      alert('AIへのプロンプト送信に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 改行を防止
      if (inputValue.trim() !== '') {
        sendArtifactPromptToAIAndExecute();
        // addSelectPrompt();
        setInputValue(''); // 送信後にクリア
      } else {
        alert('プロンプトを入力してください');
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const taskInfo = localStorage.getItem('task') || null;
    const selectedData = localStorage.getItem('selectedData') || null;

    if (!token) {
      router.push('/login');
    } else {
      if (taskInfo === null || selectedData === null) {
        router.push('/task-list');
      } else {
        setTask(JSON.parse(taskInfo || '{}'));
      }
    }
  }, [router]);

  useEffect(() => {
    getArtifactPrompt();
  }, [task]);

  return (
    <Layout title="成果物壁打ち画面">
      {isLoading && <LoadingSpinner />}
      <div className="relative w-full h-[calc(100vh-300px)] p-10">
        <div className="w-full px-4 py-2 rounded-md bg-[#F1F1F1] flex justify-between">
          <div className="flex">
            <span className="mr-10">タスク名</span>
            <span className="text-[#0E538C]">{task !== null && task['taskName']}</span>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              className="p-1 rounded-full hover:bg-gray-100 focus:outline-none cursor-pointer"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              <Image src="/images/setting.png" alt="more" width={20} height={20} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-30 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="px-4 py-3 border-b">
                  出 力 形 式
                </div>
                <select
                  className="bg-white text-[#4C4C4C] px-3 py-2 rounded-r-md cursor-pointer border-none
               focus:outline-none focus:rounded-r-md focus: border-none"
                >
                  <option value="1" className="bg-[#F1F1F1] border-none">HTML</option>
                  <option value="2" className="border-none">SVG</option>
                  <option value="3" className="bg-[#F1F1F1] border-none">画像</option>
                  <option value="4" className="border-none">CSV</option>
                  <option value="5" className="bg-[#F1F1F1] border-none">JSON</option>
                  <option value="6" className="border-none">PlantUML</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="dialogue-container flex flex-col-reverse gap-4 text-[#5E5E5E] my-4 h-[68%] overflow-y-auto">
          {/* Display existing prompts */}
          {artifactPrompts !== undefined && artifactPrompts.map((prompt: ArtifactPrompt) => (
            <React.Fragment key={prompt["id"]}>
              {/* GPT Message */}
              <div className="gpt-container relative self-start bg-[#F1F1F1] rounded-xl px-4 py-2 w-[50%] min-h-[100px]">
                <div className="text-container mb-6">
                  <span>{prompt["AI回答"]}</span>
                </div>
                <div className="button-container absolute bottom-2 right-3 flex gap-2">
                  <button className="cursor-pointer">
                    <Image src="/images/more.png" alt="more" width={20} height={15} />
                  </button>
                </div>
              </div>

              {/* User Message */}
              <div className="user-container relative self-end bg-[#F1F1F1] rounded-xl px-4 py-2 w-[30%] min-h-[70px]">
                {prompt["プロンプト"]}
              </div>
            </React.Fragment>
          ))}

          {/* GPT Message */}
          <div className="gpt-container relative self-start bg-[#F1F1F1] rounded-xl px-4 py-2 w-[50%] min-h-[100px]">
            <div className="text-container mb-4">
              <span>成果物を生成するためのプロンプトを入力してください</span>
            </div>
            <div className="button-container absolute bottom-0 right-3">
              <button className="cursor-pointer">
                <Image src="/images/more.png" alt="more" width={20} height={15} />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[70%] h-[22%] p-2 rounded-xl bg-[#F1F1F1]">
          <div className="flex justify-between">
            <button className="cursor-pointer">
              <Image src="/images/add.png" alt="add" width={15} height={15} />
            </button>
            <button className="cursor-pointer">
              <Image src="/images/more.png" alt="more" width={20} height={15} />
            </button>
          </div>
          <div className="p-2">
            <textarea
              className="bg-[#F1F1F1] border-none w-full p-2 max-h-[90px] border border-gray-300 rounded-md focus:outline-none focus:ring-0"
              rows={3}
              placeholder="成果物文生成プロンプト入力"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <div className="absolute bottom-0 right-8 px-4 py-2 rounded-md bg-[#989898] text-white">
          <button className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
            確 定
          </button>
        </div>
        <TaskEndModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </Layout>
  );
}