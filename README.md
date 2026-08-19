# dsh-timestamp · 时间戳转换

Unix 时间戳 ↔ ISO 8601 ↔ 相对时间互转，获取当前时间。纯 Node 实现。

## 提供的工具

| 工具 | 作用 |
|---|---|
| `timestamp_convert` | 时间戳/ISO/相对时间互转 |
| `timestamp_now` | 当前时间戳 |

## 安装

```bash
dsh plugin add dsh-timestamp
```
安装后在 profile 的 `package.json` 的 `dsh.profile.bundles` 中加入 `"dsh-timestamp"`。

## 用法示例

```
1700000000 这个时间戳是什么时候
→ 调用 timestamp_convert(value=1700000000)
```

## 安装

```bash
dsh plugin add github:uckkk/dsh-timestamp
```

> 安装即在本机运行第三方代码，请自行审阅源码。

## 安装

```bash
dsh plugin add github:uckkk/dsh-timestamp
```

## 使用

安装后在会话中调用该插件注册的工具即可。
