"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { ChevronRight, Edit2 } from "lucide-react";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { EditedItem } from "./types";
import { Textarea } from "../ui/textarea";

interface Props {
  editedItem: EditedItem;
  setEditedItem: (editedItem: EditedItem) => void;
}

export function SelectedItemHeader({ editedItem, setEditedItem }: Props) {
  const [editingDirectory, setEditingDirectory] = useState(false);
  const [editingItem, setEditingItem] = useState(false);

  const handleDirectoryEdit = () => {
    setEditingDirectory(true);
  };

  const handleItemEdit = () => {
    setEditingItem(true);
  };

  const handleDirectoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedItem({ ...editedItem, directory: e.target.value });
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedItem({ ...editedItem, name: e.target.value });
  };

  const handleDirectoryBlur = () => {
    setEditingDirectory(false);
  };

  const handleItemBlur = () => {
    setEditingItem(false);
  };

  const handleMethodChange = (value: string) => {
    setEditedItem({ ...editedItem, method: value as EditedItem["method"] });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEditedItem({ ...editedItem, description: e.target.value });
  };

  return (
    <div className="p-4 border-b bg-white">
      <div className="flex items-center space-x-2">
        <div
          className={clsx(
            "w-24 h-8 rounded-md flex items-center justify-center font-bold",
            {
              "bg-select text-white": editedItem.method === "SELECT",
              "bg-insert text-white": editedItem.method === "INSERT",
              "bg-update text-white": editedItem.method === "UPDATE",
              "bg-delete text-white": editedItem.method === "DELETE",
            }
          )}
        >
          <Select value={editedItem.method} onValueChange={handleMethodChange}>
            <SelectTrigger>
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SELECT">SELECT</SelectItem>
              <SelectItem value="UPDATE">UPDATE</SelectItem>
              <SelectItem value="INSERT">INSERT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
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
              {editedItem.directory ? (
                <span className="font-semibold">{editedItem.directory}</span>
              ) : (
                <span className="text-gray-500">
                  ディレクトリ名を入力してください
                </span>
              )}
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
            <Button variant="ghost" onClick={handleItemEdit} className="p-1">
              {editedItem.name ? (
                <span className="font-semibold">{editedItem.name}</span>
              ) : (
                <span className="text-gray-500">
                  クエリ名を入力してください
                </span>
              )}
              <Edit2 className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
      <div className="mt-4">
        <Textarea
          placeholder="概要を入力してください"
          rows={1}
          className="min-h-[1.1rem]"
          value={editedItem.description}
          onChange={handleDescriptionChange}
        />
      </div>
    </div>
  );
}
