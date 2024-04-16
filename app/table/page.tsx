"use client";
import React, { CSSProperties, useEffect, useState } from "react";
import { LuPin } from "react-icons/lu";
import { LuPinOff } from "react-icons/lu";
import { TiArrowSortedUp } from "react-icons/ti";
import { TiArrowSortedDown } from "react-icons/ti";
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { makeData, Person } from "./makeData";
import { clsx } from "clsx";
const getCommonPinningStyles = (column: Column<Person>): CSSProperties => {
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

const defaultColumns: ColumnDef<Person>[] = [
  {
    accessorKey: "firstName",
    id: "firstName",
    header: "First Name",
    footer: (props) => props.column.id,
    size: 180,
    enableSorting: true,
  },
  {
    accessorKey: "lastName",
    id: "lastName",
    header: "Last Name",
    footer: (props) => props.column.id,
    size: 180,
    enableSorting: true,
  },
  {
    accessorKey: "age",
    id: "age",
    header: "Age",
    footer: (props) => props.column.id,
    size: 180,
    enableSorting: true,
  },
  {
    accessorKey: "visits",
    id: "visits",
    header: "Visits",
    footer: (props) => props.column.id,
    size: 180,
    enableSorting: true,
  },
  {
    accessorKey: "status",
    id: "status",
    header: "Status",
    footer: (props) => props.column.id,
    size: 180,
    enableSorting: true,
  },
  {
    accessorKey: "progress",
    id: "progress",
    header: "Profile Progress",
    footer: (props) => props.column.id,
    size: 180,
    enableSorting: true,
  },
];

export default function page() {
  const [data, setData] = useState(() => makeData(5));
  console.log("data:", data);
  const [columns] = useState(() => [...defaultColumns]);
  const [sorting, setSorting] = useState<SortingState>([]);

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
    },
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    manualSorting: false,
  });
  useEffect(() => {
    const lastColumnId = columns[columns.length - 1]?.id;
    if (lastColumnId) {
      if (table && table.getColumn(lastColumnId)) {
        table.getColumn(lastColumnId).pin("right");
      }
    }
  }, [table, columns]);

  return (
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
                {headerGroup.headers.map((header) => {
                  const { column } = header;

                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ ...getCommonPinningStyles(column) }}
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
                              ? header.column.getNextSortingOrder() === "asc"
                                ? "Sort ascending"
                                : header.column.getNextSortingOrder() === "desc"
                                ? "Sort descending"
                                : "Clear sort"
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <TiArrowSortedUp />,
                            desc: <TiArrowSortedDown />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                      {!header.isPlaceholder && header.column.getCanPin() && (
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
                            header.column.getIsResizing() ? "isResizing" : ""
                          }`,
                        }}
                      />
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const { column } = cell;
                  return (
                    <td
                      key={cell.id}
                      style={{ ...getCommonPinningStyles(column) }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <pre>{JSON.stringify(table.getState().columnPinning, null, 2)}</pre>
      <pre>{table.getRowModel().rows.length.toLocaleString()}</pre>
      <pre>{JSON.stringify(sorting, null, 2)}</pre>
    </div>
  );
}
