"use client";

import Layout from "../../components/Layout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";

interface TaskModel {
  id: number;
  タスク名: string;
  タスクの説明: string;
}

interface SelectPrompt {
  id: number;
  taskId: number;
  prompt: string;
}

export default function SelectQueryPage() {
  const router = useRouter();
  const [task, setTask] = useState<TaskModel | null>(null);
  const [selectPrompt, setSelectPrompt] = useState<SelectPrompt | null>(null);

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
      if (resdata.status === "タスクが正常に削除されました") {
        
      } else {
        alert('タスクの削除に失敗しました');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('タスクの削除に失敗しました');
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    const taskInfo = localStorage.getItem('task') || null;

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
  }, [router]);

  useEffect(() => {
    if (task) {
      getSelectPrompt();
    }
  }, [task]);


  return (
    <Layout title="SELECT文壁打ち画面">
      <div className="relative w-full h-[calc(100vh-300px)] p-10">
        <div className="w-full px-4 py-2 rounded-md bg-[#F1F1F1]">
          <span className="mr-10">タスク名</span>
          <span className="text-[#0E538C]">月次売上抽出</span>
        </div>

        <div className="dialogue-container flex flex-col-reverse gap-4 text-[#5E5E5E] my-4 h-[68%] overflow-y-auto">
          {/* GPT Message */}
          <div className="gpt-container relative self-start bg-[#F1F1F1] rounded-xl px-4 py-2 w-[50%] min-h-[100px]">
            <div className="text-container mb-6">
              <span>「顧客名・売上金額・購入日」を含むデータを 36 件抽出しました。</span>
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
          <div className="user-container self-end bg-[#F1F1F1] rounded-xl px-4 py-2 w-[30%] min-h-[70px]">
            <span>昨年12月の全ての売上データをください</span>
          </div>

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
          <div className="p-2">
            <textarea
              className="bg-[#F1F1F1] border-none w-full p-2 max-h-[90px] border border-gray-300 rounded-md focus:outline-none focus:ring-0"
              rows={3}
              placeholder="SELECT文生成プロンプト入力"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}