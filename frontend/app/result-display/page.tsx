'use client'
import Layout from "../../components/Layout";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ResultDisplayPage() {
  const router = useRouter();
  return (
    <Layout title="抽出結果表示画面">
      <div className="table-auto">
        <div className="flex flex-col h-[calc(100vh-300px)]">
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
              <Image src="/images/arrow-return.png" alt="back" width={15} height={15} />
              <span>戻 る</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}