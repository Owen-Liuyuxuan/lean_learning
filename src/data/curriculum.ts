export interface CurryHowardRow {
  id: string;
  logicName: string;
  logicSymbol: string;
  typeName: string;
  progAnalogy: string;
  leanSyntax: string;
  concreteExample: {
    statement: string;
    leanSnippet: string;
    explanation: string;
  };
}

export const CURRY_HOWARD_ROWS: CurryHowardRow[] = [
  {
    id: 'prop-type',
    logicName: '命题 / 定理',
    logicSymbol: 'P',
    typeName: '类型 (Type / Prop)',
    progAnalogy: '接口契约 / 数据类型（如 String, User）',
    leanSyntax: 'P : Prop',
    concreteExample: {
      statement: '“2 + 2 = 4” 是一个命题（或者说一个类型）',
      leanSnippet: '#check (2 + 2 = 4 : Prop)',
      explanation:
        '在普通编程里，Int 是整数类型，42 是这个类型的值；在 Lean 里，“2 + 2 = 4”本身就是一种类型（属于 Prop 宇宙），它的“值”就是这个命题的一个有效证明！如果命题是假的（如 2 + 2 = 5），那么这个类型就是空类型，永远构造不出任何值。',
    },
  },
  {
    id: 'proof-term',
    logicName: '证明过程',
    logicSymbol: '⊢ P',
    typeName: '该类型的某个实例 / 项 (Term)',
    progAnalogy: '符合接口契约的实体对象或程序值',
    leanSyntax: 'h : P',
    concreteExample: {
      statement: 'rfl 是“2 + 2 = 4”这个类型的一个具体实例',
      leanSnippet: 'example : 2 + 2 = 4 := rfl',
      explanation:
        '就像写出 `let x : Int := 42` 表示你构造出了一个整数；写出 `example : 2 + 2 = 4 := rfl` 表示你构造出了一个类型为 `2 + 2 = 4` 的对象。只要类型检查器点头，命题就必然为真。',
    },
  },
  {
    id: 'implication',
    logicName: '逻辑蕴含（若 P 则 Q）',
    logicSymbol: 'P → Q',
    typeName: '函数类型 (Function Type)',
    progAnalogy: '接收 P 返回 Q 的纯函数',
    leanSyntax: 'fun (hp : P) => ...',
    concreteExample: {
      statement: '证明 P → Q 等于编写一个把“P 的证据”加工成“Q 的证据”的转换器',
      leanSnippet: 'example (P : Prop) : P → P := fun hp => hp',
      explanation:
        '假设别人给了你一块“P 成立的通行证” hp，如果你能用它合法地造出一块“Q 成立的通行证”，你就证明了 P → Q。最简单的“若 P 则 P”就是编程里的恒等函数 `id(x) = x`。',
    },
  },
  {
    id: 'conjunction',
    logicName: '合取（P 且 Q）',
    logicSymbol: 'P ∧ Q',
    typeName: '积类型 / 二元组 (Product / Pair)',
    progAnalogy: '结构体 struct { first: P; second: Q }',
    leanSyntax: '⟨hp, hq⟩ 或 And.intro hp hq',
    concreteExample: {
      statement: '“P 且 Q”成立，必须同时交出 P 的证据和 Q 的证据',
      leanSnippet: 'example (hp : P) (hq : Q) : P ∧ Q := ⟨hp, hq⟩',
      explanation:
        '就像要拿到一个包含两份证件的文件夹，你必须把两份证件齐齐装进去；相反，如果已知条件给你这个文件夹，你就可以把里面的两份证件拆出来用。',
    },
  },
  {
    id: 'disjunction',
    logicName: '析取（P 或 Q）',
    logicSymbol: 'P ∨ Q',
    typeName: '和类型 / 枚举 (Sum / Tagged Union)',
    progAnalogy: 'Rust 的 enum Either { Left(P), Right(Q) }',
    leanSyntax: 'Or.inl hp 或 Or.inr hq',
    concreteExample: {
      statement: '证明“P 或 Q”只需选左路交出 P，或选右路交出 Q',
      leanSnippet: 'example (hp : P) : P ∨ Q := Or.inl hp',
      explanation:
        '如果你要证明“今天下雨或今天不下雨”，你可以直接拿着“今天下雨的证据”走左分支 `Or.inl`；而反过来如果前提是 `P ∨ Q`，你必须用 `cases` 写全两个分支以防万一。',
    },
  },
  {
    id: 'false-neg',
    logicName: '矛盾与否定（非 P）',
    logicSymbol: '⊥, ¬P',
    typeName: '空类型 (Empty Type) 与 P → Empty',
    progAnalogy: '永远无法被实例化出来的 Never/Void 类型',
    leanSyntax: 'False, P → False',
    concreteExample: {
      statement: '¬P 在 Lean 中定义为函数类型 P → False',
      leanSnippet: 'example (hp : P) (hnp : ¬P) : False := hnp hp',
      explanation:
        'False 是一个没有任何构造子的空类型——在合理逻辑下你凭空造不出它的实例。所以“P 不成立”（¬P）的意思是：“如果你真能递给我一个 P，我就能当场造出一个绝对不可能存在的 False（矛盾）”。',
    },
  },
  {
    id: 'quantifiers',
    logicName: '全称 ∀ 与存在 ∃',
    logicSymbol: '∀ x, P x / ∃ x, P x',
    typeName: '依赖函数类型 (Π) 与 依赖对类型 (Σ)',
    progAnalogy: '返回值类型取决于输入值的泛型函数 / 带证明的返回值',
    leanSyntax: '(x : α) → P x / ⟨x, hpx⟩',
    concreteExample: {
      statement: '这是“依赖类型论”超越普通编程语言（C++/Java/TS）的核武器！',
      leanSnippet: 'theorem add_comm_spec : ∀ a b : Nat, a + b = b + a := ...',
      explanation:
        '在 C++/TypeScript 中，函数返回类型只能写死为 `bool` 或 `int`，不能写“返回类型为 `a + b = b + a`（随具体输入值 a, b 而变化的类型）”。**依赖类型**允许类型里面直接包含变量值，从而把任意高深的数学命题精确编码进类型系统！',
    },
  },
];

export interface PipelineStage {
  id: string;
  step: string;
  title: string;
  subtitle: string;
  analogy: string;
  inputSample: string;
  outputSample: string;
  trustLevel: '不可信（辅助工具）' | '核心可信底座 (TCB)';
  detail: string;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'tactics',
    step: '01',
    title: '表面语言与策略脚本 (Tactics)',
    subtitle: '人类友好的“交互式推理指令”',
    analogy: '就像高级语言里的宏（Macro）或者 IDE 智能代码生成器',
    inputSample: `theorem demo (P Q : Prop) : P ∧ Q → Q ∧ P := by
  intro ⟨hp, hq⟩
  exact ⟨hq, hp⟩`,
    outputSample: '一串尚未被最终认证的高层策略指令序列',
    trustLevel: '不可信（辅助工具）',
    detail:
      '我们在编辑器里写的 intro、rw、induction、simp、omega 都属于这一层。即便某人写的第三方自动化策略（AI 模型或复杂搜索算法）出了 Bug，它也绝对不可能骗过后面第 3 步！',
  },
  {
    id: 'elaborator',
    step: '02',
    title: '繁饰器 (Elaborator) —— 拼装证明项',
    subtitle: '把策略翻译成显式的、无任何歧义的 λ-表达式',
    analogy: '相当于“草稿翻译官”：把你的大白话解题思路整理成严丝合缝的卷面步骤',
    inputSample: '策略指令 + 类型推断需求 + 隐式参数占位符 (_)',
    outputSample: `fun (h : P ∧ Q) =>
  And.intro (And.right h) (And.left h)`,
    trustLevel: '不可信（辅助工具）',
    detail:
      'Elaborator 负责补全所有隐式类型参数、展开符号糖（如 + 变成 HAdd.hAdd）、执行各种搜索策略，最终产出一棵纯粹的、完全显式的“证明树”（Proof Term）。注意：即使 Elaborator 本身几十万行代码有 Bug，也依然没有关系！',
  },
  {
    id: 'kernel',
    step: '03',
    title: '极简可信内核 (Trusted Kernel)',
    subtitle: 'de Bruijn 准则的核心：只做一件事——对纯 λ 项做机械类型检查',
    analogy: '一位铁面无私、只会按不到十条规则死板验算的裁判（代码量仅数千行 C++）',
    inputSample: 'Theorem Type: P ∧ Q → Q ∧ P\nProof Term: fun h => And.intro h.2 h.1',
    outputSample: '✓ Type Check Passed! (或 ✗ Type Mismatch Error)',
    trustLevel: '核心可信底座 (TCB)',
    detail:
      '这就是“通过形式化证明就一定对”的终极秘密！数学家和计算机科学家不需要去信任复杂的策略引擎、AI 模型或百万行工具链——他们只需要共同审计这个仅有几千行代码的极简内核（甚至可以用另一门语言重写独立验证器 `lean4checker` 来交叉复核）。只要内核说“类型匹配”，证明就在公理体系内绝对成立。',
  },
  {
    id: 'olean',
    step: '04',
    title: '编译产物 (.olean) 与可信定理库',
    subtitle: '把通过检验的证明写入全局环境，供后续所有定理直接引用',
    analogy: '通过所有形式验证后盖上钢印并签名的二进制构件',
    inputSample: 'Kernel 签发的 Certified Declaration',
    outputSample: '.olean 二进制环境快照（可被下游 Mathlib 等项目直接 import）',
    trustLevel: '核心可信底座 (TCB)',
    detail:
      '一旦某个定理进入环境，下游定理只需引用它的名字（例如 `Nat.mul_add`），不需要重新推导一遍。整个 Mathlib 数十万条现代数学定理就这样一层层严丝合缝地向上垒筑起来。',
  },
];

export interface FakeProofDemo {
  id: string;
  title: string;
  badge: string;
  humanTrick: string;
  leanCode: string;
  compilerResponse: string;
  whyCaught: string;
}

export const FAKE_PROOF_DEMOS: FakeProofDemo[] = [
  {
    id: 'sorry-axiom',
    title: '骗局一：偷偷留白（使用 sorry 开后门）',
    badge: 'Compiler Warning + 污染追踪',
    humanTrick: '“这一步显然成立，留给读者自证”——直接放个占坑符假装写完了。',
    leanCode: `theorem all_nums_equal (a b : Nat) : a = b := by
  sorry`,
    compilerResponse: `warning: declaration uses 'sorry'
-- 进一步追踪该定理的公理依赖：
#print axioms all_nums_equal
-- 输出: 'all_nums_equal' depends on axioms: [sorryAx]`,
    whyCaught:
      '在开发草稿阶段 Lean 允许 `sorry` 作为 TODO 占位符，但它会在后台悄悄给这个定理盖上不可磨灭的污染印记 `sorryAx`。哪怕中间经过十层包装引用，只要任何上游依赖过 `sorry`，`#print axioms` 都会立刻把罪证揪出来！正式库（如 Mathlib CI）严禁任何 `sorryAx`。',
  },
  {
    id: 'infinite-loop',
    title: '骗局二：逻辑循环论证 / 死循环递归',
    badge: 'Termination Error (拒绝编译)',
    humanTrick: '想证明一个假命题 False？写个函数自己调用自己，永远不返回不就行了？',
    leanCode: `theorem fake_false : False :=
  fake_false`,
    compilerResponse: `error: fail to show termination for
  fake_false
with errors
structural recursion cannot be used ...
well-founded recursion cannot be used, 'fake_false' does not take any (non-fixed) arguments`,
    whyCaught:
      '在 C / Python / Rust 里，死循环函数的返回类型甚至可以骗成任意类型；但在逻辑里，允许死循环等于允许“循环论证”（因为 A 所以 A），整个数学大厦会瞬间坍塌！因此 Lean 内核强制所有函数与证明必须**停机（Total）**：递归参数必须严格变小（如例 6 的 `termination_by b`）。',
  },
  {
    id: 'type-mismatch',
    title: '骗局三：偷换概念 / 边界漏情况',
    badge: 'Type Mismatch / Unsolved Goals',
    humanTrick: '已知条件是 0 + n = n，或只处理了偶数情况，假装对所有自然数都证明完了。',
    leanCode: `theorem fake_zero_add (n : Nat) : 0 + n = n := by
  rfl`,
    compilerResponse: `error: tactic 'rfl' failed, the left-hand side
  0 + n
is not definitionally equal to
  n`,
    whyCaught:
      '机器不会像人类一样脑补“0 + n 肯定等于 n 嘛”。rfl 展开 0 + n 的函数体后，发现右参数是未知变量 n 无法继续计算，左右 AST 结构不同，内核直接拒签。',
  },
];

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: '在 Curry-Howard 同构的视角下，证明命题“P → Q”在底层本质上等价于什么？',
    options: [
      '用真值表穷举 P 和 Q 的所有 True/False 组合',
      '编写一个接收类型为 P 的参数、返回类型为 Q 的值的纯函数',
      '在内存里运行一个单元测试并检查输出是否为 true',
      '向系统注册一条公理告诉编译器 P 能推出 Q',
    ],
    correctIndex: 1,
    explanation:
      '在直觉主义类型论中，P → Q 就是函数类型。只要你能构造出一个合法函数，把任意类型 P 的证据转化成类型 Q 的证据，就等同于证明了“若 P 成立则 Q 成立”。',
  },
  {
    id: 'q2',
    question: '为什么说“Lean 的 tactic 脚本哪怕写得很复杂，甚至用 AI 生成，只要编译通过就一定不会出错”？',
    options: [
      '因为 AI 模型在训练时已经背熟了所有数学定理',
      '因为 Lean 的策略语言本身没有任何 Bug',
      '因为策略只是在拼装底层的 Proof Term，最终必须接受仅数千行代码的极简内核的严格类型检查（de Bruijn 准则）',
      '因为 Lean 会在编译时把自然语言注释也检查一遍',
    ],
    correctIndex: 2,
    explanation:
      '这就是著名的 de Bruijn 准则：信任边界严格收窄在极简的内核（Kernel）上。无论是手写策略还是 AI 生成策略，都只是在帮 Elaborator 凑出那棵证明树；能不能通过，全靠极简内核按类型规则一板一眼地核对。',
  },
  {
    id: 'q3',
    question: '为什么在 Lean 中 `n + 0 = n` 可以一行 `rfl` 搞定，而 `0 + n = n` 必须用 `induction`？',
    options: [
      '因为自然数加法在标准定义中是对第二个参数做模式匹配（递归）的',
      '因为计算机里的 0 放在左边会触发整数溢出',
      '因为 Lean 还没实现加法交换律',
      '因为 `rfl` 只能用于小于 100 的常数',
    ],
    correctIndex: 0,
    explanation:
      '加法定义是 `a + 0 = a` 与 `a + (b+1) = (a+b)+1`。当 0 在右边时，按定义直接归约成 n = n（定义相等）；当 0 在左边而右边是未知变量 n 时，递归无法展开，必须对 n 做结构归纳（命题相等）。',
  },
  {
    id: 'q4',
    question: '在例 6（√2 无理数）中，为什么 Lean 允许递归调用自己来证明 `False`，而普通死循环 `f = f` 会报错？',
    options: [
      '因为 `theorem` 关键字关闭了停机检查',
      '因为加了 `termination_by b` 并严格证明了新参数 `a\' < b`，递归必然在有限步内停机（良基归纳）',
      '因为 `omega` 策略强制覆盖了类型系统',
      '因为编译器只检查递归深度不超过 10 层',
    ],
    correctIndex: 1,
    explanation:
      '良基递归（Well-founded recursion）保证了不存在无限下降链。因为每次递降都必须证明新分母 `a\'` 严格小于旧分母 `b` 且 `a\' > 0`，停机性得到保证，逻辑上严密对应费马无穷递降法，绝不破坏逻辑一致性。',
  },
  {
    id: 'q5',
    question: '普通编程中的泛型（如 C++ template / TypeScript Generics）与 Lean 的“依赖类型”最核心的区别是什么？',
    options: [
      '依赖类型支持多线程编译，运行速度更快',
      '依赖类型允许“类型”直接依赖于具体的“数值”（例如等式类型 `a + b = b + a` 随变量值而变化）',
      '依赖类型不需要写任何类型标注',
      '依赖类型只支持整数和布尔值，不支持结构体',
    ],
    correctIndex: 1,
    explanation:
      '在普通语言里，类型只能依赖类型（如 `List<T>`），无法表达“长度为 n 的向量”或“`2 * sumUpTo n = n * (n + 1)` 这种命题类型”。依赖类型打通了值与类型的壁垒，才让编程语言能充当通用数学证明器。',
  },
];
