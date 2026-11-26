# Lean 4 形式化证明导论 · 交互式教学系统

> **在线体验地址**：[https://owen-liuyuxuan.github.io/lean_learning/](https://owen-liuyuxuan.github.io/lean_learning/)

这是一个面向**非数学专业本科背景（熟悉基础微积分/线代与基础编程概念，但未学过数理逻辑或类型论）**读者的 Lean 4 交互式教学网站，旨在打通对形式化证明的**感性直觉**与**理性逻辑基础**：

1. **为什么“编译通过 = 证明绝对正确”？**
   从自然语言证明的隐含跳跃出发，讲解 **Curry-Howard 同构（命题即类型，证明即程序）**、**依赖类型论（Dependent Type Theory）** 与 **de Bruijn 准则（极简可信内核）**。
2. **6 个从易到难的完整数学命题**（全部基于纯 Lean 4 核心库 `Init`，无需安装 Mathlib）：
   - 例 1：逻辑蕴含传递性（证明即函数组合）
   - 例 2：合取交换律（证明即结构体拆包与重装）
   - 例 3：偶数加偶数仍是偶数（存在量词与构造见证人）
   - 例 4：`n + 0 = n` 与 `0 + n = n` 的本质区别（定义相等 `rfl` vs 命题相等 `induction`）
   - 例 5：高斯求和公式 `2 * sumUpTo n = n * (n + 1)`（递归定义与 `calc` 透明推导链）
   - 例 6：$\sqrt{2}$ 是无理数（`a² ≠ 2b²`，奇偶性引理 + `termination_by` 费马无穷递降法）
   每个例子均包含：**自然语言证明 → 隐含逻辑跳跃剖析 → 交互式单步 Infoview 状态推演 → 底层 λ 证明项（Proof Term）→ 一键跳转 Lean 4 Live 在线真机编译**。
3. **交互式迷你证明沙盒 & 概念自测**
   直接在浏览器中动手输入策略（`intro`、`exact`、`cases`、`constructor`、`rfl`、`induction`、`rw`），体验“Goal 逐一归零”的成就感。

## 本地运行

```bash
npm install
npm run dev
```

独立 Lean 4 源码位于 [`lean/Examples.lean`](./lean/Examples.lean)，可直接使用 `lean lean/Examples.lean` 运行或粘贴到 [Lean 4 Live](https://live.lean-lang.org/) 中验证。
