import Layout from "../../components/Layout";
import Image from "next/image";

export default function ArtifactListPage() {
  return (
    <Layout title="成果物一覧画面">
      <div className="table-auto">
        <div className="flex flex-col h-[calc(100vh-300px)]">
          <div className="flex-grow overflow-y-auto">
            <table className="w-full border-collapse text-center">
              <thead className="bg-[#E5E5E5] text-[#4C4C4C] mb-2">
                <tr>
                  <th className="px-4 py-4 rounded-l-md font-normal">ID</th>
                  <th className="px-4 py-3 font-normal">タスク名</th>
                  <th className="px-4 py-3 font-normal">タスクid</th>
                  <th className="px-4 py-3 font-normal">成果物へのパス</th>
                  <th className="px-4 py-3 font-normal">生成日</th>
                  <th className="px-4 py-3 rounded-r-md font-normal">生成者(ユーザーid)</th>
                </tr>
              </thead>
              <tbody className="text-sm mt-2 text-[#0E538C]">
                <tr>
                  <td colSpan={8} className="h-3"></td>
                </tr>
                {[...Array(10)].map((_, i) => (
                  <tr key={i} className={i % 2 === 1 ? 'bg-[#E9E9E9]' : 'bg-[#F5F5F5]'}>
                    <td className={`px-4 py-6 ${i === 0 ? 'rounded-tl-md' : ''} ${i === 9 ? 'rounded-bl-md' : ''}`}>{i + 1}</td>
                    <td className="px-4 py-3">売上集計</td>
                    <td className="px-4 py-3">001</td>
                    <td className="px-4 py-3 flex justify-center">
                      <span className="mt-3">成果物へのパス</span>
                      <a href="https://www.google.com" className="underline" target="_blank" rel="noopener noreferrer">
                        <Image src="/images/go_link.png" alt="link" width={15} height={15} />
                      </a>
                    </td>
                    <td className="px-4 py-3">2025-05-10</td>
                    <td className={`px-4 py-3 space-x-2 whitespace-nowrap ${i === 0 ? 'rounded-tr-md' : ''} ${i === 9 ? 'rounded-br-md' : ''}`}>
                      user123
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}