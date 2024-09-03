"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReactDiffViewer from "react-diff-viewer-continued";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSqls: {
    [index: number]: { id: number; sql: string } | null;
  };
}

export function DiffModal({ open, onOpenChange, selectedSqls }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[80vw]">
        <DialogHeader>
          <DialogTitle>SQL差分</DialogTitle>
        </DialogHeader>
        <ReactDiffViewer
          oldValue={selectedSqls[0]?.sql || ""}
          newValue={selectedSqls[1]?.sql || ""}
          splitView={true}
          showDiffOnly={false}
        />
      </DialogContent>
    </Dialog>
  );
}
