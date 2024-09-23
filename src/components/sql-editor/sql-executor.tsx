"use client";

import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useCallback } from "react";
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
  SelectedSqlList,
  SqlHistory,
  SqlParameter,
} from "./types";

export function SqlExecutor() {
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [sqlQuery, setSqlQuery] = useState("");
  const [dbName, setDbName] = useState("app1");
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [parameters, setParameters] = useState<SqlParameter[]>([
    { id: 1, enabled: true, key: "", value: "", description: "" },
  ]);
  const [editedItem, setEditedItem] = useState<EditedItem>({
    id: "",
    directory: "",
    name: "",
    description: "",
    method: "SELECT",
  });
  const [sqlHistory, setSqlHistory] = useState<SqlHistory[]>([]);
  const [selectedSqlList, setSelectedSqlList] = useState<SelectedSqlList>([
    null,
    null,
  ]);
  const [showDiff, setShowDiff] = useState(false);
  const [queries, setQueries] = useState<Query[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItems[]>([]);
  const fetchQueries = useCallback(async () => {
    try {
      const response = await fetch("/api/query");
      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "クエリ取得エラー",
          description: errorData.message || "クエリを取得できませんでした。",
          variant: "destructive",
        });
        return;
      }
      const data = (await response.json()) as Query[];
      setQueries(data);
    } catch (error) {
      console.error("クエリ取得エラー:", error);
      toast({
        title: "クエリ取得エラー",
        description: "クエリを取得できませんでした。",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchQueries();
  }, [fetchQueries]);

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
          method: query.method,
          sql: query.sqlQuery,
          description: query.description,
        })),
      })
    ) as MenuItems[];

    setMenuItems(newMenuItems);
  }, [queries]);

  const handleItemClick = (section: MenuItems, item: MenuItem) => {
    setSelectedItem({ section, item });
    setSqlQuery(item.sql);
    setEditedItem({
      id: item.id,
      directory: section.name,
      name: item.name,
      method: item.method,
      description: item.description,
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
      method: "SELECT",
      description: "",
    });
  };

  const handleExecute = async () => {
    // パラメータをAPIに渡すためのフォーマットに変換
    const apiParameters = parameters.map((param) => ({
      key: param.key,
      value: param.value,
    }));

    try {
      const response = await fetch("/api/sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dbName,
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
        toast({
          title: "クエリ実行エラー",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("API 呼び出しエラー:", error);
      toast({
        title: "クエリ実行エラー",
        description: "API 呼び出しに失敗しました。",
        variant: "destructive",
      });
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
        method: editedItem?.method,
      }),
    });

    if (response.ok) {
      await fetchQueries();
      const data = await response.json();
      setEditedItem({
        ...editedItem,
        id: data._id,
      });
      toast({
        title: data.message,
        duration: 1000,
        className: "bg-blue-500 border-blue-500 text-white",
      });
    }
  };

  const handleDelete = async () => {
    const response = await fetch("/api/query", {
      method: "DELETE",
      body: JSON.stringify({
        _id: editedItem?.id,
      }),
    });

    if (response.ok) {
      await fetchQueries();
      toast({
        title: "削除しました",
        duration: 1000,
        className: "bg-blue-500 border-blue-500 text-white",
      });
    }
  };

  const handleSelectSql = (id: number) => {
    const sql = sqlHistory.find((item) => item.id === id)!;
    if (selectedSqlList[0] === null) {
      setSelectedSqlList([sql, selectedSqlList[1]]);
    } else if (selectedSqlList[1] === null) {
      setSelectedSqlList([selectedSqlList[0], sql]);
    } else {
      setSelectedSqlList([selectedSqlList[1], sql]);
    }
  };

  const handleShowDiff = () => {
    if (selectedSqlList[0] && selectedSqlList[1]) {
      setShowDiff(true);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex h-screen bg-background text-foreground container">
        <Sidebar
          menuItems={menuItems}
          handleItemClick={handleItemClick}
          className="w-[20%] h-full"
        />

        <div className="flex-1 flex flex-col w-[80%]">
          <Topbar handleNewQuery={handleNewQuery} />
          <SelectedItemHeader
            editedItem={editedItem}
            setEditedItem={setEditedItem}
          />
          <QueryEditor
            sqlQuery={sqlQuery}
            setSqlQuery={setSqlQuery}
            parameters={parameters}
            setParameters={setParameters}
            handleExecute={handleExecute}
            handleSave={handleSave}
            sqlHistory={sqlHistory}
            setSqlHistory={setSqlHistory}
            selectedSqlList={selectedSqlList}
            setSelectedSqlList={setSelectedSqlList}
            handleSelectSql={handleSelectSql}
            handleShowDiff={handleShowDiff}
            dbName={dbName}
            setDbName={setDbName}
            handleDelete={handleDelete}
          />
          <ResponseArea
            response={response}
            className="flex-1"
            editedItem={editedItem}
          />
        </div>
        <DiffModal
          open={showDiff}
          onOpenChange={setShowDiff}
          selectedSqlList={selectedSqlList}
        />
      </div>
    </div>
  );
}
