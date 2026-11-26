export interface ProofStep {
  lineNumber: number; // 1-based index into codeLines
  tacticLabel: string;
  hypotheses: { name: string; type: string; isNew?: boolean }[];
  goals: string[];
  changedNote: string;
  naturalCorrespondence: string;
  rationale: string;
}

export interface ProofExample {
  id: string;
  level: number;
  title: string;
  subtitle: string;
  difficulty: '入门' | '基础' | '进阶' | '核心挑战';
  concepts: string[];
  mathStatementLatex: string;
  plainStatement: string;
  naturalProof: {
    steps: string[];
    hiddenLeaps: {
      humanSays: string;
      machineRequires: string;
    }[];
  };
  codeLines: string[];
  fullLeanCode: string;
  proofSteps: ProofStep[];
  termMode: {
    code: string;
    explanation: string;
    typeCheckTrace: string[];
  };
}

export const PROOF_EXAMPLES: ProofExample[] = [
  {
    id: 'imp-trans',
    level: 1,
    title: '逻辑蕴含的传递性',
    subtitle: '第一把钥匙：证明一个“如果……那么……”命题，本质上就是在写一个函数',
    difficulty: '入门',
    concepts: ['Curry-Howard 同构', 'intro', 'apply', 'exact'],
    mathStatementLatex: '(P \\implies Q) \\land (Q \\implies R) \\implies (P \\implies R)',
    plainStatement:
      '如果已知“P 能推出 Q”，又已知“Q 能推出 R”，那么一定有“P 能推出 R”。',
    naturalProof: {
      steps: [
        '假设命题 P 成立。',
        '因为 P → Q 成立，所以由 P 可以得到 Q 成立。',
        '又因为 Q → R 成立，所以由 Q 可以进一步得到 R 成立。',
        '既然从“假设 P 成立”一路推到了“R 成立”，原命题 P → R 得证。',
      ],
      hiddenLeaps: [
        {
          humanSays: '“假设 P 成立……于是 R 成立”',
          machineRequires:
            '机器必须明确记录这个“临时假设 P”的作用域边界：在函数体内部它作为参数 hp : P 存在；一旦函数体结束并返回一个 R 类型的值，这个值的类型就恰好是函数类型 P → R。',
        },
        {
          humanSays: '“由已知条件顺推即可”',
          machineRequires:
            '机器需要把每一步“顺推”精确绑定到对应的函数调用：hpq hp 的类型必须是 Q，hqr (hpq hp) 的类型必须是 R，一个字母都不能差。',
        },
      ],
    },
    codeLines: [
      'theorem imp_trans (P Q R : Prop) (hpq : P → Q) (hqr : Q → R) : P → R := by',
      '  intro hp',
      '  apply hqr',
      '  exact hpq hp',
    ],
    fullLeanCode: `theorem imp_trans (P Q R : Prop) (hpq : P → Q) (hqr : Q → R) : P → R := by
  intro hp
  apply hqr
  exact hpq hp

-- 底层等价的纯函数写法（不通过任何策略）
theorem imp_trans_term (P Q R : Prop) (hpq : P → Q) (hqr : Q → R) : P → R :=
  fun hp => hqr (hpq hp)

#check imp_trans`,
    proofSteps: [
      {
        lineNumber: 1,
        tacticLabel: '初始状态 (进入证明模式 := by)',
        hypotheses: [
          { name: 'P Q R', type: 'Prop' },
          { name: 'hpq', type: 'P → Q' },
          { name: 'hqr', type: 'Q → R' },
        ],
        goals: ['P → R'],
        changedNote: 'Lean 根据函数签名自动构造好上下文，右侧出现待证目标 ⊢ P → R。',
        naturalCorrespondence: '读完题目已知条件，准备证明“若 P 则 R”。',
        rationale:
          '在 Lean 中，P → R 既是逻辑上的“蕴含”，也是一个以 P 为输入、R 为输出的函数类型。要交付一个函数，通常先接收它的输入参数。',
      },
      {
        lineNumber: 2,
        tacticLabel: 'intro hp',
        hypotheses: [
          { name: 'P Q R', type: 'Prop' },
          { name: 'hpq', type: 'P → Q' },
          { name: 'hqr', type: 'Q → R' },
          { name: 'hp', type: 'P', isNew: true },
        ],
        goals: ['R'],
        changedNote: '目标从 P → R 简化为 R；同时上下文中多出了局部假设 hp : P。',
        naturalCorrespondence: '对应自然语言的“假设命题 P 成立”。',
        rationale:
          'intro（引入）等价于写下 lambda 函数的参数 `fun hp => ...`。把前提放进工具箱，接下来只需交付返回值 R。',
      },
      {
        lineNumber: 3,
        tacticLabel: 'apply hqr',
        hypotheses: [
          { name: 'P Q R', type: 'Prop' },
          { name: 'hpq', type: 'P → Q' },
          { name: 'hqr', type: 'Q → R' },
          { name: 'hp', type: 'P' },
        ],
        goals: ['Q'],
        changedNote: '目标从 R 逆向回溯为 Q。',
        naturalCorrespondence: '“要证 R，因为有 Q → R，所以只要先证出 Q 就够了。”',
        rationale:
          '这是交互式证明最常用的“逆向推理（Backward Reasoning）”：hqr 是一个能产出 R 的函数，只要喂给它一个 Q，目标就自动满足。',
      },
      {
        lineNumber: 4,
        tacticLabel: 'exact hpq hp',
        hypotheses: [
          { name: 'P Q R', type: 'Prop' },
          { name: 'hpq', type: 'P → Q' },
          { name: 'hqr', type: 'Q → R' },
          { name: 'hp', type: 'P' },
        ],
        goals: [],
        changedNote: '目标队列清空：No goals! 证明通过。',
        naturalCorrespondence: '“把已知的 P 喂给 P → Q，正好得到 Q，证明完成。”',
        rationale:
          'hpq 是 P → Q 的函数，hp 是 P 类型的对象，函数调用 hpq hp 的返回值类型恰好等于当前目标 Q。exact 直接把这份证据精准提交给内核。',
      },
    ],
    termMode: {
      code: `theorem imp_trans_term (P Q R : Prop) (hpq : P → Q) (hqr : Q → R) : P → R :=
  fun (hp : P) => hqr (hpq hp)`,
      explanation:
        '上面 3 行 tactic 只是帮程序员“交互式拼装”出右边的单行 λ 表达式。Lean 的可信内核（Kernel）根本不懂 intro、apply 或 exact，它只看到 `fun hp => hqr (hpq hp)`，然后像静态类型语言编译器那样做一次纯函数类型检查。',
      typeCheckTrace: [
        '已知 hp : P，且 hpq : P → Q ⇒ 表达式 (hpq hp) 的类型是 Q',
        '已知 hqr : Q → R，且 (hpq hp) : Q ⇒ 表达式 hqr (hpq hp) 的类型是 R',
        '把上述表达式包在 `fun (hp : P) => ...` 中 ⇒ 整体类型为 P → R，与定理签名完全一致，Q.E.D.！',
      ],
    },
  },
  {
    id: 'and-comm',
    level: 2,
    title: '合取交换律',
    subtitle: '证明作为数据结构：把一个“且”打包拆开，再反序重新打包',
    difficulty: '入门',
    concepts: ['结构体 / 积类型', 'cases', 'constructor'],
    mathStatementLatex: '(P \\land Q) \\implies (Q \\land P)',
    plainStatement: '如果命题 P 和命题 Q 同时成立，那么命题 Q 和命题 P 也同时成立。',
    naturalProof: {
      steps: [
        '已知“P 且 Q”成立，这意味着 P 成立，同时 Q 也成立。',
        '我们需要证明“Q 且 P”成立，即分别说明 Q 成立和 P 成立。',
        '由第 1 步已知条件，Q 和 P 确实都成立，因此结论得证。',
      ],
      hiddenLeaps: [
        {
          humanSays: '“且嘛，前后顺序当然无所谓”',
          machineRequires:
            '在类型论里，P ∧ Q 是一个包含两个字段的 Pair 结构体（And.intro hp hq），Q ∧ P 是另一个类型的 Pair 结构体。把 Pair<P, Q> 当成 Pair<Q, P> 直接返回会直接报类型错误，必须显式解构再重新构造。',
        },
      ],
    },
    codeLines: [
      'theorem and_comm_demo (P Q : Prop) (h : P ∧ Q) : Q ∧ P := by',
      '  cases h with',
      '  | intro hp hq =>',
      '    constructor',
      '    · exact hq',
      '    · exact hp',
    ],
    fullLeanCode: `theorem and_comm_demo (P Q : Prop) (h : P ∧ Q) : Q ∧ P := by
  cases h with
  | intro hp hq =>
    constructor
    · exact hq
    · exact hp

-- 等价的底层匹配项
theorem and_comm_term (P Q : Prop) (h : P ∧ Q) : Q ∧ P :=
  match h with
  | And.intro hp hq => And.intro hq hp

#check and_comm_demo`,
    proofSteps: [
      {
        lineNumber: 1,
        tacticLabel: '初始状态',
        hypotheses: [
          { name: 'P Q', type: 'Prop' },
          { name: 'h', type: 'P ∧ Q' },
        ],
        goals: ['Q ∧ P'],
        changedNote: '手里有一个打包好的证据 h : P ∧ Q，目标是构造一个 Q ∧ P。',
        naturalCorrespondence: '题目给定“P 且 Q”成立，要证“Q 且 P”成立。',
        rationale:
          'P ∧ Q 在 Lean 中是一个归纳类型，只有一个构造子 `And.intro : P → Q → P ∧ Q`，就像 C++/Python 里带有两个字段的数据结构。',
      },
      {
        lineNumber: 3,
        tacticLabel: 'cases h with | intro hp hq =>',
        hypotheses: [
          { name: 'P Q', type: 'Prop' },
          { name: 'hp', type: 'P', isNew: true },
          { name: 'hq', type: 'Q', isNew: true },
        ],
        goals: ['Q ∧ P'],
        changedNote: '原来的打包证据 h 被拆解成两个独立证明：hp : P 和 hq : Q。',
        naturalCorrespondence: '“既然 P 且 Q 成立，那就意味着 P 成立，并且 Q 成立。”',
        rationale:
          'cases 对结构体执行模式匹配（pattern matching），把盒子打开取出里面的两件物品。',
      },
      {
        lineNumber: 4,
        tacticLabel: 'constructor',
        hypotheses: [
          { name: 'P Q', type: 'Prop' },
          { name: 'hp', type: 'P' },
          { name: 'hq', type: 'Q' },
        ],
        goals: ['Q', 'P'],
        changedNote: '一个合取目标 Q ∧ P 被分裂为两个待证子目标：⊢ Q 和 ⊢ P。',
        naturalCorrespondence: '“要证明 Q 且 P，只需要分别证明 Q 和 P。”',
        rationale:
          'constructor 自动查找目标类型 Q ∧ P 的唯一构造子 And.intro，需要两个参数，于是生成两项 TODO 清单。',
      },
      {
        lineNumber: 5,
        tacticLabel: '· exact hq',
        hypotheses: [
          { name: 'P Q', type: 'Prop' },
          { name: 'hp', type: 'P' },
          { name: 'hq', type: 'Q' },
        ],
        goals: ['P'],
        changedNote: '第一项子目标 ⊢ Q 解决！只剩最后一项 ⊢ P。',
        naturalCorrespondence: '“首先，Q 确实成立（由前面拆出的 hq 保证）。”',
        rationale: '中间点号 `·` 用来聚焦当前第一个子目标，避免不同分支的状态混在一起。',
      },
      {
        lineNumber: 6,
        tacticLabel: '· exact hp',
        hypotheses: [
          { name: 'P Q', type: 'Prop' },
          { name: 'hp', type: 'P' },
          { name: 'hq', type: 'Q' },
        ],
        goals: [],
        changedNote: '第二项子目标 ⊢ P 解决，No goals!',
        naturalCorrespondence: '“其次，P 也成立（由 hp 保证）。两半凑齐，Q ∧ P 得证。”',
        rationale: '所有分支的 TODO 均已填满，内核成功合成 `And.intro hq hp`。',
      },
    ],
    termMode: {
      code: `theorem and_comm_term (P Q : Prop) (h : P ∧ Q) : Q ∧ P :=
  match h with
  | And.intro hp hq => And.intro hq hp`,
      explanation:
        '这几乎就是一段标准的函数式编程代码：对入参做结构体解构，再按相反顺序构造新结构体。逻辑的“合取”与编程的“Pair/Tuple 类型”在内核层面是同一件事。',
      typeCheckTrace: [
        '入参 h : And P Q 唯一可能的形式是 And.intro hp hq，其中 hp : P，hq : Q',
        '构造 And.intro hq hp 需要第一个参数类型为 Q，第二个参数类型为 P',
        '类型检查完全匹配，返回类型正是 And Q P。',
      ],
    },
  },
  {
    id: 'even-add-even',
    level: 3,
    title: '偶数加偶数仍是偶数',
    subtitle: '存在量词 ∃ 的本质：想要证明“存在”，必须亲手交出“见证人”',
    difficulty: '基础',
    concepts: ['存在量词 ∃', '依赖对 Sigma/Exists', 'exists', 'rw'],
    mathStatementLatex:
      '(\\exists a \\in \\mathbb{N},\\; m = 2a) \\land (\\exists b \\in \\mathbb{N},\\; n = 2b) \\implies \\exists k \\in \\mathbb{N},\\; m + n = 2k',
    plainStatement: '若两个自然数 m 和 n 都是偶数，则它们的和 m + n 也是偶数。',
    naturalProof: {
      steps: [
        '因为 m 是偶数，按定义存在自然数 a 使得 m = 2a；同理存在自然数 b 使得 n = 2b。',
        '于是 m + n = 2a + 2b = 2(a + b)。',
        '令 k = a + b（两个自然数相加仍是自然数），则 m + n = 2k，所以 m + n 是偶数。',
      ],
      hiddenLeaps: [
        {
          humanSays: '“显然 2a + 2b = 2(a + b)”',
          machineRequires:
            '自然数乘法对加法的分配律不是数字的硬编码公理，而是需要显式引用定理 `Nat.mul_add : x * (y + z) = x * y + x * z`（这里从右向左重写 `← Nat.mul_add`）。',
        },
        {
          humanSays: '“令 k = a + b，得证”',
          machineRequires:
            '在依赖类型论里，证明 ∃ k, P k 本质上是交付一个依赖二元组 `⟨witness, proof_for_witness⟩`：既要给出具体的数 `a + b`，又必须附上 `m + n = 2 * (a + b)` 的等式证明。',
        },
      ],
    },
    codeLines: [
      'def IsEven (n : Nat) : Prop := ∃ k : Nat, n = 2 * k',
      '',
      'theorem even_add_even (m n : Nat) (hm : IsEven m) (hn : IsEven n) : IsEven (m + n) := by',
      '  cases hm with',
      '  | intro a ha =>',
      '    cases hn with',
      '    | intro b hb =>',
      '      exists (a + b)',
      '      rw [ha, hb]',
      '      rw [← Nat.mul_add]',
    ],
    fullLeanCode: `def IsEven (n : Nat) : Prop := ∃ k : Nat, n = 2 * k

theorem even_add_even (m n : Nat) (hm : IsEven m) (hn : IsEven n) : IsEven (m + n) := by
  cases hm with
  | intro a ha =>
    cases hn with
    | intro b hb =>
      exists (a + b)
      rw [ha, hb]
      rw [← Nat.mul_add]

#check even_add_even`,
    proofSteps: [
      {
        lineNumber: 3,
        tacticLabel: '初始状态',
        hypotheses: [
          { name: 'm n', type: 'Nat' },
          { name: 'hm', type: 'IsEven m' },
          { name: 'hn', type: 'IsEven n' },
        ],
        goals: ['IsEven (m + n)'],
        changedNote: '注意目标 IsEven (m + n) 展开定义就是 ∃ k : Nat, m + n = 2 * k。',
        naturalCorrespondence: '已知 m, n 为偶数，目标是证明 m + n 满足偶数定义。',
        rationale:
          'IsEven 是一个自定义谓词（返回 Prop 的函数）。Lean 知道它在定义上等价于内部的 ∃ 表达式。',
      },
      {
        lineNumber: 5,
        tacticLabel: 'cases hm with | intro a ha =>',
        hypotheses: [
          { name: 'm n', type: 'Nat' },
          { name: 'hn', type: 'IsEven n' },
          { name: 'a', type: 'Nat', isNew: true },
          { name: 'ha', type: 'm = 2 * a', isNew: true },
        ],
        goals: ['IsEven (m + n)'],
        changedNote: '从 hm 中同时拆出两个东西：见证人 a : Nat 和它满足的等式 ha : m = 2 * a。',
        naturalCorrespondence: '“由 m 是偶数，设 m = 2a。”',
        rationale:
          '这体现了依赖类型（Dependent Type）：第二个字段 ha 的类型 `m = 2 * a` 依赖于第一个字段的值 `a`！',
      },
      {
        lineNumber: 7,
        tacticLabel: 'cases hn with | intro b hb =>',
        hypotheses: [
          { name: 'm n', type: 'Nat' },
          { name: 'a', type: 'Nat' },
          { name: 'ha', type: 'm = 2 * a' },
          { name: 'b', type: 'Nat', isNew: true },
          { name: 'hb', type: 'n = 2 * b', isNew: true },
        ],
        goals: ['IsEven (m + n)'],
        changedNote: '同样拆出 b : Nat 与 hb : n = 2 * b。',
        naturalCorrespondence: '“同理设 n = 2b。”',
        rationale: '现在我们手头同时有了 a, b 和两个改写等式。',
      },
      {
        lineNumber: 8,
        tacticLabel: 'exists (a + b)',
        hypotheses: [
          { name: 'm n a b', type: 'Nat' },
          { name: 'ha', type: 'm = 2 * a' },
          { name: 'hb', type: 'n = 2 * b' },
        ],
        goals: ['m + n = 2 * (a + b)'],
        changedNote: '交出见证人 (a + b) 后，存在量词 ∃ 消失，目标具体化为一个等式！',
        naturalCorrespondence: '“我们猜测那个神秘的 k 就是 a + b，接下来验证 m + n = 2(a + b)。”',
        rationale:
          '一旦给出具体候选值，待证命题中就不再有未知量，变成了纯粹的代数等式验证。',
      },
      {
        lineNumber: 9,
        tacticLabel: 'rw [ha, hb]',
        hypotheses: [
          { name: 'm n a b', type: 'Nat' },
          { name: 'ha', type: 'm = 2 * a' },
          { name: 'hb', type: 'n = 2 * b' },
        ],
        goals: ['2 * a + 2 * b = 2 * (a + b)'],
        changedNote: '目标中的 m 和 n 被分别替换成 2 * a 与 2 * b。',
        naturalCorrespondence: '“把 m = 2a 和 n = 2b 代入左边，得到 2a + 2b。”',
        rationale:
          'rw（rewrite）利用等式作为替换规则，默认从左到右把目标中出现的 m, n 替换掉。',
      },
      {
        lineNumber: 10,
        tacticLabel: 'rw [← Nat.mul_add]',
        hypotheses: [
          { name: 'm n a b', type: 'Nat' },
          { name: 'ha', type: 'm = 2 * a' },
          { name: 'hb', type: 'n = 2 * b' },
        ],
        goals: [],
        changedNote: '提取公因式 2 后左右完全一致，rw 自动触发 rfl，No goals!',
        naturalCorrespondence: '“2a + 2b = 2(a + b)，两边相等，证毕。”',
        rationale:
          'Nat.mul_add 是 `x * (y + z) = x * y + x * z`。加一个左箭头 `←` 表示从右往左替换，恰好把 `2 * a + 2 * b` 合并成 `2 * (a + b)`。',
      },
    ],
    termMode: {
      code: `theorem even_add_even_term (m n : Nat) (hm : IsEven m) (hn : IsEven n) : IsEven (m + n) :=
  match hm, hn with
  | ⟨a, ha⟩, ⟨b, hb⟩ => ⟨a + b, ha ▸ hb ▸ (Nat.mul_add 2 a b).symm⟩`,
      explanation:
        '尖括号 `⟨a + b, ...⟩` 是构造存在性证明的底层语法糖（本质是 `Exists.intro`）。后面的等式链说明了为什么 Lean 不需要任何黑盒魔法就能验算代数恒等式。',
      typeCheckTrace: [
        '从 hm 和 hn 模式匹配出自然数 a, b 以及等式证明 ha, hb',
        '提供见证人 a + b : Nat',
        '利用等式替换（▸）与分配律逆用 `.symm`，构造出类型为 `m + n = 2 * (a + b)` 的证据项',
        '打包成依赖二元组 `Exists.intro (a + b) ...`，内核校验类型恰好为 `IsEven (m + n)`。',
      ],
    },
  },
  {
    id: 'zero-add-vs-add-zero',
    level: 4,
    title: 'n + 0 = n 与 0 + n = n 的天壤之别',
    subtitle: '为什么一个只需 1 秒按定义化简（rfl），另一个却非要用数学归纳法？',
    difficulty: '基础',
    concepts: ['皮亚诺自然数', '定义相等 (rfl)', '命题相等 (induction)', 'Nat.add_succ'],
    mathStatementLatex: '\\forall n \\in \\mathbb{N},\\; n + 0 = n \\quad \\text{vs.} \\quad 0 + n = n',
    plainStatement:
      '在人类直觉里加法天然满足交换律，但在皮亚诺自然数构造里，n + 0 = n 是“定义的直接展开”，而 0 + n = n 却必须用数学归纳法证明。',
    naturalProof: {
      steps: [
        '在标准递归定义中，自然数加法对**第二个参数**递归：a + 0 定义为 a，a + (k + 1) 定义为 (a + k) + 1。',
        '因此对于 n + 0 = n：无需任何推理，按定义展开左边就是 n，直接成立。',
        '但对于 0 + n = n：当 n 是未知符号时，0 + n 无法按第二参数展开！必须对 n 做数学归纳法：',
        '  · 基础步 n = 0：0 + 0 = 0，按定义成立。',
        '  · 归纳步设 0 + k = k：则 0 + (k + 1) = (0 + k) + 1（加法第二条定义）= k + 1（归纳假设）。',
      ],
      hiddenLeaps: [
        {
          humanSays: '“加零不就等于没加嘛，有什么区别？”',
          machineRequires:
            '计算机没有“加法的直觉”，它只有两条关于 `+` 的递归代码！代码只对右边的 `0` 和 `succ k` 做了分支匹配；右边的 `n` 未知时，函数卡在门口无法展开，这就是**定义相等（Definitional Equality）**与**命题相等（Propositional Equality）**的分水岭。',
        },
      ],
    },
    codeLines: [
      'theorem add_zero_easy (n : Nat) : n + 0 = n := by',
      '  rfl',
      '',
      'theorem zero_add_hard (n : Nat) : 0 + n = n := by',
      '  induction n with',
      '  | zero =>',
      '    rfl',
      '  | succ k ih =>',
      '    rw [Nat.add_succ]',
      '    rw [ih]',
    ],
    fullLeanCode: `-- 加法在第二参数上递归：
-- a + 0     := a
-- a + (k+1) := (a + k) + 1

theorem add_zero_easy (n : Nat) : n + 0 = n := by
  rfl

theorem zero_add_hard (n : Nat) : 0 + n = n := by
  induction n with
  | zero =>
    rfl
  | succ k ih =>
    rw [Nat.add_succ]
    rw [ih]

#check add_zero_easy
#check zero_add_hard`,
    proofSteps: [
      {
        lineNumber: 2,
        tacticLabel: 'add_zero_easy: rfl',
        hypotheses: [{ name: 'n', type: 'Nat' }],
        goals: [],
        changedNote: '对 n + 0 = n 而言，rfl 一行直接通过！',
        naturalCorrespondence: '因为加法的定义规定任何数加 0 就直接返回它自己。',
        rationale:
          'rfl（reflexivity）触发 Lean 内核的计算归约器：把 n + 0 展开一步就得到 n，发现左右两边长得一模一样（n = n），瞬间通过。',
      },
      {
        lineNumber: 4,
        tacticLabel: 'zero_add_hard 初始状态',
        hypotheses: [{ name: 'n', type: 'Nat' }],
        goals: ['0 + n = n'],
        changedNote: '这里如果直接写 rfl 会报错！因为加法函数在等待右边的 n 揭晓身份。',
        naturalCorrespondence: '面对未知的自然数 n，0 + n 暂时算不出来，准备分类讨论/归纳。',
        rationale:
          '这是最能体现“计算机视角 vs 人类直觉”的经典一课：等式两边并未在定义上归约为同一个东西。',
      },
      {
        lineNumber: 5,
        tacticLabel: 'induction n with ...',
        hypotheses: [{ name: 'n', type: 'Nat' }],
        goals: ['case zero: 0 + 0 = 0', 'case succ: 0 + (k + 1) = k + 1'],
        changedNote: '把 n 拆成皮亚诺自然数的两种唯一可能：0（zero）或某个 k 的后继（succ k）。',
        naturalCorrespondence: '数学归纳法：先证 n = 0，再假设对 k 成立来证 k + 1。',
        rationale:
          '在类型论中，数学归纳法不是外加的神秘公理，它就是自然数归纳类型 `Nat` 的递归函数（Recursor `Nat.rec`）！',
      },
      {
        lineNumber: 7,
        tacticLabel: 'case zero => rfl',
        hypotheses: [],
        goals: ['case succ: 0 + (k + 1) = k + 1'],
        changedNote: '基础情形 0 + 0 = 0 按定义归约为 0 = 0，rfl 秒杀；进入归纳分支。',
        naturalCorrespondence: '当 n = 0 时，0 + 0 = 0 显然成立。',
        rationale: '一旦右参数具体化为 0，计算归约器立刻就能把 0 + 0 算成 0。',
      },
      {
        lineNumber: 9,
        tacticLabel: 'case succ k ih => rw [Nat.add_succ]',
        hypotheses: [
          { name: 'k', type: 'Nat', isNew: true },
          { name: 'ih', type: '0 + k = k', isNew: true },
        ],
        goals: ['0 + k + 1 = k + 1'],
        changedNote: '利用加法递归定义 Nat.add_succ，把外层的 `+ 1` 从加法里面剥了出来。',
        naturalCorrespondence: '“按照加法的定义，0 + (k + 1) 就是 (0 + k) + 1。”',
        rationale:
          '现在目标里终于露出了 `0 + k` 的字样，正好能与归纳假设 `ih : 0 + k = k` 对接上！',
      },
      {
        lineNumber: 10,
        tacticLabel: 'rw [ih]',
        hypotheses: [
          { name: 'k', type: 'Nat' },
          { name: 'ih', type: '0 + k = k' },
        ],
        goals: [],
        changedNote: '把 0 + k 替换成 k 后变为 k + 1 = k + 1，自动闭合，No goals!',
        naturalCorrespondence: '“由归纳假设 0 + k = k，所以 (0 + k) + 1 = k + 1，归纳完成。”',
        rationale:
          '至此，内核通过 `Nat.rec` 合成了一个对所有自然数都成立的递归证明函数。',
      },
    ],
    termMode: {
      code: `theorem zero_add_hard_term (n : Nat) : 0 + n = n :=
  Nat.rec
    (motive := fun x => 0 + x = x)
    rfl
    (fun k ih => Eq.trans (Nat.add_succ 0 k) (congrArg Nat.succ ih))
    n`,
      explanation:
        '看！在内核底层，“数学归纳法”就是系统自带的高阶递归函数 `Nat.rec`：传入第 0 步的证明（base case）和“从 k 的证明推导出 k+1 的证明”的函数（step case），就能为任意给定的自然数 n 现场生成证明！',
      typeCheckTrace: [
        'motive 定义了我们要对所有 x 证明的性质：0 + x = x',
        '0 处的证明为 rfl : 0 + 0 = 0',
        '步进函数接收 k 与 ih : 0 + k = k，拼接 `Nat.add_succ 0 k` 与 `congrArg Nat.succ ih`，输出 `0 + (k + 1) = k + 1`',
        '内核检查 `Nat.rec` 的类型签名为 `∀ n, 0 + n = n`，全部合乎类型规则。',
      ],
    },
  },
  {
    id: 'gauss-sum',
    level: 5,
    title: '高斯求和公式',
    subtitle: '把递归程序写进定理里：用数学归纳法与 calc 链透明证明 2 × Σi = n(n+1)',
    difficulty: '进阶',
    concepts: ['递归函数定义', 'induction', 'calc 链式证明', '分配律与交换律'],
    mathStatementLatex: '2 \\sum_{i=0}^{n} i = n(n + 1)',
    plainStatement:
      '为了在纯自然数（避免整数除法整除细节）中表达前 n 项和公式，等价地证明：2 倍的前 n 项和等于 n(n + 1)。',
    naturalProof: {
      steps: [
        '定义递归函数 S(0) = 0，S(n + 1) = S(n) + (n + 1)。',
        '用数学归纳法证明 2·S(n) = n(n + 1)：',
        '  · 当 n = 0 时，左边 = 2·0 = 0，右边 = 0·1 = 0，成立。',
        '  · 假设对 k 成立，即 2·S(k) = k(k + 1)。考察 n = k + 1：',
        '    2·S(k + 1) = 2·(S(k) + (k + 1)) = 2·S(k) + 2(k + 1) = k(k + 1) + 2(k + 1) = (k + 2)(k + 1) = (k + 1)(k + 2)。',
        '由归纳法，对所有自然数 n 成立。',
      ],
      hiddenLeaps: [
        {
          humanSays: '“合并同类项得到 (k + 2)(k + 1) = (k + 1)(k + 2)”',
          machineRequires:
            '每一步等号都要交代清楚依据：从 `k*(k+1) + 2*(k+1)` 到 `(k+2)*(k+1)` 需要右分配律逆用 `← Nat.add_mul`，再到 `(k+1)*(k+2)` 需要乘法交换律 `Nat.mul_comm`。`calc` 语法让读者与机器都能一行行核对每一座桥梁。',
        },
      ],
    },
    codeLines: [
      'def sumUpTo : Nat → Nat',
      '  | 0 => 0',
      '  | n + 1 => sumUpTo n + (n + 1)',
      '',
      'theorem two_mul_sumUpTo (n : Nat) : 2 * sumUpTo n = n * (n + 1) := by',
      '  induction n with',
      '  | zero =>',
      '    rfl',
      '  | succ k ih =>',
      '    calc',
      '      2 * sumUpTo (k + 1)',
      '          = 2 * (sumUpTo k + (k + 1)) := by rfl',
      '      _ = 2 * sumUpTo k + 2 * (k + 1) := by rw [Nat.mul_add]',
      '      _ = k * (k + 1) + 2 * (k + 1)   := by rw [ih]',
      '      _ = (k + 2) * (k + 1)           := by rw [← Nat.add_mul]',
      '      _ = (k + 1) * (k + 2)           := by rw [Nat.mul_comm]',
    ],
    fullLeanCode: `def sumUpTo : Nat → Nat
  | 0 => 0
  | n + 1 => sumUpTo n + (n + 1)

theorem two_mul_sumUpTo (n : Nat) : 2 * sumUpTo n = n * (n + 1) := by
  induction n with
  | zero =>
    rfl
  | succ k ih =>
    calc
      2 * sumUpTo (k + 1)
          = 2 * (sumUpTo k + (k + 1)) := by rfl
      _ = 2 * sumUpTo k + 2 * (k + 1) := by rw [Nat.mul_add]
      _ = k * (k + 1) + 2 * (k + 1)   := by rw [ih]
      _ = (k + 2) * (k + 1)           := by rw [← Nat.add_mul]
      _ = (k + 1) * (k + 2)           := by rw [Nat.mul_comm]

#check two_mul_sumUpTo`,
    proofSteps: [
      {
        lineNumber: 5,
        tacticLabel: '初始状态',
        hypotheses: [{ name: 'n', type: 'Nat' }],
        goals: ['2 * sumUpTo n = n * (n + 1)'],
        changedNote: '待证一个关于递归程序 `sumUpTo` 的数学性质。',
        naturalCorrespondence: '我们要验证程序算出来的前 n 项和确实符合高斯公式。',
        rationale:
          '这就是软件形式化验证（Formal Verification）的原型：不仅写出了一个求和程序，还要用数学定理证明程序对**无穷多**个输入全都正确，而不是只跑几个单元测试！',
      },
      {
        lineNumber: 8,
        tacticLabel: 'induction n -> case zero => rfl',
        hypotheses: [],
        goals: ['case succ: 2 * sumUpTo (k + 1) = (k + 1) * (k + 1 + 1)'],
        changedNote: 'n = 0 时两边归约成 0 = 0，rfl 解决；只剩下归纳步。',
        naturalCorrespondence: '基础情形 n = 0 验证完毕，进入归纳递推步。',
        rationale: '注意目标右边是 `(k + 1) * (k + 1 + 1)`，在定义上它等价于 `(k + 1) * (k + 2)`。',
      },
      {
        lineNumber: 12,
        tacticLabel: 'calc 第 1 步：展开 sumUpTo (k + 1)',
        hypotheses: [
          { name: 'k', type: 'Nat' },
          { name: 'ih', type: '2 * sumUpTo k = k * (k + 1)', isNew: true },
        ],
        goals: ['子链进度: 2 * (sumUpTo k + (k + 1)) = ...'],
        changedNote: '按 sumUpTo 的递归定义直接展开，由 rfl 确认前后定义相等。',
        naturalCorrespondence: '“前 k+1 项和等于前 k 项和加上 k+1。”',
        rationale: 'calc 让每一步中转站清晰可见，极其接近人类在草稿纸上写连等号的习惯。',
      },
      {
        lineNumber: 13,
        tacticLabel: 'calc 第 2 步：by rw [Nat.mul_add]',
        hypotheses: [
          { name: 'k', type: 'Nat' },
          { name: 'ih', type: '2 * sumUpTo k = k * (k + 1)' },
        ],
        goals: ['子链进度: 2 * sumUpTo k + 2 * (k + 1) = ...'],
        changedNote: '把 2 分配进去，把 `2 * sumUpTo k` 单独暴露出来。',
        naturalCorrespondence: '“拆括号：2(S(k) + k + 1) = 2S(k) + 2(k + 1)。”',
        rationale: '暴露出 `2 * sumUpTo k` 是为了下一步能把归纳假设 `ih` 嵌进来。',
      },
      {
        lineNumber: 14,
        tacticLabel: 'calc 第 3 步：by rw [ih]',
        hypotheses: [
          { name: 'k', type: 'Nat' },
          { name: 'ih', type: '2 * sumUpTo k = k * (k + 1)' },
        ],
        goals: ['子链进度: k * (k + 1) + 2 * (k + 1) = ...'],
        changedNote: '归纳假设 ih 登场，替换掉未知的递归项 sumUpTo k！',
        naturalCorrespondence: '“代入归纳假设：2S(k) 换成 k(k + 1)。”',
        rationale: '一旦消除 sumUpTo k，整个等式变成了纯多项式代数变形。',
      },
      {
        lineNumber: 16,
        tacticLabel: 'calc 第 4-5 步：提取公因式并交换次序',
        hypotheses: [
          { name: 'k', type: 'Nat' },
          { name: 'ih', type: '2 * sumUpTo k = k * (k + 1)' },
        ],
        goals: [],
        changedNote: '合并为 (k + 2)*(k + 1)，再交换得 (k + 1)*(k + 2)，与目标定义相等，No goals!',
        naturalCorrespondence: '“提取公因式 (k + 1) 后交换因数顺序，恰好等于 (k+1)(k+2)，证毕！”',
        rationale:
          '注意 `(k + 1) * (k + 2)` 与 `(k + 1) * (k + 1 + 1)` 在加法定义下完全同构，calc 链自动收尾。',
      },
    ],
    termMode: {
      code: `-- calc 本质上是多次调用 Eq.trans 把每一步的等式证据串联起来：
-- Eq.trans step1 (Eq.trans step2 (Eq.trans step3 (Eq.trans step4 step5)))`,
      explanation:
        '你在纸上写的连等号 A = B = C = D，在机器底层是用等式传递律 `Eq.trans : a = b → b = c → a = c` 一节一节焊接起来的。',
      typeCheckTrace: [
        'step1 : 2 * sumUpTo (k + 1) = 2 * (sumUpTo k + (k + 1))',
        'step2 : 2 * (sumUpTo k + (k + 1)) = 2 * sumUpTo k + 2 * (k + 1)',
        'step3 : 2 * sumUpTo k + 2 * (k + 1) = k * (k + 1) + 2 * (k + 1)',
        'step4 & step5 : 通过分配律与交换律最终焊接至 (k + 1) * (k + 2)，类型严格闭环。',
      ],
    },
  },
  {
    id: 'sqrt2-irrational',
    level: 6,
    title: '√2 是无理数（无穷递降法）',
    subtitle: '终极综合：把两千年前毕达哥拉斯学派的经典定理，转化成内核强制停机检查的“良基递归”',
    difficulty: '核心挑战',
    concepts: ['反证法 (False)', '奇偶性引理', '无穷递降', 'termination_by'],
    mathStatementLatex: '\\forall a, b \\in \\mathbb{N},\\; b > 0 \\implies a^2 \\neq 2b^2',
    plainStatement:
      '不存在正整数 a 和 b 满足 a² = 2b²（等价于 √2 不能写成任何分数 a/b）。',
    naturalProof: {
      steps: [
        '【引理】如果 a² 是偶数，那么 a 一定是偶数。（因为奇数的平方 (2m+1)² = 2(2m²+2m)+1 必为奇数，与 2k 矛盾。）',
        '【主证明·无穷递降】反设存在正整数 a, b 使得 a² = 2b²。',
        '由 a² = 2b² 可知 a² 是偶数，根据引理，a 必为偶数，设 a = 2a\'。',
        '代入原式得 (2a\')² = 2b²，两边消去 2 得 b² = 2(a\')²。',
        '因为 b > 0，所以 a\' > 0；又因为 2(a\')² = b² < 2b²，故 (a\')² < b²，从而得到严格更小的正整数解 (b, a\')，且 0 < a\' < b。',
        '然而正整数不可能无限严格递减下去！矛盾，故无解。',
      ],
      hiddenLeaps: [
        {
          humanSays: '“同理可得……如此无限递降下去产生矛盾”',
          machineRequires:
            '在类型论里，“无限递降产生矛盾”甚至不需要用“假设有最小反例”去绕圈！我们只需要把主定理写成接收 (a, b) 返回 `False` 的函数，并在内部用更小的参数 `(b, a\')` 递归调用自己，同时向 Lean 证明 `a\' < b` (`termination_by b`)——只要递归参数严格变小且停机，返回 `False` 就被内核合法接受！',
        },
        {
          humanSays: '“不失一般性设 a/b 为最简分数（互质）”',
          machineRequires:
            '如果按教科书的“互质写法”，我们需要先引入 gcd、整除、约分一堆库。改成**费马无穷递降法**后，完全不需要 gcd，只靠自然数严格变小就能一击命中！',
        },
      ],
    },
    codeLines: [
      'theorem even_of_sq_even (a : Nat) (h : ∃ k, a * a = 2 * k) : ∃ m, a = 2 * m := by',
      '  -- 见完整代码：分类讨论 a 为偶或奇，若为奇则 (2m+1)² = 2(...)+1 ≠ 2k',
      '',
      'theorem no_pos_solution (a b : Nat) (hb : b > 0) (hab : a * a = 2 * (b * b)) : False := by',
      '  have ha_even : ∃ a\', a = 2 * a\' := even_of_sq_even a ⟨b * b, hab⟩',
      '  cases ha_even with',
      '  | intro a\' ha\' =>',
      '    have hmul : 2 * (b * b) = 2 * (2 * (a\' * a\')) := by ... -- 代入 a = 2a\' 并结合律',
      '    have hb2 : b * b = 2 * (a\' * a\') := Nat.mul_left_cancel (by decide) hmul',
      '    have ha\'_pos : a\' > 0 := by ... -- 若 a\'=0 则 b*b=0 与 b>0 矛盾',
      '    have ha\'_lt_b : a\' < b := by ... -- 若 b ≤ a\' 则 2b² ≤ 2a\'² = b² 矛盾',
      '    exact no_pos_solution b a\' ha\'_pos hb2',
      'termination_by b',
      '',
      'theorem sqrt2_irrational (a b : Nat) (hb : b > 0) : a * a ≠ 2 * (b * b) :=',
      '  fun hab => no_pos_solution a b hb hab',
    ],
    fullLeanCode: `theorem even_or_odd (a : Nat) : (∃ m, a = 2 * m) ∨ (∃ m, a = 2 * m + 1) := by
  induction a with
  | zero =>
    exact Or.inl ⟨0, rfl⟩
  | succ k ih =>
    cases ih with
    | inl h =>
      cases h with
      | intro m hm =>
        exact Or.inr ⟨m, by rw [hm]⟩
    | inr h =>
      cases h with
      | intro m hm =>
        refine Or.inl ⟨m + 1, ?_⟩
        rw [hm, Nat.mul_add]

theorem odd_ne_even (x y : Nat) : 2 * x + 1 ≠ 2 * y := by
  omega

theorem even_of_sq_even (a : Nat) (h : ∃ k, a * a = 2 * k) : ∃ m, a = 2 * m := by
  cases even_or_odd a with
  | inl he => exact he
  | inr ho =>
    cases h with
    | intro k hk =>
      cases ho with
      | intro m hm =>
        exfalso
        have hsq : a * a = 2 * (m * (2 * m + 1) + m) + 1 := by
          calc
            a * a = (2 * m + 1) * (2 * m + 1) := by rw [hm]
            _ = 2 * m * (2 * m + 1) + 1 * (2 * m + 1) := by rw [Nat.add_mul]
            _ = 2 * (m * (2 * m + 1)) + (2 * m + 1) := by rw [Nat.mul_assoc, Nat.one_mul]
            _ = 2 * (m * (2 * m + 1)) + 2 * m + 1 := by rw [← Nat.add_assoc]
            _ = 2 * (m * (2 * m + 1) + m) + 1 := by rw [← Nat.mul_add]
        rw [hk] at hsq
        exact odd_ne_even (m * (2 * m + 1) + m) k hsq.symm

theorem no_pos_solution (a b : Nat) (hb : b > 0) (hab : a * a = 2 * (b * b)) : False := by
  have ha_even : ∃ a', a = 2 * a' := even_of_sq_even a ⟨b * b, hab⟩
  cases ha_even with
  | intro a' ha' =>
    have hmul : 2 * (b * b) = 2 * (2 * (a' * a')) := by
      calc
        2 * (b * b) = a * a := hab.symm
        _ = (2 * a') * (2 * a') := by rw [ha']
        _ = 2 * (a' * (2 * a')) := by rw [Nat.mul_assoc]
        _ = 2 * ((2 * a') * a') := by rw [Nat.mul_comm a' (2 * a')]
        _ = 2 * (2 * (a' * a')) := by rw [Nat.mul_assoc]
    have hb2 : b * b = 2 * (a' * a') := Nat.mul_left_cancel (by decide) hmul
    have hbb_pos : b * b > 0 := Nat.mul_pos hb hb
    have ha'_pos : a' > 0 := by
      cases a' with
      | zero =>
        simp at hb2
        rw [hb2] at hbb_pos
        exact False.elim (Nat.lt_irrefl 0 hbb_pos)
      | succ k => exact Nat.zero_lt_succ k
    have ha'_lt_b : a' < b := by
      apply Nat.lt_of_not_le
      intro hba
      have hsq_le : b * b ≤ a' * a' := Nat.mul_le_mul hba hba
      have h1 : 2 * (b * b) ≤ 2 * (a' * a') := Nat.mul_le_mul (Nat.le_refl 2) hsq_le
      rw [← hb2] at h1
      omega
    exact no_pos_solution b a' ha'_pos hb2
termination_by b

theorem sqrt2_irrational (a b : Nat) (hb : b > 0) : a * a ≠ 2 * (b * b) :=
  fun hab => no_pos_solution a b hb hab

#check sqrt2_irrational`,
    proofSteps: [
      {
        lineNumber: 4,
        tacticLabel: '进入反证函数 no_pos_solution',
        hypotheses: [
          { name: 'a b', type: 'Nat' },
          { name: 'hb', type: 'b > 0' },
          { name: 'hab', type: 'a * a = 2 * (b * b)' },
        ],
        goals: ['False'],
        changedNote: '在逻辑中，证明 P ≠ Q（即 ¬(P = Q)）等同于：接收 P = Q，输出 False。',
        naturalCorrespondence: '反设存在满足 a² = 2b² 且 b > 0 的自然数解，试图导出矛盾。',
        rationale:
          '在普通编程语言里，写一个死循环函数似乎就能“返回任意类型 False”；但 Lean 内核禁止不返回的函数，所有递归必须通过停机性检查。',
      },
      {
        lineNumber: 7,
        tacticLabel: '应用引理提取 a = 2 * a\'',
        hypotheses: [
          { name: 'a b', type: 'Nat' },
          { name: 'hb', type: 'b > 0' },
          { name: 'hab', type: 'a * a = 2 * (b * b)' },
          { name: 'a\'', type: 'Nat', isNew: true },
          { name: 'ha\'', type: 'a = 2 * a\'', isNew: true },
        ],
        goals: ['False'],
        changedNote: '调用前置引理 even_of_sq_even，拿到一半的数 a\' 与等式 a = 2 * a\'。',
        naturalCorrespondence: '“由 a² = 2b² 是偶数，知 a 必为偶数，设 a = 2a\'。”',
        rationale:
          '大定理拆分成可复用的小引理（`even_of_sq_even`），就像软件工程中的模块化函数抽象。',
      },
      {
        lineNumber: 9,
        tacticLabel: '消去公因子 2 得到 b² = 2(a\')²',
        hypotheses: [
          { name: 'a b a\'', type: 'Nat' },
          { name: 'hb', type: 'b > 0' },
          { name: 'ha\'', type: 'a = 2 * a\'' },
          { name: 'hb2', type: 'b * b = 2 * (a\' * a\')', isNew: true },
        ],
        goals: ['False'],
        changedNote: '用 Nat.mul_left_cancel 在左边消掉一个正整数 2，翻转得到新的平方等式！',
        naturalCorrespondence: '“4(a\')² = 2b² 两边除以 2，得到 b² = 2(a\')²。”',
        rationale:
          '注意新等式 `b * b = 2 * (a\' * a\')` 和原等式结构完全对称，只是角色从 (a, b) 换成了 (b, a\')。',
      },
      {
        lineNumber: 11,
        tacticLabel: '证明递归守卫条件：a\' > 0 且 a\' < b',
        hypotheses: [
          { name: 'a b a\'', type: 'Nat' },
          { name: 'hb2', type: 'b * b = 2 * (a\' * a\')' },
          { name: 'ha\'_pos', type: 'a\' > 0', isNew: true },
          { name: 'ha\'_lt_b', type: 'a\' < b', isNew: true },
        ],
        goals: ['False'],
        changedNote: '利用反证（若 b ≤ a\' 则 2b² ≤ 2a\'² = b²）证明了严格下降：a\' < b。',
        naturalCorrespondence: '“不仅找到了一组新解 (b, a\')，而且新的分母 a\' 严格小于旧分母 b。”',
        rationale:
          '这一步正是向 Lean 停机检查器提交的“通行证”：每次递归调用，第二参数都严格减小，且自然数不能小于 0。',
      },
      {
        lineNumber: 12,
        tacticLabel: 'exact no_pos_solution b a\' ha\'_pos hb2 (termination_by b)',
        hypotheses: [
          { name: 'ha\'_pos', type: 'a\' > 0' },
          { name: 'ha\'_lt_b', type: 'a\' < b' },
          { name: 'hb2', type: 'b * b = 2 * (a\' * a\')' },
        ],
        goals: [],
        changedNote: '递归调用通过良基停机检查，内核确认递归必然在有限步内触底，No goals!',
        naturalCorrespondence: '“既然存在更小的正整数解，无穷递降不可能持续，故最初假设不成立，√2 为无理数！”',
        rationale:
          '仔细想想：如果真的存在一对解 (a, b)，那程序就会顺着递降阶梯走到 b=0 的死胡同；但既然每一步都保留了 >0 的条件，这就证明了那对初始输入根本不可能存在——逻辑学中的无穷递降法，与计算机科学中的停机证明（Well-Founded Recursion），在此完美合二为一！',
      },
    ],
    termMode: {
      code: `-- 在底层，termination_by b 会被 Elaborator 编译成对 Nat.lt_wfRel（自然数小于关系的良基归纳法 WellFounded.fix）的调用：
-- 只有真正依赖较小参数的递归才会被内核接收。`,
      explanation:
        '为什么不能随便写个 `f n = f n` 来假装证明 `False`？因为内核不接受没有停机保证的一般递归！所有带 `termination_by` 的证明都会被翻译成数学上合法的良基归纳组合子 `WellFounded.fix`。',
      typeCheckTrace: [
        '核验递归参数 b : Nat 在自然数小于关系 (<) 下构成良基偏序（没有无限下降链）',
        '检查递归调用点 `no_pos_solution b a\' ...` 时，上下文确实存在证明 `ha\'_lt_b : a\' < b`',
        '内核通过良基归纳归约确认逻辑一致性不被破坏，最终 `sqrt2_irrational` 写入环境。',
      ],
    },
  },
];
