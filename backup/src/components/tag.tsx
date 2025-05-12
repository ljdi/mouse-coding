import { useDndStore } from "@/providers/dnd-store-provider";
import clsx from "clsx";
import { FC, useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";

export interface Node {
  tag: string;
}

export interface TagNodeProps {
  name: string;
  type: string;
}
export type NodeContext = {
  node?: TagNodeProps;
  parentNode?: TagNodeProps;
  siblingNodes: TagNodeProps[];
  scope?: unknown;
};

export const TagTypes = {
  DIV: "div",
  SPAN: "span",
  P: "p",
};

const TagNode: FC<TagNodeProps> = ({ name, type }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type,
      item: { name },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [name, type],
  );

  const onDragging = useDndStore((state) => state.onDragging);

  useEffect(() => {
    onDragging(isDragging);
  }, [isDragging]);

  return (
    <li
      ref={drag}
      className={clsx(
        "cursor-pointer",
        isDragging && "italic text-green-500 opacity-40",
      )}
    >{`<${name}>`}</li>
  );
};

export interface SlotNodeProps {
  level?: number;
  accept: string[];
  onDrop: (item: any, context: NodeContext) => void;
  context: NodeContext;
}

export const SlotNode: FC<SlotNodeProps> = ({
  level = 1,
  accept,
  onDrop,
  context,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: (item) => {
      onDrop(item, context);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const isDragging = useDndStore((state) => state.isDragging);

  const isActive = isOver && canDrop;

  return (
    <div
      ref={drop}
      data-testid="tag-slot"
      style={{ marginLeft: `calc(1em * (${level} - 1))` }}
      className={clsx(
        "h-5",
        isDragging ? (isActive ? "bg-blue-600" : "bg-blue-200") : "bg-red-300",
      )}
    ></div>
  );
};

const defaultTagList: TagNodeProps[] = [
  { name: "div", type: TagTypes.DIV },
  { name: "span", type: TagTypes.SPAN },
  { name: "p", type: TagTypes.P },
];
interface TagListProps {}
export const TagList: FC<TagListProps> = () => {
  const [tagList] = useState(defaultTagList);

  return (
    <ul>
      {tagList.map(({ name, type }) => (
        <TagNode key={name} name={name} type={type} />
      ))}
    </ul>
  );
};
