"use client";

import { Button } from "@/components/ui/button";

interface Props {
  handleNewQuery: () => void;
}

export function Topbar({ handleNewQuery }: Props) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={handleNewQuery}>新規クエリ</Button>
      </div>
    </div>
  );
}
 