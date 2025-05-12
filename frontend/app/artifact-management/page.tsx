"use client";

import Layout from "../../components/Layout";
import Image from "next/image";
import TaskEndModal from "../../components/TaskEndModal";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ArtifactManagementPage() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <Layout title="成果物壁打ち画面">
      <div className="relative w-full h-[calc(100vh-300px)] p-10">
        <div className="w-full px-4 py-2 rounded-md bg-[#F1F1F1] flex justify-between">
          <div className="flex">
            <span className="mr-10">タスク名</span>
            <span className="text-[#0E538C]">月次売上抽出</span>
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
          {/* GPT Message */}
          <div className="gpt-container relative self-start bg-[#F1F1F1] rounded-xl px-4 py-2 w-[50%] min-h-[100px]">
            <div className="text-container mb-6">
              <span>
                グラフを更新しました。<br />青系カラーに変更し、商品名を横軸に表示しました。<br />
                <a href="https://www.google.com" className="underline text-black" target="_blank" rel="noopener noreferrer">更新後のグラフプレビューを表示</a>
              </span>
            </div>
            <div className="button-container absolute bottom-2 right-3 flex gap-2">
              <button className="cursor-pointer">
                <Image src="/images/more.png" alt="more" width={20} height={15} />
              </button>
            </div>

          </div>

          {/* User Message */}
          <div className="user-container self-end bg-[#F1F1F1] rounded-xl px-4 py-2 w-[30%] min-h-[70px]">
            <span>グラフの色を青系に変更し、商品名を横軸に表示してください。</span>
          </div>
          {/* GPT Message */}
          <div className="gpt-container relative self-start bg-[#F1F1F1] rounded-xl px-4 py-2 w-[50%] min-h-[100px]">
            <div className="text-container mb-6">
              <span>
                売上データを確認しました。商品の売上ランキングを棒グラフで作成しました。<br />
                <a href="https://www.google.com" className="underline text-black" target="_blank" rel="noopener noreferrer">グラフプレビューを表示</a>
              </span>
            </div>
            <div className="button-container absolute bottom-2 right-3 flex gap-2">
              <button className="cursor-pointer">
                <Image src="/images/more.png" alt="more" width={20} height={15} />
              </button>
            </div>

          </div>

          {/* User Message */}
          <div className="user-container self-end bg-[#F1F1F1] rounded-xl px-4 py-2 w-[30%] min-h-[70px]">
            <span>月次売上データをもとに、売上が最も多かった商品のランキングをグラフで表示してください。</span>
          </div>

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