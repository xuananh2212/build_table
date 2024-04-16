import React, { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { makeData, Person } from "./makeData";
import { getCommonPinningStyles } from "./Table";
import { Cell, Header, flexRender } from "@tanstack/react-table";
const DragAlongCell = ({ cell }: { cell: Cell<Person, unknown> }) => {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <td
      //style={style}
      ref={setNodeRef}
      style={{ ...style, ...getCommonPinningStyles(cell.column) }}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
};

export default DragAlongCell;
