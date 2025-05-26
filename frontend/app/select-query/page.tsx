"use client";

import Layout from "../../components/Layout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import React from "react";

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

  const addSelectPrompt = async () => {
    if (!task) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/selectPrompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          taskId: 1,
          userId: 2,
          prompt: inputValue,
          dataNumber: 12
        }),
      });
      getSelectPrompt();
      // const resdata = await response.json();
      // if (resdata.success) {
      //   setInputValue(''); // 送信後にクリア
      //   getSelectPrompt(); // 最新のプロンプトを取得
      // } else {
      //   alert('プロンプトの実行に失敗しました。');
      // }
    } catch (error) {
      console.error('Error adding select prompt:', error);
      alert('プロンプトの実行に失敗しました。');
    }
  }

  const sendSelectPromptToAIAndExecute = async () => {
    if (!task) return;
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
      // const resdata = await response.json();
      // if (resdata.success) {
      //   console.log('AIからの応答:', resdata.response);
      // } else {
      //   alert('AIへのプロンプト送信に失敗しました。');
      // }
    } catch (error) {
      console.error('Error sending select prompt to AI:', error);
      alert('AIへのプロンプト送信に失敗しました。');
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
    } else {
      if (taskInfo === null) {
        // If no task info is found, redirect to task list
        router.push('/task-list');
      } else {
        setTask(JSON.parse(taskInfo || '{}'));
      }
    }
    if (userInfo !== null) {
      setUser(JSON.parse(userInfo || '{}'));
    }
  }, [router]);
  
  useEffect(() => {
    getSelectPrompt();
  }, [task]);


  return (
    <Layout title="SELECT文壁打ち画面">
      <div className="relative w-full h-[calc(100vh-300px)] p-10">
        <div className="w-full px-4 py-2 rounded-md bg-[#F1F1F1]">
          <span className="mr-10">タスク名</span>
          <span className="text-[#0E538C]">{task !== null && task['taskName']}</span>
        </div>

        <div className="dialogue-container flex flex-col-reverse gap-4 text-[#5E5E5E] my-4 h-[68%] overflow-y-auto">
          {/* Display existing prompts */}
          {selectPrompts !== undefined && selectPrompts.map((prompt: SelectPrompt) => (
            <React.Fragment key={prompt["id"]}>
              {/* GPT Message */}
              <div className="gpt-container relative self-start bg-[#F1F1F1] rounded-xl px-4 py-2 w-[50%] min-h-[100px]">
                <div className="text-container mb-6">
                  <span>「顧客名・売上金額・購入日」を含むデータを {prompt["抽出データ数"]} 件抽出しました。</span>
                </div>
                <div className="button-container absolute bottom-2 right-3 flex gap-2">
                  <button className="cursor-pointer" onClick={() => router.push("/result-display")}>
                    <Image src="/images/link.png" alt="link" width={20} height={15} />
                  </button>
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
            <span>何を抽出したいですか？</span>
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
        {/* <div className="p-2">
            <textarea
              className="bg-[#F1F1F1] border-none w-full p-2 max-h-[90px] border border-gray-300 rounded-md focus:outline-none focus:ring-0"
              rows={3}
              placeholder="SELECT文生成プロンプト入力"
            />
          </div> */}
        <div className="p-2">
          <textarea
            className="bg-[#F1F1F1] border-none w-full p-2 max-h-[90px] border border-gray-300 rounded-md focus:outline-none focus:ring-0"
            rows={3}
            placeholder="SELECT文生成プロンプト入力"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
    </Layout >
  );
}