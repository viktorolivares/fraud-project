// src/components/ui/TableCellViewer.tsx
"use client";

import * as React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

// 1) Constrainimos T para que tenga siempre `id`
export type TableCellViewerProps<
  T extends { id: string | number }
> = {
  item: T;
  renderTrigger: (item: T) => React.ReactNode;
  renderContent: (item: T) => React.ReactNode;
};

export function DataTableCellViewer<T extends { id: string | number }>({
  item,
  renderTrigger,
  renderContent,
}: TableCellViewerProps<T>) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {renderTrigger(item)}
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{String(item.id)}</SheetTitle>
          <SheetDescription>
            Detalle de la fila `{item.id}`
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-auto p-4">
          {renderContent(item)}
        </div>

        <SheetFooter className="flex gap-2">
          <SheetClose asChild>
            <Button variant="outline" className="flex-1">
              Cerrar
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
