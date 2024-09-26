"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import YAML from "js-yaml";
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
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { EditedItem } from "./types";

interface Props {
  response: {
    columns: string[];
    rows: { [column: string]: any }[];
  } | null;
  className?: string;
  editedItem: EditedItem;
}

const ExportDialog = ({
  children,
  response,
  editedItem,
}: {
  children: React.ReactNode;
  response: Props["response"];
  editedItem: Props["editedItem"];
}) => {
  const convertToCSV = (response: Props["response"]) => {
    if (!response) return "";
    const header = response.columns.join(",");
    const rows = response.rows.map((row) => Object.values(row).join(","));
    return `${header}\n${rows.join("\n")}`;
  };

  const handleDownload = (format: "csv" | "tsv" | "json" | "yaml") => {
    const { mimeType, content } = (() => {
      switch (format) {
        case "csv":
          return { mimeType: "text/csv", content: convertToCSV(response) };
        case "tsv":
          return {
            mimeType: "text/tsv",
            content: convertToCSV(response).replace(/,/g, "\t"),
          };
        case "json":
          return {
            mimeType: "application/json",
            content: JSON.stringify(response, null, 2),
          };
        case "yaml":
          return { mimeType: "text/yaml", content: YAML.dump(response) };
      }
    })();

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = (() => {
      const timestamp = new Date().toISOString();
      const dir = editedItem.directory;
      const name = editedItem.name;
      const block = dir && name ? `${dir}_${name}-` : "";
      return `response-${block}${timestamp}.${format}`;
    })();
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ダウンロード</AlertDialogTitle>
          <AlertDialogDescription>ファイル形式は？</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDownload("csv")}>
            CSV
          </AlertDialogAction>
          <AlertDialogAction onClick={() => handleDownload("tsv")}>
            TSV
          </AlertDialogAction>
          <AlertDialogAction onClick={() => handleDownload("yaml")}>
            YAML
          </AlertDialogAction>
          <AlertDialogAction onClick={() => handleDownload("json")}>
            JSON
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export function ResponseArea({ response, className, editedItem }: Props) {
  return (
    <div
      className={cn("p-4 border-t flex flex-col overflow-hidden", className)}
    >
      <header className="flex justify-between items-center h-8">
        <h3 className="text-sm font-semibold mb-2">レスポンス</h3>
        {response && (
          <ExportDialog response={response} editedItem={editedItem}>
            <Button variant="outline" size="sm">
              <i className="i-lucide-download text-1xl" />
            </Button>
          </ExportDialog>
        )}
      </header>
      <ScrollArea className="flex-1">
        {response ? (
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
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <i className="i-lucide-database text-4xl m-5" />
            <p>クエリを実行するとレスポンスがここに表示されます</p>
          </div>
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
