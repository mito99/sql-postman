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

interface Props {
  handleItemClick: (section: MenuItems, item: MenuItem) => void;
  menuItems: MenuItems[];
  className?: string;
}

export function Sidebar({ handleItemClick, menuItems, className }: Props) {
  return (
    <div className={cn("w-64 border-r bg-gray-100 shrink-0", className)}>
      <ScrollArea className="h-screen p-4">
        <Accordion type="multiple" className="w-full">
          {menuItems.map((section) => (
            <AccordionItem value={section.id} key={section.id}>
              <AccordionTrigger className="px-4 py-2 text-sm font-medium">
                {section.name}
              </AccordionTrigger>
              <AccordionContent>
                {section.items.map((item, index) => (
                  <div
                    key={`${section.id}-${item.id}-${index}`}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
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
