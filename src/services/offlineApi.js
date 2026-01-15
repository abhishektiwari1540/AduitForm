import { offlineManager } from './offlineManager';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api/';

class OfflineAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.pendingSaves = new Map(); // Track pending saves by hash
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
        await this.syncToServer(templateId, data, isUpdate);
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
      
      const allTemplates = await store.getAll();
      
      // Find template with similar content
      const currentHash = this.generateSaveHash(data);
      
      return allTemplates.find(template => {
        const templateHash = this.generateSaveHash(template.data);
        return templateHash === currentHash;
      });
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
}

export default new OfflineAPI();