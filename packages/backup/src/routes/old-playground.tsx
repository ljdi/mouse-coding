import { createRoute } from "@tanstack/react-router";
import { FC, useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  VscClose,
  VscDebug,
  VscFile,
  VscGithub,
  VscLayoutSidebarLeft,
  VscLayoutSidebarLeftOff,
  VscLayoutSidebarRight,
  VscLayoutSidebarRightOff,
  VscSearch,
  VscSettingsGear,
} from "react-icons/vsc";

import rootRoute from "./__root";

type SidebarType = "explorer" | "search" | "git" | "debug" | "extensions";

const Playground: FC = () => {
  const [activeSidebar, setActiveSidebar] = useState<SidebarType | null>(
    "explorer",
  );
  const [isPrimarySidebarOpen, setIsPrimarySidebarOpen] = useState(true);
  const [isSecondarySidebarOpen, setIsSecondarySidebarOpen] = useState(true);
  const [primaryWidth, setPrimaryWidth] = useState<number | undefined>(
    undefined,
  );
  const [secondaryWidth, setSecondaryWidth] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    if (primaryWidth) {
      document.documentElement.style.setProperty(
        "--primary-sidebar-width",
        `${primaryWidth}px`,
      );
    }
  }, [primaryWidth]);

  const [{ canDragPrimarySidebar }, primaryDrag] = useDrag(() => ({
    type: "SIDEBAR_RESIZE",
    collect: (monitor) => ({
      isDraggingPrimary: monitor.isDragging(),
      canDragPrimarySidebar: monitor.canDrag(),
    }),
  }));

  const [{ isDraggingSecondary }, secondaryDrag] = useDrag(() => ({
    type: "SIDEBAR_RESIZE",
    collect: (monitor) => ({
      isDraggingSecondary: monitor.isDragging(),
      canDrag: monitor.canDrag(),
    }),
  }));

  const [, primaryDrop] = useDrop(() => ({
    accept: "SIDEBAR_RESIZE",
    hover: (_, monitor) => {
      const clientOffset = monitor.getClientOffset();
      console.log("-----", clientOffset);
      if (clientOffset) {
        const newWidth = clientOffset.x;
        if (newWidth < 128) {
          // setIsPrimarySidebarOpen(false)
        } else {
          setPrimaryWidth(newWidth);
          setIsPrimarySidebarOpen(true);
        }
      }
    },
  }));

  const [, secondaryDrop] = useDrop(() => ({
    accept: "SIDEBAR_RESIZE",
    hover: (_, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (clientOffset) {
        const newWidth = window.innerWidth - clientOffset.x;
        if (newWidth < 128) {
          setIsSecondarySidebarOpen(false);
        } else {
          setSecondaryWidth(newWidth);
          setIsSecondarySidebarOpen(true);
        }
      }
    },
  }));

  const handlePrimarySidebarToggle = (type: SidebarType) => {
    setActiveSidebar(type);
    setIsPrimarySidebarOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-300 overflow-hidden">
      {/* 顶部工具栏 */}
      <div className="h-10 bg-gray-800 flex items-center justify-between px-4 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <span className="text-sm">VS Code Like Layout</span>
        </div>

        {/* 侧边栏控制按钮组 */}
        <div className="flex items-center space-x-3">
          {/* Primary Sidebar 切换按钮 */}
          <button
            className="p-1 hover:bg-gray-700 rounded"
            onClick={() => setIsPrimarySidebarOpen(!isPrimarySidebarOpen)}
          >
            {isPrimarySidebarOpen ? (
              <VscLayoutSidebarLeft className="w-5 h-5" />
            ) : (
              <VscLayoutSidebarLeftOff className="w-5 h-5" />
            )}
          </button>

          {/* Secondary Sidebar 切换按钮 */}
          <button
            className="p-1 hover:bg-gray-700 rounded"
            onClick={() => setIsSecondarySidebarOpen(!isSecondarySidebarOpen)}
          >
            {isSecondarySidebarOpen ? (
              <VscLayoutSidebarRight className="w-5 h-5" />
            ) : (
              <VscLayoutSidebarRightOff className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        <div className="flex flex-col w-12 bg-gray-800 border-r border-gray-700 flex-none z-10">
          <div className="flex flex-col items-center py-3 space-y-2">
            <div
              className={`w-full p-3 hover:bg-gray-700 ${activeSidebar === "explorer" ? "text-white bg-gray-700" : "text-gray-400"}`}
              onClick={() => handlePrimarySidebarToggle("explorer")}
            >
              <VscFile className="w-6 h-6 mx-auto" />
            </div>
            <div
              className={`w-full p-3 hover:bg-gray-700 ${activeSidebar === "search" ? "text-white bg-gray-700" : "text-gray-400"}`}
              onClick={() => setActiveSidebar("search")}
            >
              <VscSearch className="w-6 h-6 mx-auto" />
            </div>
            <div
              className={`w-full p-3 hover:bg-gray-700 ${activeSidebar === "git" ? "text-white bg-gray-700" : "text-gray-400"}`}
              onClick={() => setActiveSidebar("git")}
            >
              <VscGithub className="w-6 h-6 mx-auto" />
            </div>
            <div
              className={`w-full p-3 hover:bg-gray-700 ${activeSidebar === "debug" ? "text-white bg-gray-700" : "text-gray-400"}`}
              onClick={() => setActiveSidebar("debug")}
            >
              <VscDebug className="w-6 h-6 mx-auto" />
            </div>
            <div className="flex-1" />
            <div
              className={`w-full p-3 hover:bg-gray-700 ${activeSidebar === "extensions" ? "text-white bg-gray-700" : "text-gray-400"}`}
              onClick={() => setActiveSidebar("extensions")}
            >
              <VscSettingsGear className="w-6 h-6 mx-auto" />
            </div>
          </div>
        </div>

        {/* Primary Sidebar */}
        <div
          className={`bg-gray-800 border-r border-gray-700 transform transition-width h-full relative ${canDragPrimarySidebar ? "duration-200" : ""} ${isPrimarySidebarOpen ? (primaryWidth === undefined ? "w-64" : "w-(--primary-sidebar-width)") : "w-0"}`}
        >
          {isPrimarySidebarOpen && (
            <div
              ref={primaryDrag}
              className="absolute -right-0.5 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500 z-20"
            />
          )}
          <div
            ref={primaryDrop}
            className={`${primaryWidth === undefined ? "w-64" : "w-(--primary-sidebar-width)"} transform transition-transform h-full absolute left-0 ${isPrimarySidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex items-center justify-between p-3 border-b border-gray-700">
              <h3 className="font-semibold uppercase">{activeSidebar}</h3>
            </div>
            <div className="p-2">
              {activeSidebar === "explorer" && <FileExplorer />}
              {activeSidebar === "search" && <SearchPanel />}
              {/* 其他面板内容... */}
            </div>
          </div>
        </div>

        {/* Content Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between bg-gray-800 border-b border-gray-700">
            <div className="flex">
              <div className="px-4 py-2 border-r border-gray-700 text-gray-400 hover:bg-gray-700 cursor-pointer">
                index.tsx
              </div>
              <div className="px-4 py-2 text-gray-400 hover:bg-gray-700 cursor-pointer">
                styles.css
              </div>
            </div>
            {/* 次级侧边栏控制按钮 */}
            <div
              className="p-2 mr-2 hover:bg-gray-700 rounded cursor-pointer"
              onClick={() => setIsSecondarySidebarOpen(!isSecondarySidebarOpen)}
            >
              <VscClose className="w-5 h-5 transform rotate-45" />
            </div>
          </div>
          <div className="flex-1 bg-gray-900 p-4">{/* Editor Content */}</div>
        </div>

        {/* Secondary Sidebar */}
        <div
          className={`bg-gray-800 border-l border-gray-700 transform transition-width h-full relative ${isDraggingSecondary ? "" : "duration-200"} ${isSecondarySidebarOpen ? (secondaryWidth === undefined ? "w-64" : "w-[" + secondaryWidth + "px]") : "w-0"}`}
        >
          {isSecondarySidebarOpen && (
            <div
              ref={secondaryDrag}
              className="absolute -left-0.5 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500 z-20"
            />
          )}
          <div
            ref={secondaryDrop}
            className={`${secondaryWidth === undefined ? "w-64" : "w-[" + secondaryWidth + "px]"} transform transition-transform ${isSecondarySidebarOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="flex items-center justify-between p-3 border-b border-gray-700">
              <h3 className="font-semibold">OUTLINE</h3>
            </div>
            <div className="p-2">{/* Outline Content */}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 示例侧边栏组件
const FileExplorer = () => (
  <div className="space-y-1">
    <div className="flex items-center p-1 hover:bg-gray-700 rounded cursor-pointer">
      <span className="mr-2">📁</span>
      src
    </div>
    <div className="ml-4 space-y-1">
      <div className="flex items-center p-1 hover:bg-gray-700 rounded cursor-pointer">
        <span className="mr-2">📄</span>
        App.tsx
      </div>
      <div className="flex items-center p-1 hover:bg-gray-700 rounded cursor-pointer">
        <span className="mr-2">📄</span>
        styles.css
      </div>
    </div>
  </div>
);

const SearchPanel = () => (
  <div className="p-2">
    <input
      className="w-full px-2 py-1 bg-gray-900 border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      placeholder="Search files..."
      type="text"
    />
  </div>
);

const PlaygroundWithDnd = () => (
  <DndProvider backend={HTML5Backend}>
    <Playground />
  </DndProvider>
);

export default createRoute({
  getParentRoute: () => rootRoute,
  path: "/playground",
  component: PlaygroundWithDnd,
});
