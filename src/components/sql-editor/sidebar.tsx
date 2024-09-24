"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { MenuItem, MenuItems } from "./types";
import { Input } from "../ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import useDebounce from "@/hooks/use-debounce";

interface Props {
  handleItemClick: (section: MenuItems, item: MenuItem) => void;
  menuItems: MenuItems[];
  className?: string;
}

export function Sidebar({ handleItemClick, menuItems, className }: Props) {
  const [filterMenuItems, setFilterMenuItems] = useState<MenuItems[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fm: MenuItems[] = menuItems
      .map((section) => {
        return {
          ...section,
          items: section.items.filter((item) =>
            item.name.toLowerCase().includes(debouncedSearchTerm)
          ),
        } as MenuItems;
      })
      .filter((section) => section.items.length > 0);
    setFilterMenuItems(fm);
  }, [debouncedSearchTerm, menuItems]);

  return (
    <div className={cn("border-r bg-gray-100", className)}>
      <div className="p-1">
        <Input
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ScrollArea className="h-screen p-4">
        <Accordion type="multiple" className="w-full">
          {filterMenuItems.map((section) => (
            <AccordionItem value={section.id} key={section.id}>
              <AccordionTrigger className="px-4 py-2 text-xs font-medium">
                {section.name}
              </AccordionTrigger>
              <AccordionContent>
                {section.items.map((item, index) => (
                  <div
                    key={`${section.id}-${item.id}-${index}`}
                    className="px-4 py-2 text-xs cursor-pointer hover:bg-gray-200 truncate"
                    onClick={() => handleItemClick(section, item)}
                  >
                    <span
                      className={clsx(
                        "mr-2 text-white text-center rounded-full w-5 inline-block",
                        {
                          "bg-select": item.method == "SELECT",
                          "bg-insert": item.method == "INSERT",
                          "bg-update": item.method == "UPDATE",
                          "bg-delete": item.method == "DELETE",
                        }
                      )}
                    >
                      {item.method.charAt(0)}
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
