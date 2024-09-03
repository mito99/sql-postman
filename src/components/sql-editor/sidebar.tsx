"use client";

import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MenuItem, MenuItems, Query } from "./types";

interface Props {
  handleItemClick: (section: MenuItems, item: MenuItem) => void;
}

export function Sidebar({ handleItemClick }: Props) {
  const [menuItems, setMenuItems] = useState<MenuItems[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);

  useEffect(() => {
    const fetchQueries = async () => {
      const response = await fetch("/api/query");
      const data = (await response.json()) as Query[];
      setQueries(data);
    };

    fetchQueries();
  }, []);

  useEffect(() => {
    const groupedQueries = queries.reduce((acc, query) => {
      const group = query.group;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(query);
      return acc;
    }, {} as { [key: string]: Query[] });

    const newMenuItems = Object.entries(groupedQueries).map(
      ([group, queries]) => ({
        id: group,
        name: group,
        items: queries.map((query) => ({
          id: query._id,
          name: query.name,
          method: query.parameters.length > 0 ? "POST" : "GET",
          sql: query.sqlQuery,
        })),
      })
    ) as MenuItems[];

    setMenuItems(newMenuItems);
  }, [queries]);

  return (
    <div className="w-64 border-r bg-gray-100">
      <ScrollArea className="h-screen">
        <Accordion type="multiple" className="w-full">
          {menuItems.map((section) => (
            <AccordionItem value={section.id} key={section.id}>
              <AccordionTrigger className="px-4 py-2 text-sm font-medium">
                {section.name}
              </AccordionTrigger>
              <AccordionContent>
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
                    onClick={() => handleItemClick(section, item)}
                  >
                    <span
                      className={`mr-2 ${
                        item.method === "POST"
                          ? "text-orange-500"
                          : "text-green-500"
                      }`}
                    >
                      {item.method}
                    </span>
                    {item.name}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
