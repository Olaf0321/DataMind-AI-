'use client'
import Layout from "../../components/Layout";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
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
  const [realArtifactList, setRealArtifactList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7); // default fallback
  const [selectedSearchMethodValue, setSelectedSearchMethodValue] = useState('1');
  const [inputSearchValue, setInputSearchValue] = useState('');
  const [selectedSearchValue, setSelectedSearchValue] = useState('0');
  const [taskList, setTaskList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [searchMethondList, setSearchMethodList] = useState(['全体', 'ID', 'タスク名', '出力形式', '生成日', '生成者']);
  const [outputList, setOutputList] = useState(['HTML', 'SVG', 'CSV', 'JSON']);

  const totalPages = useMemo(() => {
    return Math.ceil(artifactList.length / pageSize);
  }, [artifactList, pageSize]);

  const paginatedArtifacts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return artifactList.slice(startIndex, startIndex + pageSize);
  }, [artifactList, currentPage, pageSize]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const getArtifactList = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/artifactPrompt/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      data.artifactPrompts.sort((a: Artifact, b: Artifact) => new Date(b["作成日"]).getTime() - new Date(a["作成日"]).getTime());
      setRealArtifactList(data.artifactPrompts);
      setArtifactList(data.artifactPrompts);
    } catch (error) {
      console.error('Error fetching artifact list:', error);
    }
  }

  const getTaskList = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/task/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setTaskList(data.tasks);
    } catch (error) {
      console.error('Error fetching artifact list:', error);
    }
  }

  const getUserList = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setUserList(data.users);
    } catch (error) {
      console.error('Error fetching artifact list:', error);
    }
  }

  const containsCheck = (obj: Artifact, search: string): boolean => {
    let str = '';
    Object.entries(obj).map(([key, value]) => {
      console.log('key', key);
      console.log('value', value);
      if (key !== "プロンプト" && key !== "AI応答") {
        str += value;
      }
    });
    return str.includes(search);
  };

  const contains = (text: string, search: string): boolean => {
    const str = String(text);
    return str.includes(search);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    } else {
      getArtifactList();
      getTaskList();
      getUserList();
    }
  }, [router]);

  useEffect(() => {
    const calculatePageSize = () => {
      const vh = window.innerHeight;
      const availableHeight = vh - 350; // corresponds to calc(100vh - 350px)
      const estimatedRowHeight = 70;
      const rows = Math.floor(availableHeight / estimatedRowHeight) - 1;
      const newPageSize = rows > 0 ? rows : 1;

      // 必要なときだけ状態を更新（レンダリング抑制）
      setPageSize(prev => {
        if (prev !== newPageSize) return newPageSize;
        return prev;
      });
    };

    calculatePageSize(); // 初回
    window.addEventListener('resize', calculatePageSize);

    return () => {
      window.removeEventListener('resize', calculatePageSize);
    };
  }, []);

  useEffect(() => {
    setInputSearchValue('');
    setSelectedSearchValue('0');
    if (selectedSearchMethodValue === '1' || selectedSearchMethodValue === '2' || selectedSearchMethodValue === '5') {
      setArtifactList(realArtifactList);
    } else if (selectedSearchMethodValue === '3') {
      setArtifactList(realArtifactList.filter(artifact => artifact["タスク名"] === taskList[0]["タスク名"]));
    } else if (selectedSearchMethodValue === '4') {
      setArtifactList(realArtifactList.filter(artifact => artifact["出力形式"] === outputList[0]));
    } else if (selectedSearchMethodValue === '6') {
      setArtifactList(realArtifactList.filter(artifact => artifact["ユーザー"] === userList[0]["名前"]));
    }
  }, [selectedSearchMethodValue]);

  useEffect(() => {
    if (selectedSearchMethodValue === '1') {
      setArtifactList(realArtifactList.filter(artifact => containsCheck(artifact, inputSearchValue)));
    } else if (selectedSearchMethodValue === '2') {
      setArtifactList(realArtifactList.filter(artifact => contains(artifact['id'], inputSearchValue)));
    } else if (selectedSearchMethodValue === '5') {
      setArtifactList(realArtifactList.filter(artifact => contains(artifact['作成日'], inputSearchValue)));
    }
  }, [inputSearchValue]);

  useEffect(() => {
    if (selectedSearchMethodValue === '3') {
      setArtifactList(realArtifactList.filter(artifact => artifact['タスク名'] === taskList[Number(selectedSearchValue)]['タスク名']));
    } else if (selectedSearchMethodValue === '4') {
      setArtifactList(realArtifactList.filter(artifact => artifact['出力形式'] === outputList[Number(selectedSearchValue)]));
    } else if (selectedSearchMethodValue === '6') {
      setArtifactList(realArtifactList.filter(artifact => artifact['ユーザー'] === userList[Number(selectedSearchValue)]['名前']));
    }
  }, [selectedSearchValue]);

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
              value={selectedSearchMethodValue}
              onChange={(e) => setSelectedSearchMethodValue(e.target.value)}
            >
              {searchMethondList.map((search, index) => (
                <option key={index} value={index + 1} className={`${index % 2 === 1 ? "bg-[#F1F1F1]" : ''}`}>
                  {search}
                </option>
              ))}
            </select>
          </div>
          <div className="search-task-input flex ml-4">
            {selectedSearchMethodValue === '1' || selectedSearchMethodValue === '2' || selectedSearchMethodValue === '5' ? (
              <input
                type="text"
                className="w-32 bg-white border-[#ED601E] border-[1px] text-[#4C4C4C] px-3 py-2 rounded-l-md 
                 focus:outline-none focus:border-[#ED601E] focus:rounded-l-md"
                value={inputSearchValue}
                onChange={(e) => setInputSearchValue(e.target.value)}
              />
            ) : selectedSearchMethodValue === '3' ? (
              <select
                className="cursor-pointer w-32 bg-white border-[#ED601E] border-[1px] text-[#4C4C4C] px-3 py-2 rounded-l-md 
                focus:outline-none focus:border-[#ED601E] focus:rounded-l-md"
                value={selectedSearchValue}
                onChange={(e) => setSelectedSearchValue(e.target.value)}
              >
                {taskList.length === 0 ? (
                  <option value="1" className="bg-[#F1F1F1]" disabled>
                    作成されたタスクはありません。
                  </option>
                ) : (
                  taskList.map((task, index) => (
                    <option key={index + 1} value={String(index)} className={`${index % 2 === 1 ? "bg-[#F1F1F1]" : ''}`}>
                      {task["タスク名"]}
                    </option>
                  ))
                )}
              </select>
            ) : selectedSearchMethodValue === '4' ? (
              <select
                className="cursor-pointer w-32 bg-white border-[#ED601E] border-[1px] text-[#4C4C4C] px-3 py-2 rounded-l-md 
                focus:outline-none focus:border-[#ED601E] focus:rounded-l-md"
                value={selectedSearchValue}
                onChange={(e) => setSelectedSearchValue(e.target.value)}
              >(
                {outputList.map((output, index) => (
                  <option key={index + 1} value={String(index)} className={`${index % 2 === 1 ? "bg-[#F1F1F1]" : ''}`}>{output}</option>
                ))})
              </select>
            ) : selectedSearchMethodValue === '6' ? (
              <select
                className="cursor-pointer w-32 bg-white border-[#ED601E] border-[1px] text-[#4C4C4C] px-3 py-2 rounded-l-md 
                focus:outline-none focus:border-[#ED601E] focus:rounded-l-md"
                value={selectedSearchValue}
                onChange={(e) => setSelectedSearchValue(e.target.value)}
              >
                {userList.length === 0 ? (
                  <option value="1" className="bg-[#F1F1F1]" disabled>
                    登録されたユーザーがいません。
                  </option>
                ) : (
                  userList.map((user, index) => (
                    <option key={index + 1} value={String(index)} className={`${index % 2 === 1 ? "bg-[#F1F1F1]" : ''}`}>
                      {user["名前"]}
                    </option>
                  ))
                )}
              </select>
            ) : null}
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
                  paginatedArtifacts === undefined || paginatedArtifacts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-[#737576]">
                        成果物がありません
                      </td>
                    </tr>
                  ) : null
                }
                {paginatedArtifacts !== undefined && paginatedArtifacts.length > 0 && paginatedArtifacts.map((artifact, index) => (
                  <tr key={index} className={index % 2 === 1 ? 'bg-[#E9E9E9]' : 'bg-[#F5F5F5]'}>
                    <td className={`px-4 py-6 ${index === 0 ? 'rounded-tl-md' : ''} ${index === paginatedArtifacts.length - 1 ? 'rounded-bl-md' : ''}`}>
                      {artifact["id"]}
                    </td>
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
                          <span>{artifact["結果リンク"]}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(artifact["作成日"]).toLocaleString()}
                    </td>
                    <td className={`px-4 py-3 space-x-2 whitespace-nowrap ${index === 0 ? 'rounded-tr-md' : ''} ${index === paginatedArtifacts.length - 1 ? 'rounded-br-md' : ''}`}>
                      {artifact["ユーザー"]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end items-center mt-auto pt-4 space-x-2">
            <span className="text-[#737576] mr-4">前へ</span>
            <button
              className="px-2 py-1 mr-4"
              onClick={handlePrevPage}
            >
              <Image src="/images/arrow-left.png" alt="arrow-left" width={10} height={10} className="cursor-pointer" />
            </button>
            <span className="text-[#737576] mr-4">
              <span className="text-[#737576] w-4 bg-[#F5F5F5]">{currentPage}</span>
              <span className="text-[#737576] w-2">/</span>
              <span className="text-[#737576] w-4">{totalPages}</span>
            </span>
            <button
              className="px-2 py-1 mr-4"
              onClick={handleNextPage}
            >
              <Image src="/images/arrow-right.png" alt="arrow-right" width={10} height={10} className="cursor-pointer" />
            </button>
            <span className="text-[#737576]">次へ</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}