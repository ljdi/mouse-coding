# Mouse Coding

Mouse Coding是一个轻量级的个人Sidecar项目，提供纯浏览器端的低代码Web开发平台体验。通过直观的界面帮助用户快速构建网页应用，无需搭建复杂的开发环境，您可以直接在浏览器中编辑和实时预览

### 界面组件
- **Tab页系统**：多文件管理与导航
- **文件树**：项目文件结构展示与管理
- **侧边栏视图**：文件浏览器、搜索、Git、包管理
- **面板分组**：可调整大小、折叠的面板*目前处于初期开发阶段**，基础功能仍在持续构建中。

## 主要特点

- **零环境配置**：告别繁琐的环境搭建，直接在浏览器中进行开发
- **实时预览**：所见即所得的编辑体验，立即查看更改效果
- **浏览器存储**：所有数据保存在浏览器的IndexedDB中
- **本地优先**：数据优先存储在本地，确保隐私和性能
- **独立运行**：无需登录账号，即开即用
- **专注前端开发**：主要支持纯HTML+CSS+JS和React项目

> **注意**：由于代码在浏览器环境中执行，某些依赖Node.js底层API或原生模块的包可能不兼容。我们提供了大多数常用包的浏览器兼容版本，并在不断扩展兼容性范围。

## 关于项目

Mouse Coding 是一个个人 Sidecar 项目，专注于提供简单易用的浏览器内低代码开发体验。

### 当前开发阶段
- **初期开发阶段**：核心功能仍在构建中

### 功能模块梳理

Mouse Coding 项目主要分为两大部分：**前端页面部分**和**功能核心部分**。

#### 前端页面部分

1. **Dashboard页面**
   - 项目管理（列表、新增、删除、重命名）
   - 项目导入/导出
   - 简易项目预览

2. **Playground页面**（类VSCode布局）
   - **左侧边栏**（Tab切换式）
     - 文件树浏览器
     - 搜索功能
     - Git管理（计划中）
     - 包管理面板
   - **右侧区域**
     - 多标签页编辑器
     - 两种编辑模式：
       - **代码模式**：传统代码编辑
       - **NoCode模式**：可视化编辑

#### 功能核心部分

1. **文件系统层**
   - 基于ZenFS的浏览器文件系统
   - IndexedDB底层存储
   - 虚拟文件系统API（类似Node.js fs模块）

2. **工作空间管理**
   - 项目创建/加载/卸载
   - 项目配置管理
   - 项目元数据处理

3. **包管理模块**
   - 项目依赖初始化
   - 包下载与解压（浏览器内）
   - package.json管理
   - 依赖解析

4. **编译与构建模块**
   - SWC代码编译（WebAssembly版本）
   - Rollup模块打包（WebAssembly版本）
   - 浏览器内包解析系统
   - 资源优化

5. **编辑器引擎**
   - HTML可视化编辑（树形拖拽 + 属性表单）
   - CSS二级树结构编辑
   - JavaScript流程图可视化
   - 代码编辑器核心

6. **预览与调试**
   - 实时预览
   - 基本调试功能
   - 控制台输出捕获

#### 跨模块功能

- **数据持久化**：浏览器IndexedDB存储
- **云同步**：未来计划接入第三方对象存储
- **可扩展性**：计划支持插件系统
- **主题与UI**：自定义界面风格

### 支持的项目类型
- ✅ 纯HTML+CSS+JavaScript项目
- ✅ React项目（计划支持）
- ⚠️ Vue项目（可能在未来支持，SFC文件解析尚在研究中）
- ❌ Express/Koa等服务端项目（由于浏览器无法开启端口提供服务，不计划支持）

### 未来计划
- 接入第三方对象存储（如 AWS S3、阿里云 OSS 等）实现数据云端同步
- 提供项目导出/导入功能
- 增加自定义主题和布局
- 完善React项目支持
- 研究Vue项目支持可能性

## 技术栈概览

### 核心依赖

| 功能模块 | 使用的库 | 状态 |
|---------|---------|------|
| Tab页 | `react-tabs` | ✅ 已实现 |
| HTML元素树 | `react-complex-tree` | 🚧 进行中 |
| 属性面板数据 | `@webref/elements`<br/>`@webref/css`<br/>`@webref/idl`<br/>`@mdn/browser-compat-data` | 🚧 进行中 |
| 文件系统 | `zenfs` | 🚧 进行中 |
| JS编译器 | `@swc/wasm-web` | 🚧 进行中 |
| 打包工具 | `@rollup/wasm` | 🚧 进行中 |
| CSS类列表 | `tailwindcss` | 🕒 计划中 |
| JS流程图 | `@xyflow/react` | 🕒 计划中 |
| JS代码块预设 | 自定义组件 | 🕒 计划中 |
| JS属性展示 | `react-json-tree` | 🕒 计划中 |
| 错误堆栈解析 | `Error.stack` 或 `stacktrace-parser` | 🕒 计划中 |

## 核心功能

### 界面组件
- **Tab页系统**：多文件管理与导航
- **文件树**：项目文件结构展示与管理

### 可视化编辑器
- **HTML编辑器**
  - 元素树可视化管理（基于树形图拖拽）
  - 面包屑导航展示元素层级关系
  - 智能元素属性面板（自定义表单）
  - class属性选择器预设TailwindCSS样式
  - 事件绑定管理
- **CSS编辑器**
  - 二级树形结构展示（选择器 > 属性）
  - 属性面板，提供智能属性值建议
  - 实时样式预览
- **JavaScript编辑器**
  - 流程图可视化代码逻辑
  - 预设基础代码块（可拖拽组合）
  - 函数测试：输入/输出动态测试
  - 代码片段管理与分享功能（计划中）
  - 异步流程展示（研究中）
- **专业编辑器**
  - JSON编辑与验证
  - Markdown编辑与预览

### 浏览器环境
- **虚拟文件系统**：基于ZenFS实现，模拟完整的文件操作体验
- **本地数据存储**：所有项目数据保存在浏览器的IndexedDB中
- **浏览器端依赖管理**：无需本地安装即可使用部分前端npm包
- **实时渲染预览**：立即查看前端代码效果
- **浏览器端编译打包**：使用SWC和Rollup的WebAssembly版本在浏览器中实现编译打包功能
- **低代码编辑体验**：结合可视化编辑和代码编辑
- **未来云存储支持**：计划接入第三方对象存储（如AWS S3、阿里云OSS等），实现跨设备访问

### 兼容性和限制
| 功能 | 兼容状态 | 备注 |
|------|---------|------|
| HTML+CSS+JS项目 | ✅ 计划完全支持 | 开发中，优先实现 |
| React 项目 | 🚧 开发中 | 计划支持热更新和组件预览 |
| Vue 项目 | 🕒 未来可能支持 | 需要解决SFC文件解析问题 |
| JS/TS编译 | ✅ 支持 | 使用SWC WebAssembly版本在浏览器中编译 |
| 代码打包 | ✅ 支持 | 使用Rollup WebAssembly版本处理模块打包 |
| TailwindCSS | 🚧 测试中 | 验证浏览器端编译可行性 |
| 代码块预设 | 🕒 计划中 | 提供常用JS代码块，支持拖拽组合 |
| 文件系统 | ✅ 支持 | 使用ZenFS基于IndexedDB实现 |
| Node.js API | ⚠️ 非常有限 | 仅模拟少量必要模块，如fs、path |
| Express/Koa 服务 | ❌ 不支持 | 浏览器无法启动服务器或开放端口 |
| 数据存储 | ✅ 支持 | 使用浏览器IndexedDB，未来将支持云存储 |
| 原生模块 | ❌ 不支持 | 依赖编译的原生模块无法在浏览器中使用 |
| 纯前端框架 | ✅ 优先支持 | 专注于纯前端项目开发 |

## 项目进度

### 系统基础
- [ ] 文件系统初始化与错误处理

### 用户界面
- 😊 **Dashboard**
  - [x] 创建项目
  - [ ] 项目列表展示
  - [ ] 项目打开功能

### 项目管理
- [ ] 项目删除
- [ ] 项目重命名

### 工作区功能
- [ ] 工作区初始化
- [ ] 文件读写功能

### Playground功能

#### 文件管理
- [ ] **文件树**
  - [ ] 新建文件/文件夹
  - [ ] 删除文件/文件夹
  - [ ] 重命名文件/文件夹
  - [ ] 移动文件/文件夹
  - [ ] 复制/粘贴文件/文件夹
  - [ ] 切换到已有标签页
  - [ ] 在新标签页打开

#### 标签页管理
- [ ] **标签系统**
  - [ ] 关闭标签
  - [ ] 关闭所有标签
  - [ ] 关闭其他标签
  - [ ] 切换标签

#### 编辑器
- [ ] **代码视图**
  - [ ] 编辑器锁定/解锁功能
  - [ ] 根据文件类型高亮语法

- [ ] **可视化视图**
  - [ ] **HTML编辑**
    - [ ] 元素树操作（添加/删除/更新/移动/复制/粘贴元素）
    - [ ] 属性面板（添加/删除属性）
  - [ ] **CSS编辑**
    - [ ] 样式块操作（添加/删除/更新样式块）
    - [ ] 样式属性（添加/删除/更新属性）
  - [ ] **JavaScript编辑**
    - [ ] 流程图功能
      - [ ] 输入/输出节点设置
      - [ ] 节点操作（添加/删除/更新/复制/粘贴）
      - [ ] 函数式子流程
      - [ ] 视图设置（简洁/详细模式）
  - [ ] **专业编辑**
    - [ ] JSON编辑器
    - [ ] Markdown编辑器

## 系统架构图

```mermaid
flowchart LR
  %% 主要模块定义与样式
  classDef dashboard fill:#f9d5e5,stroke:#333,stroke-width:1px
  classDef workspace fill:#d0ffef,stroke:#333,stroke-width:1px
  classDef playground fill:#fff9c4,stroke:#333,stroke-width:1px
  classDef fileSystem fill:#bbdefb,stroke:#333,stroke-width:1px

  %% 仪表板模块
  A[Dashboard] :::dashboard
    A --> AA[创建项目]
    A --> AB[项目列表]
    A --> B[项目管理]

  %% 项目管理模块
  B --> BA[重命名]
  B --> BB[删除]
  B --> BC[初始化] --> |调用| DAA
  B --> C[Playground]

  %% Playground模块
  C :::playground
  C --> CA[主侧边栏]
  C --> CB[次侧边栏]
  C --> CC[标签页系统]
  C --> CD[编辑器]

  %% 侧边栏模块
  CA --> CAA[文件浏览器]
  CA --> CAB[搜索功能]
  CB --> CBA[HTML属性面板]
  CB --> CBB[JavaScript代码片段]
  CB --> CBC[CSS属性面板]

  %% 编辑器模块
  CD --> CDA[代码视图]
  CD --> CDB[可视化视图]
  CAA --> CAAA[文件树] --> |调用| DEA
  CDA --> CDAA[HTML元素树视图]
  CDA --> CDAB[JavaScript流程图]
  CDA --> CDAC[CSS样式块视图]

  %% 工作区模块
  D[工作区] :::workspace
    D --> DA[包管理器]
    D --> DB[编译器]
    D --> DC[构建工具]
    D --> DD[Git集成]
    D --> DE[文件系统]

  %% 包管理器模块
  DA --> DAA[初始化项目] --> |调用| DEC
  DA --> DAB[包管理操作] --> |调用| DEC
  DA --> DAC[package.json管理]

  %% 编译器模块
  DB --> DBA[代码转换] --> |基于| DBX[SWC WebAssembly]
  DB --> DBB[代码解析]

  %% 构建工具模块
  DC --> DCA[打包构建] --> |基于| DCX[Rollup WebAssembly]
  DC --> DCB[资源优化]

  %% 文件系统详情
  DE :::fileSystem
  DE --> DEA[文件列表]
  DE --> DEB[文件读取]
  DE --> DEC[文件写入]
  DE --> DED[文件链接]
  DE --> DEZ[ZenFS实现] --> |基于| DEI[IndexedDB]

  %% 文件系统模块
  DE :::fileSystem
  DE --> DEA[文件列表]
  DE --> DEB[文件读取]
  DE --> DEC[文件写入]
  DE --> DED[文件链接]
  DAC --> |调用| DEB
  DAC --> |调用| DEC
```

## 安装与使用

### 在线使用（推荐）

直接访问在线平台，无需安装任何软件（注意：当前处于初期开发阶段）：

1. 打开浏览器访问 [https://mc.ljdi.dev](https://mc.ljdi.dev)
2. 创建新的前端项目（HTML+CSS+JS或React）或导入已有前端项目
3. 开始在线低代码开发和实时预览
4. 使用代码视图或NoCode视图编辑项目文件
5. 项目数据会自动保存在浏览器的IndexedDB中
6. 重要数据请定期导出备份，后期将支持第三方对象存储云同步

支持的浏览器：
- Chrome / Edge（推荐，完整功能支持）
- Firefox（最新三个版本）
- Safari（版本 15 及以上）

### 本地部署（开发者选项）

如果您希望在本地部署或二次开发本项目：

#### 前提条件
- Node.js 22.x 或更高版本
- npm 10.x 或更高版本

#### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/yourusername/mouse-coding.git
cd mouse-coding

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 项目结构

```
mouse-coding/
├── apps/                 # 应用目录
│   └── web/              # Web应用前端
│       ├── app/          # Next.js应用页面
│       │   ├── dashboard/# Dashboard页面 - 项目管理
│       │   └── [projectName]/ # Playground页面 - 项目编辑器
│       └── components/   # React组件
│           ├── layout/   # 布局组件
│           │   ├── dashboard.tsx # Dashboard布局
│           │   └── playground.tsx # Playground布局
│           ├── editor.tsx      # 编辑器核心
│           ├── html-editor.tsx # HTML可视化编辑器
│           ├── js-editor.tsx   # JavaScript可视化编辑器
│           └── ...
├── packages/             # 共享包
│   ├── bundler/          # 打包工具 - Rollup WebAssembly封装
│   ├── config/           # 配置文件
│   ├── shared/           # 共享代码
│   │   └── src/
│   │       ├── lib/      # 通用库
│   │       │   └── package-manager.ts # 包管理器实现
│   │       └── utils/
│   │           ├── fs.ts # 文件系统工具
│   │           └── project.ts # 项目管理工具
│   ├── store/            # 状态管理
│   │   └── src/slices/
│   │       ├── fs-slice.ts    # 文件系统状态
│   │       ├── editor-slice.ts # 编辑器状态
│   │       └── ...
│   └── ui/               # UI组件库
```

#### 核心模块职责

**前端页面模块**:
- `app/dashboard/*`: 负责项目列表管理界面
- `app/[projectName]/*`: 负责项目编辑器界面
- `components/editor.tsx`: 主编辑器组件，切换代码/NoCode模式
- `components/sidebar-view-*.tsx`: 侧边栏不同视图实现

**功能核心模块**:
- `packages/bundler/`: 基于Rollup的浏览器内打包系统
- `packages/shared/src/utils/fs.ts`: 文件系统抽象层
- `packages/shared/src/lib/package-manager.ts`: 包管理器实现
- `packages/store/src/slices/fs-slice.ts`: 文件系统状态管理

## 帮助改进

作为个人维护的 Sidecar 项目，欢迎各种改进建议和贡献！

### 提交反馈
- 在 GitHub Issues 中报告问题或提出功能请求
- 通过 [个人网站](https://ljdi.dev) 联系我

### 贡献代码
如果您希望为项目做出贡献：

1. Fork本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m '添加一些令人惊叹的功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个Pull Request

作为个人项目，合并请求的审核可能需要一些时间，感谢您的耐心等待！

## 许可证

该项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件
