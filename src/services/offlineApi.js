import { offlineManager } from './offlineManager';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api/';

class OfflineAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.pendingSaves = new Map(); // Track pending saves by hash
    this.dbName = 'AuditAppDB';
    this.dbVersion = 1;
    this.isSyncing = false;
    this.syncListeners = [];
  }

  // Initialize IndexedDB
  async getDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = (event) => {
        reject(`IndexedDB error: ${event.target.errorCode}`);
      };
      
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object store for templates if it doesn't exist
        if (!db.objectStoreNames.contains('templates')) {
          const templateStore = db.createObjectStore('templates', { keyPath: 'id' });
          templateStore.createIndex('by_updated', 'updated_at');
          templateStore.createIndex('by_sync_status', 'sync_status');
          templateStore.createIndex('by_last_synced', 'last_synced');
        }
        
        // Create object store for pending operations if it doesn't exist
        if (!db.objectStoreNames.contains('pending_operations')) {
          const pendingStore = db.createObjectStore('pending_operations', { 
            keyPath: 'id',
            autoIncrement: true 
          });
          pendingStore.createIndex('by_type', 'type');
          pendingStore.createIndex('by_status', 'status');
        }
        
        // Create object store for sync history if it doesn't exist
        if (!db.objectStoreNames.contains('sync_history')) {
          const syncStore = db.createObjectStore('sync_history', { 
            keyPath: 'id',
            autoIncrement: true 
          });
          syncStore.createIndex('by_template_id', 'template_id');
          syncStore.createIndex('by_sync_time', 'sync_time');
        }
      };
    });
  }

  // Helper method to execute IndexedDB requests as promises
  executeRequest(store, method, ...args) {
    return new Promise((resolve, reject) => {
      const request = store[method](...args);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Save to IndexedDB
  async saveToIndexedDB(templateId, data, isUpdate = false) {
    try {
      const db = await this.getDatabase();
      const transaction = db.transaction(['templates'], 'readwrite');
      const store = transaction.objectStore('templates');
      
      const templateRecord = {
        id: templateId,
        data: data,
        sync_status: navigator.onLine ? 'synced' : 'pending',
        updated_at: new Date().toISOString(),
        created_at: !isUpdate ? new Date().toISOString() : undefined,
        last_synced: navigator.onLine ? new Date().toISOString() : null
      };
      
      if (isUpdate) {
        // For updates, first get existing record to preserve created_at
        const existing = await this.executeRequest(store, 'get', templateId);
        if (existing && existing.created_at) {
          templateRecord.created_at = existing.created_at;
        }
      }
      
      await this.executeRequest(store, 'put', templateRecord);
      
      return {
        success: true,
        message: isUpdate ? 'Template updated locally' : 'Template saved locally',
        templateId: templateId,
        syncStatus: templateRecord.sync_status,
        timestamp: templateRecord.updated_at
      };
    } catch (error) {
      console.error('Error saving to IndexedDB:', error);
      throw error;
    }
  }

  // Sync to server
  async syncToServer(templateId, data, isUpdate = false) {
    try {
      const url = isUpdate 
        ? `${this.baseURL}audit-template/${templateId}`
        : `${this.baseURL}audit-template`;
      
      const method = isUpdate ? 'PUT' : 'POST';
      
      console.log(`Syncing template ${templateId} to server via ${method}`);
      
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        const serverResponse = await response.json();
        
        // Update sync status in IndexedDB
        const db = await this.getDatabase();
        const transaction = db.transaction(['templates'], 'readwrite');
        const store = transaction.objectStore('templates');
        
        const existing = await this.executeRequest(store, 'get', templateId);
        if (existing) {
          existing.sync_status = 'synced';
          existing.last_synced = new Date().toISOString();
          existing.server_id = serverResponse.id || serverResponse.templateId || templateId;
          await this.executeRequest(store, 'put', existing);
          
          // Record sync history
          await this.recordSyncHistory(templateId, existing.server_id, 'success');
        }
        
        return {
          success: true,
          message: isUpdate ? 'Template synced to server' : 'Template created on server',
          serverResponse: serverResponse
        };
      } else {
        throw new Error(`Server returned ${response.status}`);
      }
    } catch (error) {
      console.error('Error syncing to server:', error);
      
      // Mark as pending sync
      const db = await this.getDatabase();
      const transaction = db.transaction(['templates'], 'readwrite');
      const store = transaction.objectStore('templates');
      
      const existing = await this.executeRequest(store, 'get', templateId);
      if (existing) {
        existing.sync_status = 'pending';
        existing.last_sync_error = error.message;
        await this.executeRequest(store, 'put', existing);
        
        // Record sync failure
        await this.recordSyncHistory(templateId, null, 'failed', error.message);
      }
      
      throw error;
    }
  }

  // Record sync history
  async recordSyncHistory(templateId, serverId, status, error = null) {
    try {
      const db = await this.getDatabase();
      const transaction = db.transaction(['sync_history'], 'readwrite');
      const store = transaction.objectStore('sync_history');
      
      const record = {
        template_id: templateId,
        server_id: serverId,
        status: status,
        sync_time: new Date().toISOString(),
        error: error
      };
      
      await this.executeRequest(store, 'add', record);
    } catch (error) {
      console.error('Error recording sync history:', error);
    }
  }

  // Wrap axios or fetch calls with offline support
  async get(url) {
    if (!navigator.onLine) {
      // Try to get from local storage
      const cached = localStorage.getItem(`cache_${url}`);
      if (cached) {
        return JSON.parse(cached);
      }
      throw new Error('Offline: No cached data available');
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      // Cache the response
      localStorage.setItem(`cache_${url}`, JSON.stringify(data));
      
      return data;
    } catch (error) {
      // Fallback to cache
      const cached = localStorage.getItem(`cache_${url}`);
      if (cached) {
        return JSON.parse(cached);
      }
      throw error;
    }
  }

  async post(url, data, operationType = 'SAVE_TEMPLATE') {
    const operation = {
      type: operationType,
      url: url,
      data: data,
      method: 'POST',
      timestamp: new Date().toISOString()
    };

    if (!navigator.onLine) {
      // Queue for offline
      const operationId = await offlineManager.queueOperation(operation);
      return { 
        success: true, 
        message: 'Queued for offline sync', 
        operationId,
        data 
      };
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      // Network failed, queue for retry
      const operationId = await offlineManager.queueOperation(operation);
      throw { 
        error, 
        operationId,
        message: 'Network error, queued for retry'
      };
    }
  }

  async put(url, data, operationType = 'UPDATE_TEMPLATE') {
    const operation = {
      type: operationType,
      url: url,
      data: data,
      method: 'PUT',
      timestamp: new Date().toISOString()
    };

    if (!navigator.onLine) {
      const operationId = await offlineManager.queueOperation(operation);
      return { 
        success: true, 
        message: 'Queued for offline sync', 
        operationId,
        data 
      };
    }

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      const operationId = await offlineManager.queueOperation(operation);
      throw { 
        error, 
        operationId,
        message: 'Network error, queued for retry'
      };
    }
  }

  async delete(url, operationType = 'DELETE_TEMPLATE') {
    const operation = {
      type: operationType,
      url: url,
      method: 'DELETE',
      timestamp: new Date().toISOString()
    };

    if (!navigator.onLine) {
      const operationId = await offlineManager.queueOperation(operation);
      return { 
        success: true, 
        message: 'Queued for offline sync', 
        operationId 
      };
    }

    try {
      const response = await fetch(url, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      const operationId = await offlineManager.queueOperation(operation);
      throw { 
        error, 
        operationId,
        message: 'Network error, queued for retry'
      };
    }
  }

  // Special method for audit templates
  async saveAuditTemplate(templateId, data, isUpdate = false) {
    const saveHash = data.save_hash || this.generateSaveHash(data);
    
    // Check if identical save is already in progress
    if (this.pendingSaves.has(saveHash)) {
      console.log('Identical save already in progress, skipping');
      return {
        success: true,
        message: 'Save already in progress',
        duplicate: true
      };
    }
    
    // Add to pending saves
    this.pendingSaves.set(saveHash, {
      timestamp: Date.now(),
      templateId,
      data
    });
    
    try {
      // Check if identical template already exists locally
      const existingTemplate = await this.findExistingTemplate(data);
      
      if (existingTemplate) {
        console.log('Found existing identical template, updating instead');
        templateId = existingTemplate.id;
        isUpdate = true;
      }
      
      // Save to IndexedDB with deduplication
      const result = await this.saveToIndexedDB(templateId, data, isUpdate);
      
      // If online, sync immediately
      if (navigator.onLine) {
        try {
          await this.syncToServer(templateId, data, isUpdate);
          result.syncedToServer = true;
        } catch (syncError) {
          console.warn('Sync to server failed, template saved locally:', syncError);
          result.syncError = syncError.message;
        }
      }
      
      return result;
    } finally {
      // Clean up pending saves after 30 seconds
      setTimeout(() => {
        this.pendingSaves.delete(saveHash);
      }, 30000);
    }
  }
  
  async findExistingTemplate(data) {
    try {
      const db = await this.getDatabase();
      const transaction = db.transaction(['templates'], 'readonly');
      const store = transaction.objectStore('templates');
      
      // Use executeRequest to properly handle the promise
      const allTemplates = await this.executeRequest(store, 'getAll');
      
      // Find template with similar content
      const currentHash = this.generateSaveHash(data);
      
      if (Array.isArray(allTemplates)) {
        return allTemplates.find(template => {
          const templateHash = this.generateSaveHash(template.data);
          return templateHash === currentHash;
        });
      }
      return null;
    } catch (error) {
      console.error('Error finding existing template:', error);
      return null;
    }
  }

  generateSaveHash(data) {
    // Create a stable hash of the data
    const stableData = {
      pages: data.template_data?.pages || data.pages,
      unit_details: data.unit_details,
      audit_started: data.audit_started,
      audit_start_time: data.audit_start_time
    };
    
    return btoa(JSON.stringify(stableData));
  }
  
  // Save response sets with offline support
  async saveResponseSet(data, isUpdate = false, setId = null) {
    const url = isUpdate && setId
      ? `${this.baseURL}multiple-choice/global-response-sets/${setId}`
      : `${this.baseURL}multiple-choice/global-response-sets`;
    
    const method = isUpdate ? 'put' : 'post';
    const operationType = isUpdate ? 'UPDATE_RESPONSE_SET' : 'SAVE_RESPONSE_SET';
    
    return this[method](url, data, operationType);
  }

  async deleteResponseSet(setId) {
    const url = `${this.baseURL}multiple-choice/global-response-sets/${setId}`;
    return this.delete(url, 'DELETE_RESPONSE_SET');
  }

  // SYNC FUNCTIONALITY - Delete synced entries after successful sync
  async syncAllPendingTemplates() {
    if (this.isSyncing) {
      console.log('Sync already in progress');
      return { success: false, message: 'Sync already in progress' };
    }
    
    if (!navigator.onLine) {
      return { success: false, message: 'Cannot sync: offline' };
    }
    
    this.isSyncing = true;
    this.notifySyncStart();
    
    try {
      const pendingTemplates = await this.getPendingTemplates();
      
      if (pendingTemplates.length === 0) {
        this.isSyncing = false;
        this.notifySyncComplete(0, 0, []);
        return { 
          success: true, 
          message: 'No pending templates to sync',
          syncedCount: 0,
          deletedCount: 0
        };
      }
      
      console.log(`Syncing ${pendingTemplates.length} pending templates`);
      
      const syncedTemplates = [];
      const failedTemplates = [];
      
      // Sync each pending template
      for (const template of pendingTemplates) {
        try {
          const result = await this.syncToServer(
            template.id, 
            template.data, 
            template.sync_status === 'pending_update'
          );
          
          syncedTemplates.push({
            id: template.id,
            server_id: result.serverResponse?.id || template.id
          });
          
          // Notify progress
          this.notifySyncProgress(syncedTemplates.length, pendingTemplates.length);
          
        } catch (error) {
          console.error(`Failed to sync template ${template.id}:`, error);
          failedTemplates.push({
            id: template.id,
            error: error.message
          });
        }
      }
      
      // Delete successfully synced templates from IndexedDB
      const deletedCount = await this.deleteSyncedTemplates(syncedTemplates.map(t => t.id));
      
      this.isSyncing = false;
      this.notifySyncComplete(syncedTemplates.length, deletedCount, failedTemplates);
      
      return {
        success: true,
        message: `Sync completed: ${syncedTemplates.length} synced, ${deletedCount} deleted locally, ${failedTemplates.length} failed`,
        syncedCount: syncedTemplates.length,
        deletedCount: deletedCount,
        failedCount: failedTemplates.length,
        failedTemplates: failedTemplates
      };
      
    } catch (error) {
      this.isSyncing = false;
      this.notifySyncError(error);
      console.error('Error during sync:', error);
      throw error;
    }
  }
  
  async getPendingTemplates() {
    try {
      const db = await this.getDatabase();
      const transaction = db.transaction(['templates'], 'readonly');
      const store = transaction.objectStore('templates');
      const syncStatusIndex = store.index('by_sync_status');
      
      // Get all templates with pending sync status
      const pendingTemplates = await this.executeRequest(syncStatusIndex, 'getAll', 'pending');
      const pendingUpdateTemplates = await this.executeRequest(syncStatusIndex, 'getAll', 'pending_update');
      
      return [...(pendingTemplates || []), ...(pendingUpdateTemplates || [])];
    } catch (error) {
      console.error('Error getting pending templates:', error);
      return [];
    }
  }
  
  async deleteSyncedTemplates(templateIds) {
    if (!templateIds || templateIds.length === 0) {
      return 0;
    }
    
    try {
      const db = await this.getDatabase();
      const transaction = db.transaction(['templates'], 'readwrite');
      const store = transaction.objectStore('templates');
      
      let deletedCount = 0;
      
      for (const templateId of templateIds) {
        try {
          await this.executeRequest(store, 'delete', templateId);
          deletedCount++;
          
          // Also clean up sync history for this template
          await this.cleanupSyncHistory(templateId);
          
        } catch (error) {
          console.error(`Error deleting template ${templateId}:`, error);
        }
      }
      
      console.log(`Deleted ${deletedCount} synced templates from IndexedDB`);
      return deletedCount;
      
    } catch (error) {
      console.error('Error deleting synced templates:', error);
      return 0;
    }
  }
  
  async cleanupSyncHistory(templateId) {
    try {
      const db = await this.getDatabase();
      const transaction = db.transaction(['sync_history'], 'readwrite');
      const store = transaction.objectStore('sync_history');
      const templateIdIndex = store.index('by_template_id');
      
      // Get all history entries for this template
      const historyEntries = await this.executeRequest(templateIdIndex, 'getAll', templateId);
      
      if (historyEntries && historyEntries.length > 0) {
        // Keep only the last 5 entries for each template
        const entriesToDelete = historyEntries
          .sort((a, b) => new Date(b.sync_time) - new Date(a.sync_time))
          .slice(5);
          
        for (const entry of entriesToDelete) {
          await this.executeRequest(store, 'delete', entry.id);
        }
      }
    } catch (error) {
      console.error('Error cleaning up sync history:', error);
    }
  }
  
  // Event listeners for sync status
  onSyncStart(callback) {
    this.syncListeners.push({ type: 'start', callback });
  }
  
  onSyncProgress(callback) {
    this.syncListeners.push({ type: 'progress', callback });
  }
  
  onSyncComplete(callback) {
    this.syncListeners.push({ type: 'complete', callback });
  }
  
  onSyncError(callback) {
    this.syncListeners.push({ type: 'error', callback });
  }
  
  notifySyncStart() {
    this.syncListeners.forEach(listener => {
      if (listener.type === 'start') listener.callback();
    });
  }
  
  notifySyncProgress(current, total) {
    this.syncListeners.forEach(listener => {
      if (listener.type === 'progress') listener.callback(current, total);
    });
  }
  
  notifySyncComplete(syncedCount, deletedCount, failedTemplates) {
    this.syncListeners.forEach(listener => {
      if (listener.type === 'complete') listener.callback(syncedCount, deletedCount, failedTemplates);
    });
  }
  
  notifySyncError(error) {
    this.syncListeners.forEach(listener => {
      if (listener.type === 'error') listener.callback(error);
    });
  }

  // Additional helper methods for IndexedDB
  async getAllTemplates() {
    try {
      const db = await this.getDatabase();
      const transaction = db.transaction(['templates'], 'readonly');
      const store = transaction.objectStore('templates');
      return await this.executeRequest(store, 'getAll');
    } catch (error) {
      console.error('Error getting all templates:', error);
      return [];
    }
  }

  async getTemplateById(templateId) {
    try {
      const db = await this.getDatabase();
      const transaction = db.transaction(['templates'], 'readonly');
      const store = transaction.objectStore('templates');
      return await this.executeRequest(store, 'get', templateId);
    } catch (error) {
      console.error('Error getting template by ID:', error);
      return null;
    }
  }

  async deleteTemplate(templateId) {
    try {
      const db = await this.getDatabase();
      const transaction = db.transaction(['templates'], 'readwrite');
      const store = transaction.objectStore('templates');
      await this.executeRequest(store, 'delete', templateId);
      return { success: true, message: 'Template deleted locally' };
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }
  
  // Cleanup old data (optional - can be called periodically)
  async cleanupOldData(daysToKeep = 30) {
    try {
      const db = await this.getDatabase();
      const transaction = db.transaction(['templates', 'sync_history'], 'readwrite');
      const templateStore = transaction.objectStore('templates');
      const historyStore = transaction.objectStore('sync_history');
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      const allTemplates = await this.executeRequest(templateStore, 'getAll');
      const allHistory = await this.executeRequest(historyStore, 'getAll');
      
      let deletedTemplates = 0;
      let deletedHistory = 0;
      
      // Delete old synced templates
      if (allTemplates) {
        for (const template of allTemplates) {
          if (template.sync_status === 'synced' && template.last_synced) {
            const lastSyncedDate = new Date(template.last_synced);
            if (lastSyncedDate < cutoffDate) {
              await this.executeRequest(templateStore, 'delete', template.id);
              deletedTemplates++;
            }
          }
        }
      }
      
      // Delete old history entries
      if (allHistory) {
        for (const history of allHistory) {
          const syncDate = new Date(history.sync_time);
          if (syncDate < cutoffDate) {
            await this.executeRequest(historyStore, 'delete', history.id);
            deletedHistory++;
          }
        }
      }
      
      console.log(`Cleanup: Deleted ${deletedTemplates} old templates and ${deletedHistory} old history entries`);
      return { deletedTemplates, deletedHistory };
      
    } catch (error) {
      console.error('Error during cleanup:', error);
      return { deletedTemplates: 0, deletedHistory: 0 };
    }
  }
}

export default new OfflineAPI(API_BASE_URL);