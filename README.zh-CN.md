# CodeRabbit Pro

这是 [CodeRabbit](http://coderabbit.ai) 的旧版本，目前处于维护模式。我们建议安装
[CodeRabbit](http://coderabbit.ai) 的专业版。专业版经过全面重新设计，提供明显更
好的代码审查功能，能够从您的使用中学习并随着时间推移而改进。CodeRabbit Pro 对开
源项目是免费的。

[![Discord](https://img.shields.io/badge/加入我们的-Discord-blue?logo=discord&style=flat-square)](https://discord.gg/GsXnASn26c)

# 基于 AI 的 PR 审查与总结工具

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/github/last-commit/coderabbitai/ai-pr-reviewer/main?style=flat-square)](https://github.com/coderabbitai/ai-pr-reviewer/commits/main)

## 概述

CodeRabbit `ai-pr-reviewer` 是一个基于 OpenAI 的 `gpt-3.5-turbo` 和 `gpt-4` 模型
的 GitHub Pull Request 代码审查和总结工具。它被设计为 GitHub Action，可以配置为
在每个 Pull Request 和审查评论上运行。

## 审查功能：

- **PR 总结**：生成 Pull Request 变更的摘要和发布说明。
- **逐行代码变更建议**：逐行审查变更并提供代码修改建议。
- **持续、增量审查**：审查在 Pull Request 中的每个提交，而不是对整个 Pull
  Request 进行一次性审查。
- **成本效益和减少噪音**：通过跟踪提交之间和 Pull Request 基础之间的文件变更，增
  量审查可以节省 OpenAI 成本并减少噪音。
- **用于总结的"轻量"模型**：设计为使用"轻量"总结模型（如 `gpt-3.5-turbo`）和"重
  量级"审查模型（如 `gpt-4`）。_为获得最佳结果，使用 `gpt-4` 作为"重量级"模型，
  因为彻底的代码审查需要强大的推理能力。_
- **与机器人对话**：支持在代码行或整个文件的上下文中与机器人对话，有助于提供上下
  文、生成测试用例和减少代码复杂性。
- **智能跳过审查**：默认情况下，对于简单的变更（如拼写修正）和大部分看起来良好的
  变更会跳过深入审查。可以通过将 `review_simple_changes` 和
  `review_comment_lgtm` 设置为 `true` 来禁用此功能。
- **可定制的提示**：定制 `system_message`、`summarize` 和
  `summarize_release_notes` 提示，以专注于审查过程的特定方面，甚至更改审查目标。

要使用此工具，您需要将提供的 YAML 文件添加到您的仓库中，并配置所需的环境变量，如
`GITHUB_TOKEN` 和 `OPENAI_API_KEY`。有关使用、示例、贡献和常见问题的更多信息，请
参阅以下部分。

- [概述](#概述)
- [CodeRabbit 专业版](#coderabbit-pro)
- [审查功能](#审查功能)
- [安装说明](#安装说明)
- [与 CodeRabbit 对话](#与-coderabbit-对话)
- [示例](#示例)
- [贡献](#贡献)
- [常见问题](#常见问题)

## 安装说明

`ai-pr-reviewer` 作为 GitHub Action 运行。将以下文件添加到您的仓库中的
`.github/workflows/ai-pr-reviewer.yml`

```yaml
name: Code Review

permissions:
  contents: read
  pull-requests: write

on:
  pull_request:
  pull_request_review_comment:
    types: [created]

concurrency:
  group:
    ${{ github.repository }}-${{ github.event.number || github.head_ref ||
    github.sha }}-${{ github.workflow }}-${{ github.event_name ==
    'pull_request_review_comment' && 'pr_comment' || 'pr' }}
  cancel-in-progress: ${{ github.event_name != 'pull_request_review_comment' }}

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: coderabbitai/ai-pr-reviewer@latest
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        with:
          debug: false
          review_simple_changes: false
          review_comment_lgtm: false
```

#### 环境变量

- `GITHUB_TOKEN`：这应该已经在 GitHub Action 环境中可用。用于向 Pull Request 添
  加评论。
- `OPENAI_API_KEY`：用于向 OpenAI API 进行身份验证。您可以
  在[这里](https://platform.openai.com/account/api-keys)获取一个。请将此密钥添加
  到您的 GitHub Action secrets 中。
- `OPENAI_API_ORG`：（可选）如果您有多个组织，使用此选项可以指定要使用的 OpenAI
  API 组织。请将此密钥添加到您的 GitHub Action secrets 中。

### 模型：`gpt-4` 和 `gpt-3.5-turbo`

建议使用 `gpt-3.5-turbo` 进行较轻的任务，如总结变更（配置中的
`openai_light_model`），使用 `gpt-4` 进行更复杂的审查和评论任务（配置中的
`openai_heavy_model`）。

成本：`gpt-3.5-turbo` 非常便宜。`gpt-4` 的价格高出几个数量级，但结果明显优越。对
于一个 20 人的开发团队，使用基于 `gpt-4` 的审查和评论，我们通常每天花费 20 美元
。

### 提示和配置

请参阅：[action.yml](./action.yml)

提示：您可以通过配置 `system_message` 值来更改机器人的个性。例如，要审查文档/博
客文章，您可以使用以下提示：

<details>
<summary>博客审查提示</summary>

```yaml
system_message: |
  您是 `@coderabbitai`（又名 `github-actions[bot]`），一个由 OpenAI 训练的语言模型。您的目的是充当经验丰富的 DevRel（开发者关系）专业人员，专注于云原生基础设施。

  公司背景 -
  CodeRabbit 是一个 AI 驱动的代码审查工具。它提高代码质量并减少手动工作。提供上下文感知、逐行反馈，突出关键变更，
  支持机器人交互，并允许您直接从 GitHub 提交建议。

  在审查或生成内容时，请关注以下关键领域 -
  - 准确性
  - 相关性
  - 清晰度
  - 技术深度
  - 行动召唤
  - SEO 优化
  - 品牌一致性
  - 语法和文笔
  - 拼写错误
  - 超链接建议
  - 图形或图像（如需要，建议 Dall-E 图像提示）
  - 同理心
  - 参与度
```

</details>

## 与 CodeRabbit 对话

您可以回复此操作所做的审查评论，并根据差异上下文获得响应。此外，您可以通过在评论
中标记机器人（`@coderabbitai`）来邀请机器人进行对话。

示例：

> @coderabbitai 请为此文件生成测试计划。

注意：审查评论是在 Pull Request 中的差异或文件上进行的评论。

### 忽略 PR

有时忽略 PR 是很有用的。例如，如果您使用此操作来审查文档，您可以忽略仅更改文档的
PR。要忽略 PR，请在 PR 描述中添加以下关键字：

```text
@coderabbitai: ignore
```

## 示例

以下是 ai-pr-reviewer 完成的一些审查

![PR 摘要](./docs/images/PRSummary.png)

![PR 发布说明](./docs/images/ReleaseNotes.png)

![PR 审查](./docs/images/section-1.png)

![PR 对话](./docs/images/section-3.png)

非常欢迎任何关于改进提示的建议或 Pull Request。

## 贡献

### 开发

> 首先，您需要一个相当现代的 `node` 版本，已在 node 17+ 上测试。

安装依赖

```bash
$ npm install
```

构建 TypeScript 并打包以供分发

```bash
$ npm run build && npm run package
```

## 常见问题

### 审查来自分叉的 Pull Request

GitHub Actions 限制了从分叉仓库访问 secrets。要启用此功能，您需要在工作流文件中
使用 `pull_request_target` 事件而不是 `pull_request`。请注意，使用
`pull_request_target` 时，您需要额外配置以确保检出正确的提交：

```yaml
name: Code Review

permissions:
  contents: read
  pull-requests: write

on:
  pull_request_target:
    types: [opened, synchronize, reopened]
  pull_request_review_comment:
    types: [created]

concurrency:
  group:
    ${{ github.repository }}-${{ github.event.number || github.head_ref ||
    github.sha }}-${{ github.workflow }}-${{ github.event_name ==
    'pull_request_review_comment' && 'pr_comment' || 'pr' }}
  cancel-in-progress: ${{ github.event_name != 'pull_request_review_comment' }}

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: coderabbitai/ai-pr-reviewer@latest
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        with:
          debug: false
          review_simple_changes: false
          review_comment_lgtm: false
```

另请参阅：
https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request_target

### 检查与 OpenAI 服务器之间的消息

在工作流文件中设置 `debug: true` 以启用调试模式，这将显示消息

### 免责声明

- 您的代码（文件、差异、PR 标题/描述）将被发送到 OpenAI 的服务器进行处理。在将其
  用于您的私有代码仓库之前，请与您的合规团队确认。
- 使用的是 OpenAI API，而不是他们门户网站上的 ChatGPT 会话。OpenAI API 有一
  个[更为保守的数据使用政策](https://openai.com/policies/api-data-usage-policies)，
  与其 ChatGPT 产品相比。
- 此操作与 OpenAI 无关。
