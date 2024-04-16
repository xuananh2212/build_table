import React, { Children, CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { makeData, Person } from "./makeData";
import { Header, flexRender } from "@tanstack/react-table";
import { getCommonPinningStyles } from "./Table";
const DraggableTableHeader = ({
  header,
  column,
  children,
}: {
  header: Header<Person, unknown>;
}) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <th
      {...attributes}
      {...listeners}
      colSpan={header.colSpan}
      ref={setNodeRef}
      //  style={style}
      key={header.id}
      style={{ ...style, ...getCommonPinningStyles(column) }}
    >
      {children}
    </th>
  );
};
export default DraggableTableHeader;
