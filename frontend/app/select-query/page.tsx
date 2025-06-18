"use client";

import Layout from "../../components/Layout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useState } from "react";
import React from "react";
import LoadingSpinner from "../../components/LoadingSpinner";

interface TaskModel {
  id: number;
  taskName: string;
  taskDescription: string;
}

interface UserModel {
  id: number;
  アバター: string;
  メールアドレス: string;
  名前: string;
  権限: string;
}

interface SelectPrompt {
  "id": number,
  "タスク名": string,
  "ユーザー": string,
  "プロンプト": string,
  "抽出データ数": number
  "作成日": string,
}

export default function SelectQueryPage() {
  const router = useRouter();
  const [task, setTask] = useState<TaskModel | null>(null);
  const [selectPrompts, setSelectPrompts] = useState<SelectPrompt[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [user, setUser] = useState<UserModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getSelectPrompt = async () => {
    if (!task) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/selectPrompt/${task['id']}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const resdata = await response.json();
      setSelectPrompts(resdata.selectPrompts);
    } catch (error) {
      console.error('Error getting selectPrompt:', error);
      alert('select文プロンプトのインポートに失敗しました。');
    }
  }

  const sendSelectPromptToAIAndExecute = async () => {
    if (!task) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/selectPrompt/sendToAIAndexecute`, {
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
      localStorage.setItem('selectedData', JSON.stringify(resdata.response));
      getSelectPrompt();
    } catch (error) {
      console.error('Error sending select prompt to AI:', error);
      alert('AIへのプロンプト送信に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 改行を防止
      if (inputValue.trim() !== '') {
        sendSelectPromptToAIAndExecute();
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
    const userInfo = localStorage.getItem('user') || null;

    if (!token) {
      router.push('/login');
    }
    if (taskInfo === null) {
      router.push('/task-list');
    } else {
      setTask(JSON.parse(taskInfo || '{}'));
    }
    if (userInfo !== null) {
      setUser(JSON.parse(userInfo || '{}'));
    }
  }, [router]);

  useEffect(() => {
    getSelectPrompt();
  }, [task]);

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
    <Layout title="SELECT文壁打ち画面">
      {isLoading && <LoadingSpinner />}
      <div className="relative w-full h-[calc(100vh-300px)] pt-10 flex flex-col items-center">
        <div className="w-full p-4 rounded-4xl bg-[#F1F1F1]">
          <span className="mr-10">タスク名</span>
          <span className="text-[#0E538C]">{task !== null && task['taskName']}</span>
        </div>

        <div className="w-2/3 dialogue-container flex flex-col-reverse gap-7 text-[#5E5E5E] my-4 h-[68%] overflow-y-auto">
          {/* Display existing prompts */}
          {selectPrompts !== undefined && selectPrompts.map((prompt: SelectPrompt) => (
            <React.Fragment key={prompt["id"]}>
              {/* GPT Message */}
              <div className="flex">
                <img src="/images/1.png" alt="DataMind-AI" className="h-[50px] w-[50px] mr-3" />
                <div className="gpt-container relative self-start bg-[#F1F1F1] rounded-4xl p-4 max-w-[70%] w-fit break-words">
                  <div className="text-container whitespace-pre-wrap break-words">
                    <span>{prompt["抽出データ数"]} 件抽出しました。</span>
                    <button className="cursor-pointer" onClick={() => router.push("/result-display")}>
                      <Image src="/images/link.png" alt="link" width={20} height={15} />
                    </button>
                  </div>
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
                <span>何を抽出したいですか？</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 w-2/3">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="SELECT文生成プロンプト入力..."
            rows={1}
            className="w-full resize-none overflow-hidden rounded-4xl border border-gray-300 bg-white px-4 py-3 text-bae text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-0"
            style={{ maxHeight: '100px', overflowY: 'hidden' }}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </Layout >
  );
}