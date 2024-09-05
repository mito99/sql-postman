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

interface Props {
  response: {
    columns: string[];
    rows: { [column: string]: any }[];
  } | null;
  className?: string;
}

export function ResponseArea({ response, className }: Props) {
  return (
    <div className={cn("p-4 border-t flex flex-col overflow-auto", className)}>
      <h3 className="text-lg font-semibold mb-2">レスポンス</h3>
      <div className="flex-1 border rounded-md">
        <ScrollArea>
          {response ? (
            <div>
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
              <i className="i-lucide-database text-4xl m-5" />
              <p>クエリを実行するとレスポンスがここに表示されます</p>
            </div>
          )}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
