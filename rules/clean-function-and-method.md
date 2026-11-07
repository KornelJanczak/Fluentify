---
description: Guidelines for writing small, readable functions and methods with low complexity.
globs: ["**/*"]
alwaysApply: true
---
## Function and method rules

Apply these when writing or refactoring any function, method, or static helper.

### Size and complexity
- Keep functions at **≤ 40 lines**. Extract private helpers when logic grows.
- Keep **cyclomatic complexity low**: aim for **≤ 10** decision points per function (`if`, `else if`, `switch` cases, `for`/`while`, `catch`, `&&`/`||` in conditions).
- WHEN a function has **more than 3 nested `if` levels** OR **more than ~5 top-level conditionals**, THEN extract named helpers or use **guard clauses** (early `return` / `continue` in a thin loop wrapper).
  > WHY: High complexity hides bugs and makes unit tests harder to write.

### Loops
- DON'T use `continue` inside `for` loops. Restructure with `filter`, `map`, `find`, `some`, or a plain `for` loop with inverted conditions.
- Prefer `for...of` or array methods over manual index loops when iterating collections.
  > WHY: `no-continue` is an ESLint warning in this repo (`.eslintrc.js`).

### Parameters
- DON'T pass more than **3 positional arguments**. WHEN there are 4+, use a single options object:
  - Bad: `createUser(name, email, role, departmentId)`
  - Good: `createUser({ name, email, role, departmentId })`
  > WHY: Long parameter lists are easy to mis-order at call sites.
- DON'T pass bare `true`/`false`/`null`/`undefined` as **positional** arguments when the call site does not read like plain English:
  - Bad: `findNotifications(true, null)` - what do `true` and `null` mean?
  - Good: `findNotifications({ showDismissed: true, additionalFilters: null })`
  - OK: `setEnabled(true)` when the parameter is literally `enabled: boolean`
  > WHY: Unnamed flag/null arguments force readers to jump to the function definition; named fields document intent at the call site.

### Return values
- Prefer **descriptive result objects** over bare `null`, `undefined`, or `boolean` when the caller needs context:
  - Bad: `return false`
  - Good: `return { shouldProcess: false, reason: 'owner already set' }`
- Returning `null` / `undefined` is still OK for simple lookups (`findX(): T | null`) or guard-clause early exits.
  > WHY: Booleans and nulls force the caller to guess *why* something failed.

### Conditionals
- DON'T stack many `if` / `else if` branches in one function. Extract each branch into a named function, or replace with a lookup map / strategy object when keys are known.
- Move nested conditionals into well-named helpers (see `clean-code.mdc` → Encapsulation).

### Simplicity
- Follow **KISS** (*Keep It Simple, Stupid*): choose the simplest code that meets the requirement. Don't add abstractions until a second real use case appears.

### Tooling
- Run and respect ESLint for the touched files. Fix new warnings you introduce; don't disable rules without a documented reason.