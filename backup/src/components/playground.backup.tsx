import { CodeViewer } from "@/components/code-viewer";
import { MaxLengthSelector } from "@/components/maxlength-selector";
import { PresetActions } from "@/components/preset-actions";
import { PresetSave } from "@/components/preset-save";
import { PresetSelector } from "@/components/preset-selector";
import { PresetShare } from "@/components/preset-share";
import { TagList } from "@/components/tag";
import { TemperatureSelector } from "@/components/temperature-selector";
import { jsx } from "@/constant/code";
import { DndStoreProvider } from "@/providers/dnd-store-provider";
import builderStore from "@/stores/builder-store";
import projectStore from "@/stores/project-store";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";
import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaRegCopy } from "react-icons/fa";
import { IoIosGitBranch } from "react-icons/io";
import { PiTreeViewLight } from "react-icons/pi";
import { useStore } from "zustand";
import { presets } from "../data/presets";

/* export const Route = createFileRoute('/playground/backup')({
  component: Playground
}) */
function Playground() {
  const [srcdoc, setSrcdoc] = useState("");
  const ref = useRef<HTMLIFrameElement>(null);
  const { parseSync, printSync, transformSync, build } = useStore(
    builderStore,
    (state) => state,
  );
  const {
    getActiveProjectPath,
    // loadProject,
    addDependency,
    listDependencies,
    createFile,
    packageManagerInit: initProject,
  } = useStore(projectStore, (state) => state);

  const handleCreateFile = async () => {
    console.log(getActiveProjectPath());
    await createFile("src", "main.jsx", jsx);
  };

  const handleAddPackage = async () => {
    await addDependency("react");
    await addDependency("react-dom");
  };
  const listPackages = async () => console.log(await listDependencies());

  const compile = async () => {
    const ast = parseSync(jsx);

    console.log(ast);

    // ast.body[1].identifier.value = "Fooooooo";
    const { code } = printSync("main.jsx", ast);
    console.log(code);
    const result = transformSync("main.jsx", code);
    console.log(result);
  };

  const builder = async () => {
    const source = await build("./src/main.jsx");

    setSrcdoc(source);
  };

  return (
    <>
      <div className="container mx-auto h-full flex-col md:flex">
        {/* header */}
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <h2 className="text-lg font-semibold">Playground</h2>
          <div className="ml-auto flex w-full space-x-2 sm:justify-end">
            <PresetSelector presets={presets} />
            <PresetSave />
            <div className="space-x-2 md:flex">
              <CodeViewer />
              <PresetShare />
            </div>
            <PresetActions />
          </div>
        </div>
        <Separator />
        {/* body */}
        <DndStoreProvider>
          <DndProvider backend={HTML5Backend}>
            <Tabs defaultValue="complete" className="flex-1">
              <div className="container h-full py-6">
                <div className="grid h-full items-stretch gap-6 md:grid-cols-[200px_1fr]">
                  <div className="flex-col space-y-4 sm:flex">
                    <div className="grid gap-2">
                      <TabsList className="grid grid-cols-3">
                        <TabsTrigger value="complete">
                          <span className="sr-only">Tree</span>
                          <PiTreeViewLight />
                        </TabsTrigger>
                        <TabsTrigger value="insert">
                          <span className="sr-only">Explorer</span>
                          <FaRegCopy />
                        </TabsTrigger>
                        <TabsTrigger value="edit">
                          <span className="sr-only">Source Control</span>
                          <IoIosGitBranch />
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    <div className="">
                      <TabsContent
                        value="complete"
                        className="mt-0 border-0 p-0"
                      >
                        <TagList />
                      </TabsContent>
                      <TabsContent value="insert" className="mt-0 border-0 p-0">
                        <TemperatureSelector defaultValue={[0.56]} />
                      </TabsContent>
                      <TabsContent value="edit" className="mt-0 border-0 p-0">
                        <MaxLengthSelector defaultValue={[256]} />
                      </TabsContent>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-4">
                    {/* ast viewer */}
                    <div className="grid h-full gap-6 lg:grid-cols-2">
                      <div className="flex flex-col space-y-4">
                        <div className="flex flex-1 flex-col space-y-2">
                          <Label htmlFor="input">Input</Label>

                          {/* <AstViewer></AstViewer> */}
                        </div>
                      </div>
                      <div className="mt-[21px] min-h-[400px] rounded-md border bg-muted lg:min-h-[700px]">
                        <iframe
                          srcDoc={srcdoc}
                          width={500}
                          height={500}
                          ref={ref}
                        />
                      </div>
                    </div>
                    {/* preview */}
                    <div className="flex items-center space-x-2">
                      <Button onClick={initProject}>Init Project</Button>
                      <Button onClick={compile}>Compiler</Button>
                      <Button onClick={builder}>Bundle</Button>
                      <Button onClick={handleCreateFile}>Create File</Button>
                      <Button onClick={handleAddPackage}>Add Package</Button>
                      <Button onClick={listPackages}>List Packages</Button>
                      <Button variant="secondary">
                        <span className="sr-only">Show history</span>
                        <CounterClockwiseClockIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Tabs>
          </DndProvider>
        </DndStoreProvider>
      </div>
    </>
  );
}
