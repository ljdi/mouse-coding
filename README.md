## 依赖包

- tab 页：react-tabs
- html 元素树：react-complex-tree
- html 和 css 属性面板表单数据：使用 @webref/elements @webref/css @webref/idl @mdn/browser-compat-data (mdn-data 仓库说快要弃用了 2025-03-04)
  - *LATER* tailwindcss 类列表
- *LATER* js 流程：@xyflow/react
- *LATER* js 属性展示：react-json-tree
- *LATER* 获取错误堆栈：Error 实例的 stack 属性或者使用 stacktrace-parser 库

## 功能点

- tab页
- html js css 可视化编辑器
  - html 元素树
    - 选中的元素使用面包屑展示父级元素列表
  - html 元素属性编辑
    - 根据选中的元素展示可选属性列表
    - 根据选中的元素展示可选事件列表
  - css 属性编辑
    - 根据选择的css属性选择可选的值
  - js 代码编辑
    - 使用流程图可视化展示代码流程
