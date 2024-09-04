"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Bell,
  HelpCircle,
  Settings,
} from "lucide-react";

interface Props {
  handleNewQuery: () => void;
}

export function Topbar({ handleNewQuery }: Props) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={handleNewQuery}>新規クエリ</Button>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
 