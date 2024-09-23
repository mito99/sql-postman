"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReactDiffViewer from "react-diff-viewer-continued";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSqlList: {
    [index: number]: { id: number; sql: string } | null;
  };
}

export function DiffModal({ open, onOpenChange, selectedSqlList }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[80vw]">
        <DialogHeader>
          <DialogTitle>SQL差分</DialogTitle>
        </DialogHeader>
        <ReactDiffViewer
          oldValue={selectedSqlList[0]?.sql || ""}
          newValue={selectedSqlList[1]?.sql || ""}
          splitView={true}
          showDiffOnly={false}
        />
      </DialogContent>
    </Dialog>
  );
}
