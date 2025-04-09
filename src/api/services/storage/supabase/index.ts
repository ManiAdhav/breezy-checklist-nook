
// Re-export all storage functions
export * from './core';
export * from './tasks';
export * from './lists';

// Re-export with specific names to avoid name conflicts
import * as getStoredTasks from './tasks';
import * as getStoredLists from './lists';

export { getStoredTasks, getStoredLists };
