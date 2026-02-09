# Project Workflow

> Workflow configuration for the Votist project.

## Guiding Principles

1. **The Plan is the Source of Truth:** All work must be tracked in `plan.md`
2. **The Tech Stack is Deliberate:** Changes to the tech stack must be documented in `tech-stack.md` *before* implementation
3. **Test-Driven Development:** Write unit tests before implementing functionality
4. **High Code Coverage:** Aim for >70% code coverage for all modules
5. **User Experience First:** Every decision should prioritize user experience
6. **Non-Interactive & CI-Aware:** Prefer non-interactive commands. Use `CI=true` for watch-mode tools (tests, linters) to ensure single execution.

## Task Workflow

All tasks follow a strict lifecycle:

### Standard Task Workflow

1. **Select Task:** Choose the next available task from `plan.md` in sequential order

2. **Mark In Progress:** Before beginning work, edit `plan.md` and change the task from `[ ]` to `[~]`

3. **Write Failing Tests (Red Phase):**
   - Create a new test file for the feature or bug fix.
   - Write one or more unit tests that clearly define the expected behavior and acceptance criteria for the task.
   - **CRITICAL:** Run the tests and confirm that they fail as expected. This is the "Red" phase of TDD. Do not proceed until you have failing tests.

4. **Implement to Pass Tests (Green Phase):**
   - Write the minimum amount of application code necessary to make the failing tests pass.
   - Run the test suite again and confirm that all tests now pass. This is the "Green" phase.

5. **Refactor (Optional but Recommended):**
   - With the safety of passing tests, refactor the implementation code and the test code to improve clarity, remove duplication, and enhance performance without changing the external behavior.
   - Rerun tests to ensure they still pass after refactoring.

6. **Verify Coverage:** Run coverage reports:
   ```bash
   CI=true npx vitest run --coverage
   ```
   Target: >70% coverage for new code.

7. **Document Deviations:** If implementation differs from tech stack:
   - **STOP** implementation
   - Update `tech-stack.md` with new design
   - Add dated note explaining the change
   - Resume implementation

8. **Update Plan:** Read `plan.md`, find the line for the completed task, update its status from `[~]` to `[x]`.

### Phase Completion — Commit & Checkpoint Protocol

**Trigger:** This protocol is executed when all tasks in a phase are complete.

1. **Commit Code Changes:**
   - Stage all code changes related to the phase.
   - Commit with a clear message: `feat(<scope>): <description of phase work>`

2. **Attach Phase Summary with Git Notes:**
   - Get the commit hash: `git log -1 --format="%H"`
   - Create a detailed summary including: phase name, tasks completed, files changed, and rationale.
   - Attach: `git notes add -m "<note content>" <commit_hash>`

3. **Ensure Test Coverage:**
   - Identify all files changed in the phase.
   - Verify corresponding test files exist for all code files.
   - Create missing tests as needed.

4. **Execute Automated Tests:**
   - Run: `CI=true npm test`
   - If tests fail, debug (max 2 attempts), then ask user for guidance.

5. **Manual Verification Plan:**
   - Analyze `product.md` and `plan.md` to determine user-facing goals.
   - Present step-by-step verification instructions to the user.

6. **Await User Confirmation:**
   - Ask: "Does this meet your expectations? Please confirm or provide feedback."
   - **PAUSE** and wait for explicit confirmation.

7. **Create Checkpoint Commit:**
   - Commit: `conductor(checkpoint): Checkpoint end of Phase X`

8. **Record Checkpoint SHA:**
   - Update `plan.md` with checkpoint hash: `[checkpoint: <sha>]`
   - Commit: `conductor(plan): Mark phase '<PHASE NAME>' as complete`

### Quality Gates

Before marking any phase complete, verify:

- [ ] All tests pass
- [ ] Code coverage meets requirements (>70%)
- [ ] Code follows project's code style guidelines (as defined in `code_styleguides/`)
- [ ] Type safety is enforced
- [ ] No linting or static analysis errors
- [ ] Works correctly on mobile (if applicable)
- [ ] No security vulnerabilities introduced

## Commit Guidelines

### Message Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests
- `chore`: Maintenance tasks

### Examples
```bash
git commit -m "feat(auth): Add custom authentication system"
git commit -m "fix(quiz): Correct score calculation for partial answers"
git commit -m "test(voting): Add tests for poll vote counting"
```

## Definition of Done

A task is complete when:

1. All code implemented to specification
2. Unit tests written and passing
3. Code coverage meets project requirements (>70%)
4. Code passes all configured linting and static analysis checks
5. Works correctly on mobile (if applicable)
6. Implementation notes added to `plan.md`

A phase is complete when:

1. All tasks in the phase are done
2. Phase changes committed with proper message
3. Git note with phase summary attached to the commit
4. Phase checkpoint created and recorded in `plan.md`

## Configuration Summary

| Setting | Value |
|---------|-------|
| Coverage Target | 70% |
| Commit Strategy | Per Phase |
| Git Notes | Enabled |
| Mobile Testing | If Applicable |
| Parallel Agents | worktree |
