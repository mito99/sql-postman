"use client";

import React, { useState } from "react";
import { ChevronRight, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditedItem } from "./types";

interface Props {
  selectedItem: {
    section: {
      id: string;
      name: string;
      items: {
        id: string;
        name: string;
        method: "POST" | "GET";
        sql: string;
      }[];
    };
    item: {
      id: string;
      name: string;
      method: "POST" | "GET";
      sql: string;
    };
  };
  editedItem: EditedItem;
  setEditedItem: (editedItem: EditedItem) => void;
}

export function SelectedItemHeader({
  selectedItem,
  editedItem,
  setEditedItem,
}: Props) {
  const [editingDirectory, setEditingDirectory] = useState(false);
  const [editingItem, setEditingItem] = useState(false);

  const handleDirectoryEdit = () => {
    setEditingDirectory(true);
  };

  const handleItemEdit = () => {
    setEditingItem(true);
  };

  const handleDirectoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedItem({...editedItem, directory: e.target.value});
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedItem({...editedItem, name: e.target.value});
  };

  const handleDirectoryBlur = () => {
    setEditingDirectory(false);
  };

  const handleItemBlur = () => {
    setEditingItem(false);
  };

  return (
    <div className="p-4 border-b bg-white">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold">
          {selectedItem.item.method === "POST" ? "P" : "G"}
        </div>
        <div className="flex items-center space-x-2">
          {editingDirectory ? (
            <Input
              value={editedItem.directory}
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
              <span className="font-semibold">{editedItem.directory}</span>
              <Edit2 className="h-4 w-4 ml-2" />
            </Button>
          )}
          <ChevronRight className="h-4 w-4" />
          {editingItem ? (
            <Input
              value={editedItem.name}
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
              <span className="font-semibold">{editedItem.name}</span>
              <Edit2 className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}