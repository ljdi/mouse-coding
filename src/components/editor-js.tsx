import { useEffect } from 'react'
import ts from 'typescript'

export const EditorViewJs = () => {
  useEffect(() => {
    // const tsCode = 'let num: number = 123;'
    console.log('currentDirectory', ts.sys.newLine)
    const originalCode = 'const greet = (name: string) => "Hello " + name;'
    const ast = getAST(originalCode)
    console.log('ast', ast)
    const modifiedAST = transformAST(ast)
    const generatedCode = generateCode(modifiedAST)
    console.log('generateCode', generatedCode)
    const jsCode = ts.transpile(generatedCode)
    console.log('jsCode', jsCode)
  }, [])

  return <div>js-graph</div>
}

function getAST (sourceCode: string): ts.SourceFile {
  return ts.createSourceFile(
    'temp.ts',
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  )
}

// 使用转换API 修改AST
function transformAST (ast: ts.SourceFile): ts.SourceFile {
  const transformer =
    <T extends ts.Node>(context: ts.TransformationContext) =>
      (rootNode: T) => {
        function visit (node: ts.Node): ts.Node {
        // 这里可以添加你的转换逻辑
        // 例如将所有字符串字面量改为大写
          if (ts.isStringLiteral(node)) {
            return ts.factory.createStringLiteral(node.text.toUpperCase())
          }
          return ts.visitEachChild(node, visit, context)
        }
        return ts.visitNode(rootNode, visit)
      }

  const result = ts.transform(ast, [transformer])
  return result.transformed[0] as ts.SourceFile
}

// 手动遍历和修改 修改AST
// function traverseAndModify(node: ts.Node) {
//   ts.forEachChild(node, (child) => {
//     // 处理特定节点类型
//     if (ts.isVariableDeclaration(child) && child.name.getText() === 'greet') {
//       // 修改节点逻辑
//     }
//     traverseAndModify(child)
//   })
// }

function generateCode (ast: ts.SourceFile): string {
  const printer = ts.createPrinter()
  return printer.printFile(ast)
}
