## Monaco Editor Core

仓库用于与社区版 Monaco Editor 同步发布私有类型，与社区版的区别是除了 monaco.d.ts 外会将所有 monaco-editor-core/esm 下的代码及其类型声明一同发布到 tnpm

## 发布

1. 添加 remote 到 vscode 官方仓库
2. 拉取最新代码
3. 切换到与社区版本 monaco editor 对应的 tag
4. 运行 yarn install
5. 运行 gulp editor-distro --max-old-space-size=4096, 这会将待发布的代码编译输出到 ./out-monaco-editor-core 目录下，包含了 esm/dev/min 版本，其中 esm 版本包含了所有私有 API 的类型声明
