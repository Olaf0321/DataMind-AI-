"use client";

import Layout from "../../components/Layout";
import Image from "next/image";
import TaskEndModal from "../../components/TaskEndModal";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import LoadingSpinner from '../../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [selectedFormat, setSelectedFormat] = useState('');
  const [notification, setNotification] = useState('');
  const [output, setOutput] = useState('選択しない');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    const selectedDataInfo = localStorage.getItem('selectedData');
    const data = JSON.parse(selectedDataInfo || '[]');
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
          data: data,
          prompt: inputValue,
          output: output,
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
      if (inputValue.trim() === '') {
        alert('プロンプトを入力してください。');
        return;
      }
      if (output.trim() === '選択しない') {
        alert('出力形式を選択してください。');
        return;
      }
      console.log('output', output);
      sendArtifactPromptToAIAndExecute();
      setInputValue(''); // 送信後にクリア
    }
  };

  const handleFormatChange = (e: any) => {
    const value = e.target.value;
    const labelMap = {
      1: 'HTML',
      2: 'SVG',
      3: '画像',
      4: 'CSV',
      5: 'JSON',
      6: 'PlantUML',
    };

    setSelectedFormat(value);
    setNotification(`出力形式が${labelMap[value as keyof typeof labelMap]}に設定されました。`);

    // Auto-hide after 3 seconds
    setTimeout(() => setNotification(''), 3000);
    console.log('labelMap', labelMap[value as keyof typeof labelMap]);
    setOutput(labelMap[value as keyof typeof labelMap]);
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

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      const maxHeight = 100; // px (adjust as needed)
      if (textarea.scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.overflowY = 'hidden';
      }
    }
  }, [inputValue]);

  return (
    <Layout title="成果物壁打ち画面">
      {isLoading && <LoadingSpinner />}
      {notification && (
        <AnimatePresence>
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: '-20px', opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-55 right-4 bg-[#ff8b49] shadow-xl rounded-4xl px-4 py-4 z-50 text-white"
          >
            <span className="text-lg flex items-center">
              <Image src="/images/logo(3).png" alt="check" width={30} height={30} className="mr-2" />
              {notification}
            </span>
          </motion.div>
        </AnimatePresence>
      )}
      <div className="relative w-full h-[calc(100vh-300px)] pt-10 flex flex-col items-center">
        <div className="w-full p-4 rounded-4xl bg-[#F1F1F1] flex justify-between">
          <div className="flex">
            <span className="mr-10">タスク名</span>
            <span className="text-[#0E538C]">{task !== null && task['taskName']}</span>
          </div>
          <div className="relative flex items-center" ref={dropdownRef}>
            <span className="mr-2 p-1 bg-[#ff8b49] rounded-lg text-sm text-white">{output}</span>
            <span className="mr-2">出力形式</span>
            <button
              className="p-1 rounded-full hover:bg-gray-100 focus:outline-none cursor-pointer"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              <Image src="/images/setting.png" alt="more" width={20} height={20} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <select
                  className="w-full bg-white text-[#4C4C4C] px-3 py-2 cursor-pointer
                         focus:outline-none border-none"
                  value={selectedFormat}
                  onChange={handleFormatChange}
                >
                  <option value="1" className="bg-[#F1F1F1]">HTML</option>
                  <option value="2">SVG</option>
                  <option value="3" className="bg-[#F1F1F1]">画像</option>
                  <option value="4">CSV</option>
                  <option value="5" className="bg-[#F1F1F1]">JSON</option>
                  <option value="6">PlantUML</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="w-2/3 dialogue-container flex flex-col-reverse gap-7 text-[#5E5E5E] my-4 h-[68%] overflow-y-auto">
          {/* Display existing prompts */}
          {artifactPrompts !== undefined && artifactPrompts.map((prompt: ArtifactPrompt) => (
            <React.Fragment key={prompt["id"]}>
              {/* GPT Message */}
              {/* <div className="gpt-container relative self-start bg-[#F1F1F1] rounded-xl px-4 py-2 min-w-[70%] max-w-[70%] w-fit break-words">
                {prompt['出力形式'] === 'CSV' && (
                  <div className="text-container mb-6 whitespace-pre-wrap break-words">
                    <span>CSVファイルが生成されました。</span>
                    <a href={prompt["結果リンク"]} download={true}>
                      <span className="underline">ダウンロード</span>
                    </a>
                  </div>
                )}
                {prompt['出力形式'] === 'JSON' && (
                  <div className="text-container mb-6 whitespace-pre-wrap break-words">
                    <span>{prompt["AI応答"]}</span>
                  </div>
                )}
                <div className="button-container absolute bottom-2 right-3 flex gap-2">
                  <button className="cursor-pointer">
                    <Image src="/images/more.png" alt="more" width={20} height={15} />
                  </button>
                </div>
              </div> */}
              <div className="flex">
                <img src="/images/1.png" alt="DataMind-AI" className="h-[50px] w-[50px] mr-3" />
                <div className="gpt-container relative self-start bg-[#F1F1F1] rounded-4xl p-4 max-w-[70%] w-fit break-words">
                  {prompt['出力形式'] === 'CSV' && (
                    <div className="text-container whitespace-pre-wrap break-words">
                      <span>CSVファイルが生成されました。</span>
                      <a href={prompt["結果リンク"]} download={true}>
                        <span className="underline">ダウンロード</span>
                      </a>
                    </div>
                  )}
                  {prompt['出力形式'] === 'SVG' && (
                    <div className="text-container whitespace-pre-wrap break-words">
                      <span>SVGファイルが生成されました。</span>
                      <a href={prompt["結果リンク"]} target="_blank" rel="noopener noreferrer">
                        <span className="underline">ファイルを見る</span>
                      </a>
                    </div>
                  )}
                  {prompt['出力形式'] === 'JSON' && (
                    <div className="text-container whitespace-pre-wrap break-words">
                      <span>{prompt["AI応答"]}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* User Message */}
              <div className="user-container relative self-end bg-[#dbe7fb] rounded-4xl p-4 max-w-[50%] w-fit break-words whitespace-pre-wrap">
                {prompt["プロンプト"]}
              </div>
            </React.Fragment>
          ))}

          {/* GPT Message */}
          <div className="flex">
            <img src="/images/1.png" alt="DataMind-AI" className="h-[50px] w-[50px] mr-3" />
            <div className="gpt-container relative self-start bg-[#F1F1F1] rounded-4xl p-4 max-w-[70%]">
              <div className="text-container">
                <span>成果物を生成するためのプロンプトを入力してください。</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 w-2/3">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="成果物生成プロンプト入力..."
            rows={1}
            className="w-full resize-none overflow-hidden rounded-4xl border border-gray-300 bg-white px-4 py-3 text-bae text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-0"
            style={{ maxHeight: '100px', overflowY: 'hidden' }}
            onKeyDown={handleKeyDown}
          />
        </div>
        {/* <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[70%] h-[22%] p-2 rounded-xl bg-[#F1F1F1]">
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
              placeholder="成果物生成プロンプト入力"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div> */}

        <div className="absolute bottom-0 right-8 px-4 py-2 rounded-md bg-[#989898] text-white">
          <button className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
            確 定
          </button>
        </div>
        <TaskEndModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div >
    </Layout >
  );
}