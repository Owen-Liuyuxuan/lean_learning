/-
  Lean 4 形式化证明导论 · 随课源码集 (纯 Lean 4 核心库 Init，无需 Mathlib)
  可在本地使用 `lean lean/Examples.lean` 编译校验，
  或直接复制到 https://live.lean-lang.org/ 在线运行。
-/

namespace LeanLearning

-- ============================================================================
-- 例 1：逻辑蕴含的传递性 (Curry-Howard 同构：证明就是函数组合)
-- ============================================================================
theorem imp_trans (P Q R : Prop) (hpq : P → Q) (hqr : Q → R) : P → R := by
  intro hp
  apply hqr
  exact hpq hp

-- 对比：不经由策略 (tactic)，直接写出底层的 λ-项 (Proof Term)
theorem imp_trans_term (P Q R : Prop) (hpq : P → Q) (hqr : Q → R) : P → R :=
  fun hp => hqr (hpq hp)


-- ============================================================================
-- 例 2：合取交换律 (证明作为结构体：拆包与重装)
-- ============================================================================
theorem and_comm_demo (P Q : Prop) (h : P ∧ Q) : Q ∧ P := by
  cases h with
  | intro hp hq =>
    constructor
    · exact hq
    · exact hp

-- 对比：底层结构体匹配与构造
theorem and_comm_term (P Q : Prop) (h : P ∧ Q) : Q ∧ P :=
  match h with
  | And.intro hp hq => And.intro hq hp


-- ============================================================================
-- 例 3：偶数加偶数仍是偶数 (存在量词：必须交出具体的“见证人”)
-- ============================================================================
def IsEven (n : Nat) : Prop := ∃ k : Nat, n = 2 * k

theorem even_add_even (m n : Nat) (hm : IsEven m) (hn : IsEven n) : IsEven (m + n) := by
  cases hm with
  | intro a ha =>
    cases hn with
    | intro b hb =>
      exists (a + b)
      rw [ha, hb]
      rw [← Nat.mul_add]


-- ============================================================================
-- 例 4：n + 0 = n 与 0 + n = n 的天壤之别 (定义相等 vs 命题相等)
-- ============================================================================
theorem add_zero_easy (n : Nat) : n + 0 = n := by
  rfl

theorem zero_add_hard (n : Nat) : 0 + n = n := by
  induction n with
  | zero =>
    rfl
  | succ k ih =>
    rw [Nat.add_succ]
    rw [ih]


-- ============================================================================
-- 例 5：高斯求和公式 (递归定义 + 数学归纳法 + calc 透明推导链)
-- ============================================================================
def sumUpTo : Nat → Nat
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


-- ============================================================================
-- 例 6：√2 是无理数 (良基递归 / 费马无穷递降法)
-- 命题等价形式：不存在正整数 a, b 使得 a^2 = 2 * b^2
-- ============================================================================
theorem even_or_odd (a : Nat) : (∃ m, a = 2 * m) ∨ (∃ m, a = 2 * m + 1) := by
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

end LeanLearning
