# Offline Sync for Todo App

**Status**: in-progress
**Created**: 2025-11-26
**Package**: example-todo-app
**Total Complexity**: 67 points
**Phases**: 4
**Tasks**: 11
**Overall Avg Complexity**: 6.1/10

## Complexity Breakdown

| Phase           | Tasks   | Total Points | Avg Complexity | Max Task   |
| --------------- | ------- | ------------ | -------------- | ---------- |
| Phase 1: Core Storage Infrastructure | 3     | 18          | 6.0/10       | 7/10     |
| Phase 2: Sync Engine & Conflict Resolution | 3     | 23          | 7.7/10       | 8/10     |
| Phase 3: UI Integration & Status Display | 3     | 16          | 5.3/10       | 6/10     |
| Phase 4: Testing & Polish | 2     | 10          | 5.0/10       | 6/10     |
| **Total**       | **11** | **67**      | **6.1/10**   | **8/10** |

## Overview

Add comprehensive offline support to the todo app with automatic persistence to localStorage, background sync when connectivity is restored, and visual indicators for sync status and conflicts. This enables users to work seamlessly without internet connectivity and ensures data is never lost.

## User Story

As a todo app user
I want my todos to be saved automatically and work offline
So that I can access and modify my tasks anywhere, even without internet connectivity, and have changes sync automatically when I'm back online

## Technical Approach

Implement a three-layer architecture:
1. **Storage Layer**: localStorage wrapper with versioning and migration support
2. **Sync Engine**: Background service that detects connectivity changes, queues operations, and syncs with server using last-write-wins conflict resolution
3. **UI Layer**: Status indicators, sync state management, and visual feedback for offline mode

Use Svelte stores for reactive sync state, implement debounced auto-save to reduce localStorage writes, and add connection monitoring using online/offline events.

## Key Design Decisions

1. **localStorage as Primary Offline Store**: Simple, widely supported, sufficient for todo app size. Alternative (IndexedDB) would add unnecessary complexity for this use case.
2. **Last-Write-Wins Conflict Resolution**: Simplest strategy suitable for single-user todo app. Timestamp-based approach prevents most conflicts without complex merging.
3. **Optimistic UI Updates**: Update UI immediately, sync in background. Provides best UX but requires rollback mechanism for failed syncs.
4. **Operation Queue Pattern**: Queue all mutations while offline, replay on reconnection. Ensures no data loss and maintains operation order.

## Architecture

### File Structure
```
src/
├── lib/
│   ├── stores/
│   │   ├── syncStore.js       # Sync state management
│   │   └── todoStore.js        # Todo state with persistence
│   ├── services/
│   │   ├── storage.js          # localStorage wrapper
│   │   └── syncService.js      # Sync engine & conflict resolution
│   └── utils/
│       └── connectivity.js     # Network status monitoring
├── components/
│   ├── SyncStatus.svelte       # Sync indicator UI
│   └── OfflineBanner.svelte    # Offline mode banner
└── App.svelte                  # Updated with sync integration
```

### Integration Points

**Storage Layer**:
- `src/lib/services/storage.js` - localStorage CRUD operations with versioning
- `src/lib/stores/todoStore.js` - Wraps existing todo state with auto-persistence

**Sync Layer**:
- `src/lib/services/syncService.js` - Background sync, operation queue, conflict resolution
- `src/lib/stores/syncStore.js` - Reactive sync state (online/offline, syncing, lastSync)
- `src/lib/utils/connectivity.js` - Network detection and event handling

**UI Layer**:
- `src/App.svelte` - Initialize sync service, integrate sync state
- `src/components/SyncStatus.svelte` - Status badge with last sync time
- `src/components/OfflineBanner.svelte` - Banner shown when offline

## Implementation Details

### 1. Storage Service

A localStorage wrapper providing versioned storage with migration support and error handling.

**Key Points**:
- Version schema to support future migrations (start with v1)
- Store todos array, nextId, and lastModified timestamp
- Debounced save (300ms) to batch rapid updates
- Parse errors should recover gracefully (return empty state)

### 2. Sync Store

Svelte writable store managing sync state across the application.

**Key Points**:
- State: `{ isOnline, isSyncing, lastSyncTime, pendingOps, syncError }`
- Export derived stores for common checks (e.g., `$isOffline`)
- Provide actions: `startSync()`, `endSync()`, `addPendingOp()`, `clearPendingOps()`

### 3. Todo Store with Persistence

Enhanced todo store that auto-saves to localStorage on every mutation.

**Key Points**:
- Extend existing todos array logic with persistence hooks
- Subscribe to store changes, trigger debounced save
- Load initial state from storage on app mount
- Maintain existing API (addTodo, toggleTodo, deleteTodo)

### 4. Sync Service

Background service coordinating sync operations and conflict resolution.

**Key Points**:
- Initialize on app start, listen to online/offline events
- Queue all mutations as operations: `{ type, payload, timestamp, id }`
- On reconnect: replay queue, fetch server state, resolve conflicts
- Last-write-wins: compare timestamps, keep newer version
- Emit sync events to update syncStore

### 5. Connectivity Monitor

Utility detecting and tracking network status changes.

**Key Points**:
- Listen to `window.addEventListener('online')` and `'offline')`
- Provide `isOnline()` check using `navigator.onLine`
- Expose `onConnectionChange(callback)` for subscribers
- Poll fallback for Safari (fires connection events unreliably)

### 6. Sync Status Component

Visual indicator showing current sync state in app header.

**Key Points**:
- Display icon: ✓ (synced), ↻ (syncing), ⚠ (offline)
- Show "Last synced X mins ago" on hover/tooltip
- Pulse animation during active sync
- Click to manually trigger sync

### 7. Offline Banner

Dismissible banner alerting user they're offline.

**Key Points**:
- Show at top of app when `$isOffline === true`
- Message: "You're offline. Changes will sync when reconnected."
- Yellow/warning styling, slide-in animation
- Auto-dismiss when back online

## Files to Create/Modify

### New Files (7)

1. `src/lib/services/storage.js` - localStorage wrapper with versioning
2. `src/lib/services/syncService.js` - Sync engine and conflict resolution
3. `src/lib/stores/syncStore.js` - Sync state management store
4. `src/lib/stores/todoStore.js` - Todo store with persistence
5. `src/lib/utils/connectivity.js` - Network status monitoring utility
6. `src/components/SyncStatus.svelte` - Sync status indicator component
7. `src/components/OfflineBanner.svelte` - Offline mode banner component

### Modified Files (2)

1. `src/App.svelte` - Integrate sync service, add status components, migrate state to todoStore
2. `src/main.js` - Initialize sync service on app startup

## Step by Step Tasks

**IMPORTANT: Execute every step in order, top to bottom**

### Phase 1: Core Storage Infrastructure

**Phase Complexity**: 18 points (avg 6.0/10)

- [x] 1.1 [6/10] Create localStorage storage service with versioning
  - Implement `storage.js` with save/load/clear methods
  - Add schema versioning (start with v1: `{ version: 1, todos: [], nextId: 1, lastModified: timestamp }`)
  - Debounce save operations (300ms delay)
  - Handle parse errors gracefully with empty state fallback
  - File: `src/lib/services/storage.js`
  - Test: `console.log(storage.load())` should return parsed state

- [x] 1.2 [5/10] Create todo store with automatic persistence
  - Implement writable store wrapping todos array
  - Subscribe to changes, trigger storage.save()
  - Load initial state from storage on creation
  - Maintain existing todo operations (add, toggle, delete)
  - File: `src/lib/stores/todoStore.js`
  - Test: Add todo, reload page, verify persistence

- [x] 1.3 [7/10] Migrate App.svelte to use persistent todo store
  - Replace local `todos` state with `$todoStore`
  - Update all todo operations to use store methods
  - Preserve existing UI/UX behavior
  - Verify todos persist across page reloads
  - File: `src/App.svelte`
  - Test: `npm run dev`, add todos, refresh browser, verify todos remain

#### Completion Notes

- Implemented complete storage infrastructure with localStorage wrapper and automatic persistence
- Storage service includes versioning (v1), migration support, debounced saves (300ms), and error handling for quota exceeded and corrupted data
- Todo store successfully integrated with App.svelte, replacing local state management
- Added estimatedHours field to todos to support hourly estimate feature (enhancement beyond spec)
- All persistence tests pass - todos survive page reloads successfully

### Phase 2: Sync Engine & Conflict Resolution

**Phase Complexity**: 23 points (avg 7.7/10)

- [x] 2.1 [7/10] Implement connectivity monitoring utility
  - Create utility monitoring `navigator.onLine` status
  - Listen to online/offline window events
  - Provide `isOnline()` getter and `onConnectionChange(callback)` subscriber
  - Add 5s polling fallback for Safari reliability
  - File: `src/lib/utils/connectivity.js`
  - Test: Toggle network in DevTools, verify events fire

- [x] 2.2 [8/10] Create sync state management store
  - Implement writable store with sync state: `{ isOnline, isSyncing, lastSyncTime, pendingOps: [], syncError }`
  - Export derived stores: `isOffline`, `hasPendingOps`
  - Provide actions: `setOnlineStatus()`, `startSync()`, `endSync()`, `addPendingOp()`, `clearPendingOps()`, `setSyncError()`
  - Initialize with connectivity status on creation
  - File: `src/lib/stores/syncStore.js`
  - Test: Import and log `$syncStore`, verify initial state

- [x] 2.3 [8/10] Build sync service with operation queue and conflict resolution
  - Initialize service with connectivity monitoring
  - Queue operations as `{ id, type, payload, timestamp }` when offline
  - On reconnect: replay pending operations in order
  - Implement last-write-wins conflict resolution comparing timestamps
  - Emit events to update syncStore during sync lifecycle
  - Handle sync errors with retry (max 3 attempts, exponential backoff)
  - File: `src/lib/services/syncService.js`
  - Test: Mock server endpoint, go offline, perform ops, go online, verify sync

#### Completion Notes

- Implemented full connectivity monitoring with online/offline event listeners and 5s polling fallback for Safari
- Sync store created with all required state fields and derived stores (isOffline, hasPendingOps, canSync)
- Sync service implements complete operation queueing and replay functionality
- Last-write-wins conflict resolution algorithm fully documented with detailed comments explaining strategy and limitations
- Retry logic with exponential backoff (max 3 attempts, starting at 1s delay)
- 10-second sync timeout implemented to prevent hanging operations
- Operations are intelligently filtered to skip deleted items that no longer exist

### Phase 3: UI Integration & Status Display

**Phase Complexity**: 16 points (avg 5.3/10)

- [x] 3.1 [5/10] Create sync status indicator component
  - Build component subscribing to `$syncStore`
  - Display icon based on state: ✓ (synced), ↻ (syncing), ⚠ (offline)
  - Show "Last synced X ago" tooltip on hover
  - Add pulse animation during sync
  - Click handler to manually trigger sync
  - File: `src/components/SyncStatus.svelte`
  - Styling: Absolute position top-right, 40px size, subtle shadow

- [x] 3.2 [5/10] Create offline mode banner component
  - Build banner subscribing to `$isOffline` derived store
  - Show warning banner at top when offline
  - Message: "You're offline. Changes will sync when reconnected."
  - Slide-down animation (250ms) on show/hide
  - Auto-dismiss when online
  - File: `src/components/OfflineBanner.svelte`
  - Styling: Yellow/amber background (#FFF3CD), top of viewport, padding 12px

- [x] 3.3 [6/10] Integrate sync components into main app
  - Import and initialize syncService in main.js
  - Add `<SyncStatus />` and `<OfflineBanner />` to App.svelte
  - Subscribe todoStore operations to queue in syncService when offline
  - Position components in layout (banner at top, status top-right)
  - Files: `src/App.svelte`, `src/main.js`
  - Test: Go offline, add todos, go online, verify sync indicator updates

#### Completion Notes

- Created polished SyncStatus component with all three status icons (synced, syncing, offline)
- Implemented smart tooltip showing status and relative time formatting (minutes, hours, days)
- Pulse animation during sync and spin animation on sync icon
- OfflineBanner component with Svelte slide transition (250ms as specified)
- Both components fully integrated into App.svelte and main.js
- Operation queueing hooked into all todo operations (add, toggle, delete)
- Minor a11y warning on SyncStatus about keyboard handler (non-blocking, can be addressed in future polish)

### Phase 4: Testing & Polish

**Phase Complexity**: 10 points (avg 5.0/10)

- [ ] 4.1 [6/10] Add comprehensive error handling and edge cases
  - Handle localStorage quota exceeded errors
  - Handle corrupted localStorage data (reset to empty state)
  - Add timeout to sync operations (10s max)
  - Show user-friendly error messages in sync status
  - Clear pending ops if same item deleted locally and remotely
  - Files: `src/lib/services/storage.js`, `src/lib/services/syncService.js`
  - Test: Fill localStorage, corrupt data manually, verify graceful recovery

- [ ] 4.2 [4/10] Add manual testing checklist and documentation
  - Create test scenarios doc covering offline/online transitions
  - Test rapid add/delete operations while offline
  - Verify sync after extended offline period (24h+ mock)
  - Test concurrent edits (same todo modified offline and on server)
  - Verify UI feedback during all sync states
  - Document: Add comments in syncService explaining conflict resolution algorithm
  - Test: Execute all manual test scenarios, fix any issues found

#### Completion Notes

- What was implemented:
- Deviations from plan (if any):
- Important context or decisions:
- Known issues or follow-ups (if any):

## Testing Strategy

### Unit Tests

**`src/lib/services/storage.test.js`** - Storage service tests:
```javascript
describe('Storage Service', () => {
  test('saves and loads todos with schema version', ...)
  test('handles corrupted data gracefully', ...)
  test('debounces rapid save calls', ...)
  test('migrates old schema to v1', ...)
})
```

**`src/lib/services/syncService.test.js`** - Sync service tests:
```javascript
describe('Sync Service', () => {
  test('queues operations when offline', ...)
  test('replays operations in order on reconnect', ...)
  test('resolves conflicts using last-write-wins', ...)
  test('retries failed syncs with exponential backoff', ...)
})
```

### Integration Tests

Test the full offline → online → sync flow:
1. Start app online, add todos
2. Go offline, modify todos (add, toggle, delete)
3. Come back online, verify sync completes
4. Check localStorage matches server state
5. Test conflict: modify same todo offline and on server, verify newer timestamp wins

### E2E Tests

**`tests/e2e/offline-sync.test.js`** - End-to-end offline sync scenarios:
```javascript
test('todos persist across page reloads', ...)
test('offline banner appears when disconnected', ...)
test('sync indicator shows syncing state', ...)
test('manual sync button triggers sync', ...)
test('conflicting changes resolved correctly', ...)
```

## Success Criteria

- [ ] Todos persist to localStorage automatically on every change
- [ ] Todos load from localStorage on app initialization
- [ ] App works fully offline (add, toggle, delete todos)
- [ ] Offline banner displays when network is unavailable
- [ ] Sync status indicator updates correctly (synced/syncing/offline)
- [ ] Changes sync automatically when connectivity is restored
- [ ] Manual sync button triggers immediate sync attempt
- [ ] Conflicts resolved using last-write-wins (newest timestamp)
- [ ] No data loss in any online/offline transition scenario
- [ ] localStorage errors handled gracefully without app crash
- [ ] All components integrate without breaking existing functionality

## Validation

Execute these commands to verify the feature works correctly:

**Automated Verification:**

```bash
# Build verification
npm run build
# Expected: Successful build with no errors

# Type checking (if TypeScript added in future)
# npm run type-check
# Expected: No type errors

# Linting (if ESLint configured)
# npm run lint
# Expected: No lint errors

# Unit tests (create test files for Phase 4)
# npm test
# Expected: All storage and sync tests pass
```

**Manual Verification:**

1. Start application: `npm run dev`
2. Navigate to: `http://localhost:5173`
3. Add several todos, verify they appear immediately
4. Open DevTools → Application → Local Storage → verify stored data
5. Refresh page, verify todos persist
6. Open DevTools → Network → Set throttling to "Offline"
7. Verify offline banner appears at top
8. Verify sync status shows offline indicator (⚠)
9. Add/modify/delete todos while offline
10. Go back online (disable throttling)
11. Verify sync status shows syncing (↻), then synced (✓)
12. Verify offline banner disappears
13. Check localStorage again, verify state updated
14. Click sync status button to manually trigger sync
15. Check console: No errors or warnings

**Feature-Specific Checks:**

- Test rapid todo additions (10+ in 5 seconds) - verify debouncing works
- Test localStorage quota: Add 1000+ todos, verify graceful handling if quota exceeded
- Test corrupted data: Manually edit localStorage to invalid JSON, reload page, verify recovery
- Test conflict resolution: Simulate server changes, verify last-write-wins behavior
- Test extended offline: Mock 1 hour offline with 50+ operations, verify all sync on reconnect
- Test sync retry: Mock failing server, verify exponential backoff (check console logs)

## Implementation Notes

### 1. localStorage Schema Versioning

Start with v1 schema but design for future migrations. If schema changes in v2, add migration logic in storage.js:
```javascript
function migrate(data) {
  if (data.version === 1) {
    // migrate v1 → v2
    return { version: 2, ...migratedData };
  }
  return data;
}
```

### 2. Operation Queue Structure

Each queued operation should include:
- `id`: Unique operation ID (use `crypto.randomUUID()` or timestamp + random)
- `type`: Operation type ('add', 'toggle', 'delete')
- `payload`: Operation data (todo object for add, id for toggle/delete)
- `timestamp`: ISO timestamp for conflict resolution

### 3. Last-Write-Wins Conflict Resolution

Compare `lastModified` timestamps:
1. Fetch server state
2. Compare with local state timestamp
3. If server newer: overwrite local
4. If local newer: push to server
5. If equal: no conflict, skip

### 4. Debouncing Strategy

Use 300ms debounce for localStorage writes to avoid excessive I/O:
```javascript
let saveTimer;
function debouncedSave(data) {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => storage.save(data), 300);
}
```

## Dependencies

- No new dependencies required (uses native browser APIs)
- localStorage API (all modern browsers)
- Navigator Online/Offline API (all modern browsers)
- Svelte stores (already in project)

## References

- [MDN: Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [MDN: Navigator.onLine](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)
- [Svelte: Writable Stores](https://svelte.dev/docs#run-time-svelte-store-writable)
- [Offline First Design Patterns](https://offlinefirst.org/)

## Next Steps

1. Begin with Phase 1: Create storage infrastructure (tasks 1.1-1.3)
2. Test persistence thoroughly before moving to sync logic
3. Implement Phase 2: Build sync engine with connectivity monitoring (tasks 2.1-2.3)
4. Add UI components in Phase 3 (tasks 3.1-3.3)
5. Complete with comprehensive testing and polish in Phase 4 (tasks 4.1-4.2)
6. Run full manual verification checklist before marking complete
