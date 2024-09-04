"use client";

import { useEffect, useState } from "react";
import { DiffModal } from "./diff-modal";
import { QueryEditor } from "./query-editor";
import { ResponseArea } from "./response-area";
import { SelectedItemHeader } from "./selected-item-header";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import {
  EditedItem,
  MenuItem,
  MenuItems,
  Query,
  ResponseData,
  SelectedItem,
  SelectedSqls,
  SqlHistory,
  SqlParamter,
} from "./types";

export function SqlExecutor() {
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [sqlQuery, setSqlQuery] = useState("");
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [parameters, setParameters] = useState<SqlParamter[]>([
    { id: 1, enabled: true, key: "", value: "", description: "" },
  ]);
  const [editedItem, setEditedItem] = useState<EditedItem>({
    id: "",
    directory: "",
    name: "",
  });
  const [sqlHistory, setSqlHistory] = useState<SqlHistory[]>([]);
  const [selectedSqls, setSelectedSqls] = useState<SelectedSqls>([null, null]);
  const [showDiff, setShowDiff] = useState(false);
  const [queries, setQueries] = useState<Query[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItems[]>([]);
  useEffect(() => {
    fetchQueries();
  }, []);

  useEffect(() => {
    const groupedQueries = queries.reduce((acc, query) => {
      const group = query.group;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(query);
      return acc;
    }, {} as { [key: string]: Query[] });

    const newMenuItems = Object.entries(groupedQueries).map(
      ([group, queries]) => ({
        id: group,
        name: group,
        items: queries.map((query) => ({
          id: query._id,
          name: query.name,
          method: query.parameters.length > 0 ? "POST" : "GET",
          sql: query.sqlQuery,
        })),
      })
    ) as MenuItems[];

    setMenuItems(newMenuItems);
  }, [queries]);

  const fetchQueries = async () => {
    const response = await fetch("/api/query");
    const data = (await response.json()) as Query[];
    setQueries(data);
  };

  const handleItemClick = (section: MenuItems, item: MenuItem) => {
    setSelectedItem({ section, item });
    setSqlQuery(item.sql);
    setEditedItem({
      id: item.id,
      directory: section.name,
      name: item.name,
    });
    setParameters([
      { id: 1, enabled: true, key: "", value: "", description: "" },
    ]);
    setResponse(null);
  };

  const handleNewQuery = () => {
    setSelectedItem(null);
    setSqlQuery("");
    setEditedItem({
      id: "",
      directory: "",
      name: "",
    });
  };

  const handleExecute = async () => {
    // パラメータをAPIに渡すためのフォーマットに変換
    const apiParameters = parameters.map((param) => ({
      key: param.key,
      value: param.value,
    }));

    try {
      const response = await fetch("/api/query/sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sqlQuery,
          binds: apiParameters, // パラメータをbindsとして渡す
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setResponse({
          columns: data.columns,
          rows: data.data,
        });
      } else {
        // エラー処理
        console.error("API エラー:", data.message);
        // エラーメッセージを表示するなど
      }
    } catch (error) {
      console.error("API 呼び出しエラー:", error);
      // エラー処理
    }

    setSqlHistory([...sqlHistory, { id: Date.now(), sql: sqlQuery }]);
  };

  const handleSave = async () => {
    const response = await fetch("/api/query", {
      method: "POST",
      body: JSON.stringify({
        parameters: parameters,
        sqlQuery: sqlQuery,
        group: editedItem?.directory,
        name: editedItem?.name,
        _id: editedItem?.id,
      }),
    });

    if (response.ok) {
      await fetchQueries(); // 保存後にクエリリストを更新
    }
  };

  const handleSelectSql = (id: number) => {
    const sql = sqlHistory.find((item) => item.id === id)!;
    if (selectedSqls[0] === null) {
      setSelectedSqls([sql, selectedSqls[1]]);
    } else if (selectedSqls[1] === null) {
      setSelectedSqls([selectedSqls[0], sql]);
    } else {
      setSelectedSqls([selectedSqls[1], sql]);
    }
  };

  const handleShowDiff = () => {
    if (selectedSqls[0] && selectedSqls[1]) {
      setShowDiff(true);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar menuItems={menuItems} handleItemClick={handleItemClick} />
      <div className="flex-1 flex flex-col">
        <Topbar handleNewQuery={handleNewQuery} />
        {selectedItem && (
          <SelectedItemHeader
            selectedItem={selectedItem}
            editedItem={editedItem}
            setEditedItem={setEditedItem}
          />
        )}
        <QueryEditor
          sqlQuery={sqlQuery}
          setSqlQuery={setSqlQuery}
          parameters={parameters}
          setParameters={setParameters}
          handleExecute={handleExecute}
          handleSave={handleSave}
          sqlHistory={sqlHistory}
          setSqlHistory={setSqlHistory}
          selectedSqls={selectedSqls}
          setSelectedSqls={setSelectedSqls}
          handleSelectSql={handleSelectSql}
          handleShowDiff={handleShowDiff}
        />
        <ResponseArea response={response} />
      </div>
      <DiffModal
        open={showDiff}
        onOpenChange={setShowDiff}
        selectedSqls={selectedSqls}
      />
    </div>
  );
}
