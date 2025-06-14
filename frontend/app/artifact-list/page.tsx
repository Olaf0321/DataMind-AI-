'use client'
import Layout from "../../components/Layout";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Artifact {
  "id": number,
  "タスク名": string,
  "ユーザー": string,
  "プロンプト": string,
  "AI応答": string,
  "結果リンク": string,
  "出力形式": string,
  "作成日": string
}

export default function ArtifactListPage() {
  const router = useRouter();
  const [artifactList, setArtifactList] = useState([]);

  const getArtifactList = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/artifactPrompt/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      data.artifactPrompts.sort((a:Artifact, b:Artifact) => new Date(b["作成日"]).getTime() - new Date(a["作成日"]).getTime());
      setArtifactList(data.artifactPrompts);
    } catch (error) {
      console.error('Error fetching artifact list:', error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      router.push('/login');
    } else {
      getArtifactList();
    }
  }, [router]);

  return (
    <Layout title="成果物一覧画面">
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
              <option value="1" className="bg-[#F1F1F1]">全体</option>
              <option value="2">ID</option>
              <option value="3" className="bg-[#F1F1F1]">タスク名</option>
              <option value="4">タスクid</option>
              <option value="5" className="bg-[#F1F1F1]">生成日</option>
              <option value="6">生成者</option>
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
          <div className="flex-grow overflow-hidden">
            <table className="w-full border-collapse text-center">
              <thead className="bg-[#E5E5E5] text-[#4C4C4C] mb-2">
                <tr>
                  <th className="px-4 py-4 rounded-l-md font-normal">ID</th>
                  <th className="px-4 py-3 font-normal">タスク名</th>
                  <th className="px-4 py-3 font-normal">出力形式</th>
                  <th className="px-4 py-3 font-normal">成果物</th>
                  <th className="px-4 py-3 font-normal">生成日</th>
                  <th className="px-4 py-3 rounded-r-md font-normal">生成者</th>
                </tr>
              </thead>
              <tbody className="text-sm mt-2 text-[#0E538C]">
                <tr>
                  <td colSpan={8} className="h-3"></td>
                </tr>
                {
                  artifactList === undefined || artifactList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-[#737576]">
                        成果物がありません
                      </td>
                    </tr>
                  ) : null
                }
                {artifactList !== undefined && artifactList.length > 0 && artifactList.map((artifact, index) => (
                  <tr key={index} className={index % 2 === 1 ? 'bg-[#E9E9E9]' : 'bg-[#F5F5F5]'}>
                    <td className={`px-4 py-6 ${index === 0 ? 'rounded-tl-md' : ''} ${index === artifactList.length - 1 ? 'rounded-bl-md' : ''}`}>{index+1}</td>
                    <td className="px-4 py-3">{artifact["タスク名"]}</td>
                    <td className="px-4 py-3">{artifact["出力形式"]}</td>
                    <td className="px-4 py-3 flex justify-center">
                      {artifact['出力形式'] === 'CSV' && (
                      <div className="text-container whitespace-pre-wrap break-words">
                        <a href={artifact["結果リンク"]} download={true}>
                          <span className="underline">CSVファイルダウンロード</span>
                        </a>
                      </div>
                      )}
                      {artifact['出力形式'] === 'SVG' && (
                        <div className="text-container whitespace-pre-wrap break-words">
                          <a href={artifact["結果リンク"]} target="_blank" rel="noopener noreferrer">
                            <span className="underline">SVGファイルを見る</span>
                          </a>
                        </div>
                      )}
                      {artifact['出力形式'] === 'HTML' && (
                        <div className="text-container whitespace-pre-wrap break-words">
                          <a href={artifact["結果リンク"]} target="_blank" rel="noopener noreferrer">
                            <span className="underline">HTMLファイルを見る</span>
                          </a>
                        </div>
                      )}
                      {artifact['出力形式'] === 'JSON' && (
                        <div className="text-container whitespace-pre-wrap break-words">
                          <span>{artifact["AI応答"]}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(artifact["作成日"]).toLocaleDateString()}
                    </td>
                    <td className={`px-4 py-3 space-x-2 whitespace-nowrap ${index === 0 ? 'rounded-tr-md' : ''} ${index === artifactList.length - 1 ? 'rounded-br-md' : ''}`}>
                      {artifact["ユーザー"]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end items-center mt-auto pt-4 space-x-2">
            <span className="text-[#737576] mr-4">前へ</span>
            <button className="px-2 py-1 mr-4">
              <Image src="/images/arrow-left.png" alt="arrow-left" width={10} height={10} className="cursor-pointer" />
            </button>
            <span className="text-[#737576] mr-4">
              <span className="text-[#737576] w-4 bg-[#F5F5F5]">1</span>
              <span className="text-[#737576] w-2">/</span>
              <span className="text-[#737576] w-4">1</span>
            </span>
            <button className="px-2 py-1 mr-4">
              <Image src="/images/arrow-right.png" alt="arrow-right" width={10} height={10} className="cursor-pointer" />
            </button>
            <span className="text-[#737576]">次へ</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}