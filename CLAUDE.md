# Todo App Project Documentation

This is comprehensive documentation for Claude Code to understand the project structure, architecture, development workflow, and coding conventions.

## Project Overview

A simple, elegant todo application built with Svelte 4 and Vite 5. The app provides core task management functionality with local storage persistence, allowing users to create, complete, and delete tasks. The project follows a spec-driven development workflow using the `.agent/specs/` system for structured feature development.

**Key Features**:
- Create, complete, and delete todos
- Local storage persistence (data survives page refreshes)
- Active and completed task counters
- Clean, modern UI with gradient styling
- Keyboard shortcuts (Enter to add todo)
- Story feature: Random short stories for mental breaks

**Project Goals**:
- Provide a functional todo app for personal task management
- Demonstrate Svelte 4 best practices and patterns
- Implement spec-driven development workflow
- Maintain simple, readable code without over-engineering

## Tech Stack

**Core Technologies**:
- **Svelte 4.2.8**: Reactive UI framework with compile-time optimization
- **Vite 5.0.10**: Fast build tool with HMR (Hot Module Replacement)
- **pnpm**: Fast, disk space efficient package manager
- **JavaScript (ES6+)**: No TypeScript, keeping it simple

**Development Tools**:
- **@sveltejs/vite-plugin-svelte 3.0.1**: Svelte integration for Vite
- **agentcmd-workflows 1.1.12**: Spec-driven development commands and workflows

**No Backend**: Pure frontend application using browser localStorage for data persistence.

## Project Structure

```
project/
├── .agent/                          # Spec-driven development system
│   ├── specs/                       # Feature specifications
│   │   ├── index.json              # Spec tracking database
│   │   ├── todo/                   # Active specs being worked on
│   │   │   ├── {id}-{feature}/    # Spec folder (e.g., 2511250629-story-feature/)
│   │   │   │   └── spec.md        # Feature specification document
│   │   ├── backlog/                # Future specs not yet started
│   │   └── done/                   # Completed specs for reference
│   └── docs/                       # Agent workflow documentation
│
├── .claude/                         # Claude Code configuration
│   └── commands/                    # Slash command definitions
│       └── cmd/                     # Command files
│           ├── generate-feature-spec.md
│           ├── implement-spec.md
│           ├── create-pr.md
│           └── ...                 # Other workflow commands
│
├── src/                            # Application source code
│   ├── App.svelte                  # Main application component
│   ├── main.js                     # Application entry point
│   ├── app.css                     # Global styles
│   ├── lib/                        # Shared utilities
│   │   ├── storage.js             # localStorage utilities (todos, nextId)
│   │   └── sync.js                # Synchronization utilities
│   ├── components/                 # Reusable UI components
│   │   └── (future components)
│   └── data/                       # Static data and content
│       └── (future data files)
│
├── dist/                           # Build output (gitignored)
├── node_modules/                   # Dependencies (gitignored)
│
├── index.html                      # HTML entry point
├── vite.config.js                  # Vite build configuration
├── svelte.config.js                # Svelte compiler configuration
├── package.json                    # Project dependencies and scripts
├── pnpm-lock.yaml                  # Locked dependency versions
├── pnpm-workspace.yaml             # pnpm workspace configuration
└── CLAUDE.md                       # This file - AI-readable documentation
```

## Development Workflow

### Available Commands

**Development**:
```bash
pnpm dev        # Start development server with HMR on http://localhost:5173
pnpm build      # Build for production (output to dist/)
pnpm preview    # Preview production build locally
```

### Spec-Driven Development

This project uses a structured specification workflow for all feature development:

**1. Generate Spec** - Create detailed implementation plan:
```bash
/cmd:generate-feature-spec [context]
```
- Analyzes feature requirements
- Creates spec folder in `.agent/specs/todo/{timestamp}-{feature-name}/`
- Generates `spec.md` with phases, tasks, and complexity estimates
- Updates `.agent/specs/index.json` tracking database

**2. Implement Spec** - Execute the implementation plan:
```bash
/cmd:implement-spec [specIdOrNameOrPath]
```
- Reads spec from todo/ folder
- Implements tasks step-by-step in order
- Updates spec status to "in-progress" then "review"
- Checks off tasks as they're completed
- Runs validation commands (build, lint, tests)

**3. Review Implementation** - Validate against spec:
```bash
/cmd:review-spec-implementation [specIdOrNameOrPath]
```
- Compares implementation against original spec
- Documents findings and deviations
- Identifies missing requirements

**4. Create PR** - Commit and push changes:
```bash
/cmd:create-pr [title]
```
- Commits changes with descriptive message
- Pushes to remote branch
- Creates pull request with AI-generated summary

**Other Workflow Commands**:
```bash
/cmd:list-specs                    # List all specs with status
/cmd:move-spec [spec] [folder]     # Move spec between todo/backlog/done
/cmd:generate-bug-spec [context]   # Create bug fix specification
/cmd:generate-prd [context]        # Create Product Requirements Document
/cmd:audit [mode]                  # Comprehensive codebase audit
```

### Git Workflow

**Branching**:
- `main` - Production-ready code
- `feature/*` - New features (e.g., `feature/story-feature`)
- `fix/*` - Bug fixes

**Commits**:
- Keep commits atomic and focused
- Use descriptive commit messages
- Reference spec IDs when applicable

## Architecture

### Component Architecture

Svelte components follow a standard three-section structure:

```svelte
<script>
  // 1. IMPORTS
  import { onMount } from 'svelte';
  import { loadTodos, saveTodos } from './lib/storage.js';

  // 2. STATE
  let todos = [];
  let newTodo = '';

  // 3. LIFECYCLE
  onMount(() => {
    todos = loadTodos();
  });

  // 4. REACTIVE STATEMENTS
  $: if (todos) {
    saveTodos(todos);
  }

  // 5. FUNCTIONS
  function addTodo() {
    todos = [...todos, { id: nextId++, text: newTodo }];
  }
</script>

<!-- 6. MARKUP -->
<div class="container">
  <h1>Todo App</h1>
  <button on:click={addTodo}>Add</button>
</div>

<!-- 7. STYLES (scoped by default) -->
<style>
  .container {
    background: white;
    border-radius: 12px;
  }
</style>
```

### State Management

**Local Component State**:
- Use `let` for mutable state
- Svelte automatically tracks dependencies and updates DOM
- Reassignment triggers reactivity: `todos = [...todos, newItem]`

**Reactive Statements**:
- `$:` prefix makes statements reactive
- Runs automatically when dependencies change
- Example: `$: activeTodos = todos.filter(t => !t.completed).length;`

**Persistence**:
- `src/lib/storage.js` handles localStorage operations
- Save on every state change using reactive statements
- Load on component mount using `onMount()`

### Data Flow

1. User interaction (click, input) triggers event handler
2. Event handler updates component state via reassignment
3. Svelte detects change and re-runs reactive statements
4. Reactive statements save to localStorage
5. DOM updates automatically based on state changes

## Coding Conventions

### File Naming

- **Components**: PascalCase (e.g., `StoryModal.svelte`)
- **Utilities**: kebab-case (e.g., `storage.js`, `sync.js`)
- **Data files**: kebab-case (e.g., `stories.js`)

### Svelte Patterns

**Reactivity**:
```javascript
// ✅ CORRECT - Triggers reactivity
todos = [...todos, newTodo];
todos = todos.filter(t => t.id !== id);

// ❌ WRONG - No reactivity
todos.push(newTodo);
todos.splice(index, 1);
```

**Event Handling**:
```svelte
<!-- Inline handlers -->
<button on:click={() => deleteTodo(todo.id)}>Delete</button>

<!-- Function reference -->
<button on:click={addTodo}>Add</button>

<!-- Keyboard events -->
<input on:keypress={handleKeyPress} />
```

**Conditional Rendering**:
```svelte
{#if todos.length === 0}
  <li class="empty-state">No todos yet</li>
{/if}

<!-- Conditional classes -->
<li class:completed={todo.completed}>
```

**Lists**:
```svelte
{#each todos as todo (todo.id)}
  <li>{todo.text}</li>
{/each}
```

### CSS Conventions

**Scoped Styles**: All styles in `<style>` blocks are component-scoped by default.

**Gradient Patterns**: Use gradients for visual interest:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

**Transitions**: Add smooth transitions for better UX:
```css
transition: transform 0.2s, box-shadow 0.2s;
```

**Hover Effects**: Use transform for interactive feedback:
```css
.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
```

## Spec System Documentation

The `.agent/specs/` directory contains all feature specifications using a folder-based organization system.

### Folder Structure

```
.agent/specs/
├── index.json          # Central tracking database
├── todo/              # Specs currently being implemented
├── backlog/           # Planned specs not yet started
└── done/              # Completed specs for reference
```

### Spec File Format

Each spec is in a folder named `{timestamp}-{feature-name}/spec.md`:

```markdown
# Feature Name

**Status**: draft | in-progress | review | done
**Created**: 2025-11-26
**Package**: project
**Total Complexity**: 32 points
**Phases**: 3
**Tasks**: 8

## Overview
Brief description of the feature

## User Story
As a [user type]
I want [goal]
So that [benefit]

## Step by Step Tasks

### Phase 1: Foundation
- [ ] 1.1 [3/10] Create base component
- [ ] 1.2 [4/10] Add state management

#### Completion Notes
(Filled in during implementation)

## Validation
Commands to verify implementation
```

### Complexity Scoring

Tasks are scored from 1-10 based on:
- **1-2**: Trivial changes (update text, add comment)
- **3-4**: Simple tasks (create file, add function)
- **5-6**: Moderate tasks (implement component with logic)
- **7-8**: Complex tasks (integrate multiple systems)
- **9-10**: Very complex (major refactoring, new architecture)

### index.json Structure

Tracks all specs with metadata:

```json
{
  "specs": {
    "2511250629": {
      "folder": "2511250629-story-feature",
      "path": "todo/2511250629-story-feature/spec.md",
      "spec_type": "feature",
      "status": "review",
      "created": "2025-11-25T13:29:41Z",
      "updated": "2025-11-26T13:55:02Z",
      "totalComplexity": 32,
      "phaseCount": 3,
      "taskCount": 8
    }
  }
}
```

### Workflow Example

**Creating and implementing a feature**:

1. Start with context:
   ```
   I want to add a "Tell me a story" button that shows random short stories
   ```

2. Generate spec:
   ```bash
   /cmd:generate-feature-spec
   ```
   Creates: `.agent/specs/todo/2511250629-story-feature/spec.md`

3. Review and approve spec, then implement:
   ```bash
   /cmd:implement-spec 2511250629
   ```
   - Reads spec file
   - Updates status to "in-progress"
   - Implements each task in order
   - Checks off tasks as completed
   - Fills in completion notes
   - Runs validation commands
   - Updates status to "review"

4. Create pull request:
   ```bash
   /cmd:create-pr "Add story feature"
   ```

## Common Tasks

### Adding a New Feature

1. Generate feature spec: `/cmd:generate-feature-spec`
2. Review the generated spec in `.agent/specs/todo/`
3. Implement: `/cmd:implement-spec {specId}`
4. Test manually in browser (`pnpm dev`)
5. Create PR: `/cmd:create-pr`

### Fixing a Bug

1. Generate bug spec: `/cmd:generate-bug-spec`
2. Implement: `/cmd:implement-spec {specId}`
3. Verify fix in browser
4. Create PR: `/cmd:create-pr`

### Adding a New Component

1. Create `src/components/ComponentName.svelte`
2. Follow three-section structure (script, markup, style)
3. Import in parent component
4. Use component: `<ComponentName prop={value} />`

### Adding localStorage Feature

1. Add functions to `src/lib/storage.js`:
   ```javascript
   export function loadData() {
     return JSON.parse(localStorage.getItem('key') || '[]');
   }

   export function saveData(data) {
     localStorage.setItem('key', JSON.stringify(data));
   }
   ```

2. Use in component:
   ```svelte
   <script>
     import { onMount } from 'svelte';
     import { loadData, saveData } from './lib/storage.js';

     let data = [];

     onMount(() => {
       data = loadData();
     });

     $: if (data) {
       saveData(data);
     }
   </script>
   ```

## Tips for Working with Claude Code

1. **Always reference this file first** - Run `/read CLAUDE.md` to understand project context
2. **Use the spec workflow** - Don't skip specs for non-trivial features
3. **Check tasks in spec** - Update spec.md as you complete each task
4. **Run validation** - Execute `pnpm build` after changes to catch errors
5. **Follow existing patterns** - Match the style of existing components
6. **Keep it simple** - Don't over-engineer; match the project's simplicity level
7. **Test in browser** - Run `pnpm dev` and test manually after changes

## References

- **Svelte Docs**: https://svelte.dev/docs
- **Vite Docs**: https://vitejs.dev/guide/
- **Claude Code**: https://github.com/anthropics/claude-code
- **Spec System**: `.agent/docs/` (internal documentation)
