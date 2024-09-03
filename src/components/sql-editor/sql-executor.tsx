"use client";

import React, { useState, useEffect } from "react";
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
        <Topbar />
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
