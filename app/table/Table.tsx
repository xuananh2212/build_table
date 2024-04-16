"use client";
import React, { CSSProperties, useEffect, useState } from "react";
import { LuPin } from "react-icons/lu";
import { LuPinOff } from "react-icons/lu";
import { TiArrowSortedUp } from "react-icons/ti";
import { TiArrowSortedDown } from "react-icons/ti";
import { CiMenuKebab } from "react-icons/ci";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { makeData, Person } from "./makeData";
import { clsx } from "clsx";

import DragAlongCell from "./DragAlongCell";
import DraggableTableHeader from "./DraggableTableHeader";
export const getCommonPinningStyles = (
  column: Column<Person>
): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");

  return {
    boxShadow: isLastLeftPinnedColumn
      ? "-4px 0 4px -4px gray inset"
      : isFirstRightPinnedColumn
      ? "4px 0 4px -4px gray inset"
      : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
};

const defaultColumns = [
  {
    accessorKey: "stt",
    id: "stt",
    header: "STT",
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
    size: 180,
    //  enableSorting: true,
  },
  {
    accessorKey: "id",
    id: "id",
    header: "Mã đơn vị",
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
    size: 180,
    //   enableSorting: true,
  },
  {
    accessorKey: "unit",
    id: "unit",
    header: "thuộc đơn vị ",
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
    size: 180,
    //    enableSorting: true,
  },
  {
    accessorKey: "levelOrganization",
    id: "levelOrganization",
    header: "Cấp tổ chức",
    footer: (props) => props.column.id,
    size: 180,
    //  enableSorting: true,
    //  sortingFn: sortStatusFn,
  },
  {
    accessorKey: "history",
    id: "history",
    header: "Lịch sử",
    footer: (props) => props.column.id,
    size: 180,
    // enableSorting: true,
  },
  {
    accessorKey: "Hành động",
    id: "action",
    header: "action",
    footer: (props) => props.column.id,
    size: 180,
    //  enableSorting: true,
  },
];

export default function Page() {
  const [data, setData] = useState(() => makeData(5));
  const [columns] = useState(() => [...defaultColumns]);
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["ACS"]));
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = React.useState<string[]>(() =>
    columns.map((c) => c.id!)
  );
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );
  const table = useReactTable<Person>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    columnResizeMode: "onChange",
    state: {
      sorting,
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    manualSorting: false,
  });
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });
  const sensors = useSensors(pointerSensor);
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
      });
    }
  }
  // const sensors = useSensors(
  //   // pointerSensor,
  //   useSensor(MouseSensor, {}),
  //   useSensor(TouchSensor, {}),
  //   useSensor(KeyboardSensor, {})
  // );

  useEffect(() => {
    const lastColumnId = columns[columns.length - 1]?.id;
    if (lastColumnId) {
      if (table && table.getColumn(lastColumnId)) {
        table.getColumn(lastColumnId).pin("right");
      }
    }
  }, [table, columns]);

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="p-2">
        <div className="table-container">
          <table
            style={{
              width: table.getTotalSize(),
            }}
          >
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  <SortableContext
                    items={columnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    {headerGroup.headers.map((header) => {
                      const { column } = header;
                      return (
                        <DraggableTableHeader
                          key={header.id}
                          header={header}
                          column={column}
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              className={clsx(
                                "flex items-center justify-center",
                                header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : ""
                              )}
                              onClick={header.column.getToggleSortingHandler()}
                              title={
                                header.column.getCanSort()
                                  ? header.column.getNextSortingOrder() ===
                                    "asc"
                                    ? "Sort ascending"
                                    : header.column.getNextSortingOrder() ===
                                      "desc"
                                    ? "Sort descending"
                                    : "Clear sort"
                                  : undefined
                              }
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              <Dropdown>
                                <DropdownTrigger>
                                  <Button variant="bordered">
                                    {" "}
                                    <CiMenuKebab />
                                  </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                  aria-label="Single selection example"
                                  variant="flat"
                                  disallowEmptySelection
                                  selectionMode="single"
                                  selectedKeys={selectedKeys}
                                  onSelectionChange={setSelectedKeys}
                                >
                                  <DropdownItem key="ACS">Lọc A</DropdownItem>
                                  <DropdownItem key="DESC">Lọc B</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                              {{
                                asc: <TiArrowSortedUp />,
                                desc: <TiArrowSortedDown />,
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          )}
                          {!header.isPlaceholder &&
                            header.column.getCanPin() && (
                              <div className="flex gap-1 justify-end">
                                {header.column.getIsPinned() !== "left" &&
                                header.column.getIsPinned() !== "right" ? (
                                  <button
                                    className="border rounded px-2 outline-none bg-transparent border-none"
                                    onClick={() => {
                                      header.column.pin("left");
                                    }}
                                  >
                                    <LuPin />
                                  </button>
                                ) : null}
                                {header.column.getIsPinned() ? (
                                  <button
                                    className="border rounded px-2 outline-none bg-transparent border-none"
                                    onClick={() => {
                                      header.column.pin(false);
                                    }}
                                  >
                                    <LuPinOff />
                                  </button>
                                ) : null}
                              </div>
                            )}
                          <div
                            {...{
                              onDoubleClick: () => header.column.resetSize(),
                              onMouseDown: header.getResizeHandler(),
                              onTouchStart: header.getResizeHandler(),
                              className: `resizer ${
                                header.column.getIsResizing()
                                  ? "isResizing"
                                  : ""
                              }`,
                            }}
                          />
                        </DraggableTableHeader>
                      );
                    })}
                  </SortableContext>
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <SortableContext
                      key={cell.id}
                      items={columnOrder}
                      strategy={horizontalListSortingStrategy}
                    >
                      <DragAlongCell key={cell.id} cell={cell} />
                    </SortableContext>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <pre>{JSON.stringify(table.getState().columnPinning, null, 2)}</pre>
        <pre>{table.getRowModel().rows.length.toLocaleString()}</pre>
        <pre>{JSON.stringify(sorting, null, 2)}</pre>
      </div>
    </DndContext>
  );
}
