import clsx from "clsx";
import { FC, useCallback, useState } from "react";
import TreeView, {
  flattenTree,
  IBranchProps,
  INode,
  LeafProps,
} from "react-accessible-treeview";
import { IFlatMetadata } from "react-accessible-treeview/dist/TreeView/utils";
import { DragSourceHookSpec, useDrag } from "react-dnd";
import { IoIosArrowForward } from "react-icons/io";
import { SlotNode, TagNodeProps, TagTypes } from "./tag";

const LAST_NODE_PLACEHOLDER = "LAST_NODE_PLACEHOLDER";

const folder = {
  name: "body",
  children: [{ name: LAST_NODE_PLACEHOLDER }],
};

const data = flattenTree(folder);

const ArrowIcon: FC<{ isExpanded: boolean }> = ({ isExpanded }) => (
  <IoIosArrowForward
    className={clsx("inline-block", isExpanded && "rotate-90")}
  />
);

export interface AstNode
  extends INode<IFlatMetadata>,
    DragSourceHookSpec<unknown, unknown, unknown> {}

interface ElementTagProps {
  isExpanded: boolean;
  level: number;
  isBranch: boolean;
  element: INode<IFlatMetadata>;
  type: string;
  isDropped: boolean;
}

const ElementTag: FC<ElementTagProps & (IBranchProps | LeafProps)> = ({
  element,
  isExpanded,
  level,
  isBranch,

  type,
  isDropped,
  ...props
}) => {
  const [{ opacity }, drag] = useDrag(
    () => ({
      type,
      item: { name: element.name },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [element.name, type],
  );

  return (
    <div
      {...props}
      ref={drag}
      style={{ paddingLeft: `calc(1em * ${level - 1})`, opacity }}
      className={clsx("cursor-pointer")}
      title={isDropped ? "----" + element.name : element.name}
    >
      <>
        {isBranch && <ArrowIcon isExpanded={isExpanded} />}
        <span className={clsx("select-none", !isBranch && "cursor-move pl-4")}>
          {element.name}
        </span>
      </>
    </div>
  );
};

export const AstViewer: FC = () => {
  const [treeData] = useState(data);

  const [droppedBoxNames, setDroppedBoxNames] = useState<string[]>([]);

  function isDropped(boxName: string) {
    return !!~droppedBoxNames.indexOf(boxName);
  }

  const handleDrop = useCallback(
    (item: TagNodeProps) => {
      const { name } = item;
      console.log(item);
      setDroppedBoxNames((state) => state.concat(name || []));
    },
    [droppedBoxNames],
  );

  return (
    <>
      <div>
        <div className="checkbox">
          <TreeView
            data={treeData}
            className="m-0 p-5"
            multiSelect
            propagateSelect
            propagateSelectUpwards
            togglableSelect
            nodeRenderer={({
              element,
              isBranch,
              isExpanded,
              getNodeProps,
              level,
              handleExpand,
            }) => {
              return (
                <>
                  {element.name === LAST_NODE_PLACEHOLDER ? (
                    <SlotNode
                      accept={Object.values(TagTypes)}
                      onDrop={handleDrop}
                      context={{ siblingNodes: [] }}
                    ></SlotNode>
                  ) : (
                    <>
                      <SlotNode
                        level={level}
                        accept={Object.values(TagTypes)}
                        onDrop={handleDrop}
                        context={{ siblingNodes: [] }}
                      ></SlotNode>
                      <ElementTag
                        {...getNodeProps({ onClick: handleExpand })}
                        element={element}
                        isExpanded={isExpanded}
                        level={level}
                        isBranch={isBranch}
                        type={TagTypes.DIV}
                        isDropped={isDropped(element.name)}
                      ></ElementTag>
                      <SlotNode
                        level={level + 1}
                        accept={Object.values(TagTypes)}
                        onDrop={handleDrop}
                        context={{ siblingNodes: [] }}
                      ></SlotNode>
                    </>
                  )}
                </>
              );
            }}
          />
        </div>
      </div>
    </>
  );
};
