"use client";

interface SqlHistory {
  id: number;
  sql: string;
}

interface SelectedSqls {
  [index: number]: SqlHistory | null;
  some(callbackfn: (value: SqlHistory | null, index: number, array: (SqlHistory | null)[]) => boolean): boolean;
}

interface SqlParamter {
  id: number;
  enabled: boolean;
  key: string;
  value: string;
  description: string;
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

interface Query {
  _id: string;
  parameters: SqlParamter[];
  sqlQuery: string;
  group: string;
  name: string;
}

  interface EditedItem {
    id: string;
    directory: string;
    name: string;
  }

export type {
  SqlHistory,
  SelectedSqls,
  MenuItem,
  MenuItems,
  SelectedItem,
  ResponseData,
  Query,
  SqlParamter,
  EditedItem
};
