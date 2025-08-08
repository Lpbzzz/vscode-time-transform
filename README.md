# Time Transform - VS Code 时间转换插件

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/lpbzzz/vscode-time-transform)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.88.0+-blue.svg)](https://code.visualstudio.com/)

一个强大的 VS Code 扩展，用于在时间戳和日期字符串之间进行智能转换。支持秒级和毫秒级时间戳，提供右键菜单快速转换功能。

## ✨ 功能特性

- 🔄 **双向转换**：时间戳 ↔ 日期字符串
- 🧠 **智能识别**：自动检测输入类型（时间戳或日期字符串）
- ⏱️ **多格式支持**：
  - 10位秒级时间戳（如：1640995200）
  - 13位毫秒级时间戳（如：1640995200000）
  - 标准日期格式（如：2022-01-01 08:00:00）
- 🖱️ **右键菜单**：选中文本后右键即可转换
- 🛡️ **安全边界**：支持时间范围 1970-2038 年
- 📝 **即时替换**：转换结果直接替换选中文本
- 💡 **友好提示**：详细的错误信息和成功提示

## 🚀 安装方法

### 方法一：VS Code 市场安装

1. 打开 VS Code
2. 按 `Ctrl+Shift+X`（Windows/Linux）或 `Cmd+Shift+X`（macOS）打开扩展面板
3. 搜索 "time-transform"
4. 点击 "安装" 按钮

### 方法二：命令行安装

```bash
code --install-extension liupengbo.time-transform
```

### 方法三：手动安装

1. 从 [Releases](https://github.com/lpbzzz/vscode-time-transform/releases) 下载最新的 `.vsix` 文件
2. 在 VS Code 中按 `Ctrl+Shift+P`（Windows/Linux）或 `Cmd+Shift+P`（macOS）
3. 输入 "Extensions: Install from VSIX..."
4. 选择下载的 `.vsix` 文件

## 📖 使用方法

### 基本使用

1. **选择文本**：在编辑器中选中要转换的时间戳或日期字符串
2. **右键转换**：右键点击选中文本，选择 "时间转换"
3. **查看结果**：转换结果会自动替换选中的文本

### 支持的转换示例

#### 时间戳 → 日期字符串

```
输入：1640995200
输出：2022-01-01 08:00:00

输入：1640995200000
输出：2022-01-01 08:00:00
```

#### 日期字符串 → 时间戳

```
输入：2022-01-01 08:00:00
输出：1640995200000

输入：2022/01/01 08:00:00
输出：1640995200000
```

### 快捷键

- **命令面板**：`Ctrl+Shift+P` → 输入 "时间转换"
- **右键菜单**：选中文本后右键点击

## 🛠️ 开发环境

### 环境要求

- **Node.js**: >= 18.x
- **VS Code**: >= 1.88.0
- **包管理器**: pnpm（推荐）或 npm

### 技术栈

- **TypeScript**: 类型安全的 JavaScript
- **dayjs**: 轻量级日期处理库
- **Webpack**: 模块打包工具
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Mocha**: 单元测试框架

### 本地开发

1. **克隆仓库**
   ```bash
   git clone https://github.com/lpbzzz/vscode-time-transform.git
   cd vscode-time-transform
   ```

2. **安装依赖**
   ```bash
   pnpm install
   # 或者
   npm install
   ```

3. **开发模式**
   ```bash
   pnpm run dev
   # 或者
   npm run dev
   ```

4. **调试扩展**
   - 按 `F5` 启动调试
   - 在新窗口中测试扩展功能

### 构建和测试

```bash
# 类型检查
pnpm run typecheck

# 代码检查
pnpm run lint

# 代码格式化
pnpm run format

# 运行测试
pnpm run test

# 完整检查
pnpm run check

# 生产构建
pnpm run build:prod

# 打包扩展
pnpm run package
```

## 📁 项目结构

```
vscode-time-transform/
├── src/
│   ├── extension.ts          # 主扩展文件
│   └── test/
│       └── extension.test.ts # 单元测试
├── dist/                     # 构建输出目录
├── .vscode/                  # VS Code 配置
├── package.json              # 项目配置
├── tsconfig.json            # TypeScript 配置
├── webpack.config.js        # Webpack 配置
├── .eslintrc.json          # ESLint 配置
├── .prettierrc.json        # Prettier 配置
└── README.md               # 项目文档
```

## 🧪 测试

项目包含完整的单元测试，覆盖所有核心功能：

- ✅ 时间戳检测和验证
- ✅ 日期字符串解析
- ✅ 边界条件处理
- ✅ 错误情况处理
- ✅ 格式转换准确性

运行测试：

```bash
# 运行所有测试
pnpm run test

# 监听模式运行测试
pnpm run test:watch
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. **Fork** 本仓库
2. **创建特性分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **创建 Pull Request**

### 开发规范

- 遵循现有的代码风格
- 添加适当的测试用例
- 更新相关文档
- 确保所有测试通过
- 提交信息要清晰明确

### 报告问题

如果您发现了 bug 或有功能建议，请：

1. 检查 [Issues](https://github.com/lpbzzz/vscode-time-transform/issues) 中是否已有相关问题
2. 如果没有，请创建新的 Issue
3. 提供详细的问题描述和复现步骤

## 📋 更新日志

### v0.1.0 (2024-01-XX)

- 🎉 首次发布
- ✨ 支持时间戳和日期字符串双向转换
- 🖱️ 添加右键菜单快速转换
- 🧠 智能识别输入类型
- 🛡️ 完善的边界检查和错误处理
- 🧪 完整的单元测试覆盖

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

## 🙏 致谢

- [dayjs](https://day.js.org/) - 优秀的日期处理库
- [VS Code Extension API](https://code.visualstudio.com/api) - 强大的扩展开发平台

## 📞 联系方式

- **GitHub**: [lpbzzz](https://github.com/lpbzzz)
- **Issues**: [项目问题反馈](https://github.com/lpbzzz/vscode-time-transform/issues)

---

如果这个扩展对您有帮助，请给个 ⭐️ 支持一下！
