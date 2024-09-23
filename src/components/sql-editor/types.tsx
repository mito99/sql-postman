"use client";

interface SqlHistory {
  id: number;
  sql: string;
}

interface SelectedSqlList {
  [index: number]: SqlHistory | null;
  some(
    callbackfn: (
      value: SqlHistory | null,
      index: number,
      array: (SqlHistory | null)[]
    ) => boolean
  ): boolean;
}

interface SqlParameter {
  id: number;
  enabled: boolean;
  key: string;
  value: string;
  description: string;
}

interface MenuItem {
  id: string;
  name: string;
  method: EditedItem["method"];
  sql: string;
  description: string;
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
  parameters: SqlParameter[];
  sqlQuery: string;
  group: string;
  name: string;
  method: EditedItem["method"];
  description: string;
}

interface EditedItem {
  id: string;
  directory: string;
  name: string;
  method: "" | "SELECT" | "UPDATE" | "INSERT" | "DELETE";
  description: string; // 概要を追加
}

export type {
  EditedItem,
  MenuItem,
  MenuItems,
  Query,
  ResponseData,
  SelectedItem,
  SelectedSqlList,
  SqlHistory,
  SqlParameter,
};
