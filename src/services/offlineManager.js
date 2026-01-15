import { openDB } from 'idb';

class OfflineManager {
  constructor() {
    this.dbName = 'AuditEditorDB';
    this.storeName = 'operations';
    this.initDB();
  }

  async initDB() {
    this.db = await openDB(this.dbName, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('operations')) {
          db.createObjectStore('operations', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('auditTemplates')) {
          db.createObjectStore('auditTemplates', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('responseSets')) {
          db.createObjectStore('responseSets', { keyPath: 'id' });
        }
      },
    });
  }

  // Save operation to queue
  async queueOperation(operation) {
    const op = {
      ...operation,
      timestamp: new Date().toISOString(),
      status: 'pending',
      attempts: 0
    };

    // Store in IndexedDB
    await this.db.add('operations', op);
    
    // Store in localStorage for quick access
    const pendingOps = JSON.parse(localStorage.getItem('pendingOperations') || '[]');
    pendingOps.push(op);
    localStorage.setItem('pendingOperations', JSON.stringify(pendingOps));
    
    // Register background sync if online
    if (navigator.onLine && 'serviceWorker' in navigator && 'SyncManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-operations');
      } catch (error) {
        console.log('Background sync registration failed:', error);
      }
    }

    return op.id;
  }

  // Save audit template locally
  async saveAuditTemplateLocally(templateId, data) {
    const template = {
      id: templateId,
      data: data,
      timestamp: new Date().toISOString(),
      lastSynced: null,
      isDirty: true
    };
    
    await this.db.put('auditTemplates', template);
    localStorage.setItem(`auditTemplate_${templateId}`, JSON.stringify(template));
  }

  // Get audit template from local storage
  async getAuditTemplate(templateId) {
    // Try IndexedDB first
    try {
      const template = await this.db.get('auditTemplates', templateId);
      if (template) return template;
    } catch (error) {
      console.log('Error getting from IndexedDB:', error);
    }

    // Fallback to localStorage
    const localData = localStorage.getItem(`auditTemplate_${templateId}`);
    return localData ? JSON.parse(localData) : null;
  }

  // Sync pending operations when online
  async syncPendingOperations() {
    if (!navigator.onLine) return;

    const pendingOps = JSON.parse(localStorage.getItem('pendingOperations') || '[]');
    
    for (const op of pendingOps) {
      await this.syncOperation(op);
    }
  }

  async syncOperation(operation) {
    try {
      let response;
      
      switch (operation.type) {
        case 'SAVE_TEMPLATE':
          response = await fetch(operation.url, {
            method: operation.method || 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Offline-Operation': 'true',
              'X-Operation-ID': operation.id
            },
            body: JSON.stringify(operation.data)
          });
          break;

        case 'SAVE_RESPONSE_SET':
          response = await fetch(operation.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Offline-Operation': 'true',
              'X-Operation-ID': operation.id
            },
            body: JSON.stringify(operation.data)
          });
          break;

        case 'UPDATE_RESPONSE_SET':
          response = await fetch(operation.url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Offline-Operation': 'true',
              'X-Operation-ID': operation.id
            },
            body: JSON.stringify(operation.data)
          });
          break;

        case 'DELETE_RESPONSE_SET':
          response = await fetch(operation.url, {
            method: 'DELETE',
            headers: {
              'X-Offline-Operation': 'true',
              'X-Operation-ID': operation.id
            }
          });
          break;

        default:
          console.log('Unknown operation type:', operation.type);
          return;
      }

      if (response.ok) {
        // Remove from queue
        await this.removeFromQueue(operation.id);
        
        // Broadcast success to UI
        this.broadcastMessage({
          type: 'SYNC_SUCCESS',
          operationId: operation.id,
          operationType: operation.type
        });
        
        console.log(`Operation ${operation.id} synced successfully`);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Sync failed:', error);
      
      // Update attempt count
      operation.attempts = (operation.attempts || 0) + 1;
      
      if (operation.attempts < 3) {
        // Retry later
        await this.updateOperation(operation);
      } else {
        // Mark as failed after 3 attempts
        await this.markOperationFailed(operation.id);
      }
    }
  }

  async removeFromQueue(operationId) {
    // Remove from IndexedDB
    await this.db.delete('operations', operationId);
    
    // Remove from localStorage
    const pendingOps = JSON.parse(localStorage.getItem('pendingOperations') || '[]');
    const updatedOps = pendingOps.filter(op => op.id !== operationId);
    localStorage.setItem('pendingOperations', JSON.stringify(updatedOps));
  }

  async updateOperation(operation) {
    await this.db.put('operations', operation);
  }

  async markOperationFailed(operationId) {
    const op = await this.db.get('operations', operationId);
    if (op) {
      op.status = 'failed';
      await this.db.put('operations', op);
    }
  }

  broadcastMessage(message) {
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage(message);
    }
    
    // Also dispatch event for local components
    window.dispatchEvent(new CustomEvent('offline-operation', {
      detail: message
    }));
  }

  // Get pending operations count
  getPendingOperationsCount() {
    const pendingOps = JSON.parse(localStorage.getItem('pendingOperations') || '[]');
    return pendingOps.length;
  }

  // Clear all pending operations (for debugging)
  async clearAllPendingOperations() {
    await this.db.clear('operations');
    localStorage.removeItem('pendingOperations');
  }

  // Check if we're online
  isOnline() {
    return navigator.onLine;
  }

  // Listen for online/offline events
  setupEventListeners(callback) {
    const handleOnline = () => {
      console.log('App is online, syncing...');
      this.syncPendingOperations();
      callback?.('online');
    };

    const handleOffline = () => {
      console.log('App is offline');
      callback?.('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }
}

export const offlineManager = new OfflineManager();