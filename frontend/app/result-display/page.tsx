'use client'
import Layout from "../../components/Layout";
import { useRouter } from 'next/navigation';

export default function ResultDisplayPage() {
  const router = useRouter();
  return (
    <Layout title="抽出結果表示画面">
      <div className="flex justify-end items-center mb-8">
        <div className="search-task-button filter-task-button flex items-center">
          <div className="filter-task-button-label flex">
            <label className="bg-[#ED601E] text-white px-4 py-2 border-[1px] border-[#ED601E] rounded-l-md">
              検索方式
            </label>
            <select
              className="bg-white border-[#ED601E] border-[1px] text-[#4C4C4C] px-3 py-2 rounded-r-md cursor-pointer 
               focus:outline-none focus:border-[#ED601E] focus:rounded-r-md"
            >
              <option value="1">全体</option>
              <option value="2">ID</option>
              <option value="3">顧客名</option>
              <option value="4">売上金額</option>
              <option value="5">購入日</option>
              <option value="6">商品名</option>
              <option value="7">支払い方法</option>
              <option value="8">住所</option>
              <option value="9">電話番号</option>
            </select>
          </div>
          <div className="search-task-input flex ml-4">
            <input
              type="text"
              className="w-32 bg-white border-[#ED601E] border-[1px] text-[#4C4C4C] px-3 py-2 rounded-l-md 
               focus:outline-none focus:border-[#ED601E] focus:rounded-l-md"
            />
            <label className="bg-[#ED601E] text-white px-4 py-2 border-[1px] border-[#ED601E] rounded-r-md flex justify-between items-center w-18">
              <span>検</span>
              <span>索</span>
            </label>
          </div>
        </div>
      </div>
      <div className="table-auto">
        <div className="flex flex-col h-[calc(100vh-350px)]">
          <div className="flex-grow overflow-y-auto">
            <table className="w-full border-collapse text-center">
              <thead className="bg-[#E5E5E5] text-[#4C4C4C] mb-2">
                <tr>
                  <th className="px-4 py-4 rounded-l-md font-normal">ID</th>
                  <th className="px-4 py-3 font-normal">顧客名</th>
                  <th className="px-4 py-3 font-normal">売上金額</th>
                  <th className="px-4 py-3 font-normal">購入日</th>
                  <th className="px-4 py-3 font-normal">商品名</th>
                  <th className="px-4 py-3 font-normal">支払い方法</th>
                  <th className="px-4 py-3 font-normal">住所</th>
                  <th className="px-4 py-3 rounded-r-md font-normal">電話番号</th>
                </tr>
              </thead>
              <tbody className="text-sm mt-2 text-[#0E538C]">
                <tr>
                  <td colSpan={8} className="h-3"></td>
                </tr>
                {[...Array(10)].map((_, i) => (
                  <tr key={i} className={i % 2 === 1 ? 'bg-[#E9E9E9]' : 'bg-[#F5F5F5]'}>
                    <td className={`px-4 py-6 ${i === 0 ? 'rounded-tl-md' : ''} ${i === 9 ? 'rounded-bl-md' : ''}`}>{i + 1}</td>
                    <td className="px-4 py-3">山田太郎</td>
                    <td className="px-4 py-3">15,000円</td>
                    <td className="px-4 py-3">2025-05-01</td>
                    <td className="px-4 py-3">電気ケトル</td>
                    <td className="px-4 py-3 whitespace-nowrap">クレジット</td>
                    <td className="px-4 py-3">
                      東京都渋谷区渋谷1-1-1
                    </td>
                    <td className={`px-4 py-3 space-x-2 whitespace-nowrap ${i === 0 ? 'rounded-tr-md' : ''} ${i === 9 ? 'rounded-br-md' : ''}`}>
                      03-1234-5678
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end items-center mt-auto pt-4 space-x-2">
            <button className="bg-[#0E538C] text-white rounded-md px-4 py-2 mr-4 cursor-pointer flex items-center" onClick={() => router.push('/select-query')}>
              再実行
            </button>
            <button className="bg-[#FB5B01] text-white rounded-md px-4 py-2 mr-4 cursor-pointer flex items-center" onClick={() => router.push('/artifact-management')}>
              成果物生成
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}