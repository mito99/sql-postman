"use client";

import {
  DiffIcon,
  History,
  Plus,
  Save,
  Send,
  Share2,
  Trash2,
} from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SelectedSqls, SqlHistory } from "./types";

interface Props {
  sqlQuery: string;
  setSqlQuery: (sqlQuery: string) => void;
  parameters: {
    id: number;
    enabled: boolean;
    key: string;
    value: string;
    description: string;
  }[];
  setParameters: (
    parameters: {
      id: number;
      enabled: boolean;
      key: string;
      value: string;
      description: string;
    }[]
  ) => void;
  handleExecute: () => void;
  handleSave: () => void;
  sqlHistory: SqlHistory[];
  setSqlHistory: (sqlHistory: SqlHistory[]) => void;
  selectedSqls: SelectedSqls;
  setSelectedSqls: (selectedSqls: SelectedSqls) => void;
  handleSelectSql: (id: number) => void;
  handleShowDiff: () => void;
}

export function QueryEditor({
  sqlQuery,
  setSqlQuery,
  parameters,
  setParameters,
  handleExecute,
  handleSave,
  sqlHistory,
  setSqlHistory,
  selectedSqls,
  setSelectedSqls,
  handleSelectSql,
  handleShowDiff,
}: Props) {
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

  return (
    <div className="flex-1 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Select>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="接続先を選択" />
          </SelectTrigger>
          <SelectContent className="w-64">
            <SelectItem value="app1">app1</SelectItem>
            <SelectItem value="app2">app2</SelectItem>
            <SelectItem value="app3">app3</SelectItem>
            <SelectItem value="app4">app4</SelectItem>
            <SelectItem value="app5">app5</SelectItem>
            <SelectItem value="app6">app6</SelectItem>
            <SelectItem value="app7">app7</SelectItem>
            <SelectItem value="app8">app8</SelectItem>
          </SelectContent>
        </Select>
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
                <AlertDialogAction onClick={handleSave}>OK</AlertDialogAction>
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
                      checked={selectedSqls.some((sql) => sql?.id === item.id)}
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
  );
}
