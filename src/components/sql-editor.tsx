"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  Send,
  Save,
  Share2,
  Settings,
  Bell,
  HelpCircle,
  Plus,
  Trash2,
  ChevronRight,
  Edit2,
  History,
  DiffIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReactDiffViewer from "react-diff-viewer-continued";

interface SqlHistory {
  id: number;
  sql: string;
}

interface SelectedSqls {
  [index: number]: SqlHistory | null;
  some(callbackfn: (value: SqlHistory | null, index: number, array: (SqlHistory | null)[]) => boolean): boolean;
}

interface MenuItem {
  id: string;
  name: string;
  method: "POST" | "GET"; 
  sql: string;
}

interface MenuItems {
  id: string;
  name: string;
  items: MenuItem[];
}

interface SelectedItem {
  section: {
    id: string;
    name: string;
    items: MenuItem[];
  };
  item: MenuItem;
}

interface ResponseData {
  columns: string[];
  rows: { [column: string]: any }[];
}

const menuItems = [
  {
    id: "firecrawl",
    name: "Firecrawl",
    items: [
      {
        id: "sync-request",
        name: "同期リクエスト",
        method: "POST",
        sql: "SELECT * FROM sync_requests LIMIT 5;",
      },
      {
        id: "async-request",
        name: "非同期リクエスト",
        method: "POST",
        sql: "SELECT * FROM async_requests LIMIT 5;",
      },
      {
        id: "async-result",
        name: "非同期リクエストの結果確認",
        method: "GET",
        sql: "SELECT * FROM async_results LIMIT 5;",
      },
    ],
  },
  {
    id: "ftgo",
    name: "FTGO",
    items: [
      {
        id: "orders",
        name: "http://localhost:8080/orders?",
        method: "POST",
        sql: "SELECT * FROM orders LIMIT 5;",
      },
    ],
  },
  {
    id: "push-notification",
    name: "プッシュ通知",
    items: [
      {
        id: "fcm",
        name: "https://fcm.googleapis.com/fcm/s...",
        method: "POST",
        sql: "SELECT * FROM push_notifications LIMIT 5;",
      },
    ],
  },
] as MenuItems[];

export function SqlEditor() {
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null> (null);
  const [sqlQuery, setSqlQuery] = useState("");
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [parameters, setParameters] = useState([
    { id: 1, enabled: true, key: "", value: "", description: "" },
  ]);
  const [editingDirectory, setEditingDirectory] = useState(false);
  const [editingItem, setEditingItem] = useState(false);
  const [editedDirectory, setEditedDirectory] = useState("");
  const [editedItem, setEditedItem] = useState("");
  const [sqlHistory, setSqlHistory] = useState<SqlHistory[]>([]);
  const [selectedSqls, setSelectedSqls] = useState<SelectedSqls>([null, null]);
  const [showDiff, setShowDiff] = useState(false);

  const handleItemClick = (section: MenuItems, item: MenuItem) => {
    setSelectedItem({ section, item });
    setSqlQuery(item.sql);
    setEditedDirectory(section.name);
    setEditedItem(item.name);
    setParameters([
      { id: 1, enabled: true, key: "", value: "", description: "" },
    ]);
    setResponse(null);
  };

  const handleExecute = () => {
    const fakeData = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      created_at: new Date().toISOString(),
      status: ["pending", "completed", "failed"][Math.floor(Math.random() * 3)],
      description: `Description for item ${i + 1}`,
      category: ["A", "B", "C"][Math.floor(Math.random() * 3)],
      price: Math.floor(Math.random() * 10000) / 100,
      quantity: Math.floor(Math.random() * 100),
      supplier: `Supplier ${Math.floor(Math.random() * 5) + 1}`,
      last_updated: new Date().toISOString(),
    }));

    setResponse({
      columns: [
        "id",
        "name",
        "created_at",
        "status",
        "description",
        "category",
        "price",
        "quantity",
        "supplier",
        "last_updated",
      ],
      rows: fakeData,
    });

    setSqlHistory([...sqlHistory, { id: Date.now(), sql: sqlQuery }]);
  };

  const addParameter = () => {
    setParameters([
      ...parameters,
      { id: Date.now(), enabled: true, key: "", value: "", description: "" },
    ]);
  };

  const updateParameter = (id: number, field: string, value: string) => {
    setParameters(
      parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      )
    );
  };

  const removeParameter = (id: number) => {
    setParameters(parameters.filter((param) => param.id !== id));
  };

  const handleDirectoryEdit = () => {
    setEditingDirectory(true);
  };

  const handleItemEdit = () => {
    setEditingItem(true);
  };

  const handleDirectoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDirectory(e.target.value);
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedItem(e.target.value);
  };

  const handleDirectoryBlur = () => {
    setEditingDirectory(false);
  };

  const handleItemBlur = () => {
    setEditingItem(false);
  };

  const handleSave = () => {
    console.log("保存処理:", {
      itemName: editedItem,
      parameters: parameters,
      sqlQuery: sqlQuery,
    });
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
      {/* 左サイドバー */}
      <div className="w-64 border-r bg-gray-100">
        <ScrollArea className="h-screen">
          <Accordion type="multiple" className="w-full">
            {menuItems.map((section) => (
              <AccordionItem value={section.id} key={section.id}>
                <AccordionTrigger className="px-4 py-2 text-sm font-medium">
                  {section.name}
                </AccordionTrigger>
                <AccordionContent>
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
                      onClick={() => handleItemClick(section, item)}
                    >
                      <span
                        className={`mr-2 ${
                          item.method === "POST"
                            ? "text-orange-500"
                            : "text-green-500"
                        }`}
                      >
                        {item.method}
                      </span>
                      {item.name}
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col">
        {/* トップバー */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <Input className="w-64" placeholder="クエリを検索..." />
            <Button variant="outline">新規クエリ</Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 選択された項目名 */}
        {selectedItem && (
          <div className="p-4 border-b bg-white">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold">
                {selectedItem.item.method === "POST" ? "P" : "G"}
              </div>
              <div className="flex items-center space-x-2">
                {editingDirectory ? (
                  <Input
                    value={editedDirectory}
                    onChange={handleDirectoryChange}
                    onBlur={handleDirectoryBlur}
                    className="w-40"
                    autoFocus
                  />
                ) : (
                  <Button
                    variant="ghost"
                    onClick={handleDirectoryEdit}
                    className="p-1"
                  >
                    <span className="font-semibold">{editedDirectory}</span>
                    <Edit2 className="h-4 w-4 ml-2" />
                  </Button>
                )}
                <ChevronRight className="h-4 w-4" />
                {editingItem ? (
                  <Input
                    value={editedItem}
                    onChange={handleItemChange}
                    onBlur={handleItemBlur}
                    className="w-64"
                    autoFocus
                  />
                ) : (
                  <Button
                    variant="ghost"
                    onClick={handleItemEdit}
                    className="p-1"
                  >
                    <span className="font-semibold">{editedItem}</span>
                    <Edit2 className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* クエリエディタ */}
        <div className="flex-1 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Input className="w-64" placeholder="データベース名を入力" />
            <div className="space-x-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    保存
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>保存の確認</AlertDialogTitle>
                    <AlertDialogDescription>
                      保存してよいですか？
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSave}>
                      OK
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                共有
              </Button>
              <Button onClick={handleExecute}>
                <Send className="h-4 w-4 mr-2" />
                実行
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <History className="h-4 w-4 mr-2" />
                    履歴
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>SQL実行履歴</DialogTitle>
                    <DialogDescription>
                      過去に実行したSQLクエリの履歴です。差分を表示するには2つのSQLを選択してください。
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[300px] w-full">
                    {sqlHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-100"
                      >
                        <Checkbox
                          checked={selectedSqls.some(
                            (sql) => sql?.id === item.id
                          )}
                          onCheckedChange={() => handleSelectSql(item.id)}
                        />
                        <div className="truncate">{item.sql}</div>
                      </div>
                    ))}
                  </ScrollArea>
                  <Button
                    onClick={handleShowDiff}
                    disabled={!selectedSqls[0] || !selectedSqls[1]}
                  >
                    <DiffIcon className="h-4 w-4 mr-2" />
                    差分を表示
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <Tabs defaultValue="sql" className="w-full">
            <TabsList>
              <TabsTrigger value="parameters">パラメータ</TabsTrigger>
              <TabsTrigger value="sql">SQL</TabsTrigger>
            </TabsList>
            <TabsContent value="parameters">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>キー</TableHead>
                      <TableHead>値</TableHead>
                      <TableHead>説明</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parameters.map((param) => (
                      <TableRow key={param.id}>
                        <TableCell>
                          <Checkbox
                            checked={param.enabled}
                            onCheckedChange={(checked) =>
                              updateParameter(
                                param.id,
                                "enabled",
                                checked.toString()
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={param.key}
                            onChange={(e) =>
                              updateParameter(param.id, "key", e.target.value)
                            }
                            placeholder="キー"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={param.value}
                            onChange={(e) =>
                              updateParameter(param.id, "value", e.target.value)
                            }
                            placeholder="値"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={param.description}
                            onChange={(e) =>
                              updateParameter(
                                param.id,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="説明"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeParameter(param.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="p-2">
                  <Button variant="outline" size="sm" onClick={addParameter}>
                    <Plus className="h-4 w-4 mr-2" />
                    パラメータを追加
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="sql">
              <Textarea
                className="min-h-[200px]"
                placeholder="SQLクエリをここに入力してください..."
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* レスポンスエリア */}
        <div className="flex-1 p-4 border-t">
          <h3 className="text-lg font-semibold mb-2">レスポンス</h3>
          <div className="h-[calc(100vh-26rem)] border rounded-md overflow-hidden">
            <ScrollArea className="h-full">
              {response ? (
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {response.columns.map((column, index) => (
                          <TableHead
                            key={index}
                            className="px-4 py-2 whitespace-nowrap"
                          >
                            {column}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {response.rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {response.columns.map((column, colIndex) => (
                            <TableCell
                              key={colIndex}
                              className="px-4 py-2 whitespace-nowrap"
                            >
                              {row[column]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Image
                    src="/placeholder.svg"
                    alt="レスポンスなし"
                    height={100}
                    width={100}
                    className="mb-4"
                  />
                  <p>クエリを実行するとレスポンスがここに表示されます</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* 差分表示モーダル */}
      <Dialog open={showDiff} onOpenChange={setShowDiff}>
        <DialogContent className="sm:max-w-[80vw]">
          <DialogHeader>
            <DialogTitle>SQL差分</DialogTitle>
          </DialogHeader>
          <ReactDiffViewer
            oldValue={selectedSqls[0]?.sql || ""}
            newValue={selectedSqls[1]?.sql || ""}
            splitView={true}
            showDiffOnly={false}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
