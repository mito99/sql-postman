"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

interface Props {
  response: {
    columns: string[];
    rows: { [column: string]: any }[];
  } | null;
}

export function ResponseArea({ response }: Props) {
  return (
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
  );
}
 