import { offlineManager } from '../utils/offlineManager';

class OfflineAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }


    async saveAuditTemplate(data, isUpdate = false, templateId = null) {
    // Check if we have an offline-to-server ID mapping
    let finalTemplateId = templateId;
    let isOfflineId = false;
    
    if (templateId && templateId.toString().startsWith('offline_')) {
      isOfflineId = true;
      // Try to get server ID if this was previously synced
      const serverId = await offlineManager.getServerId(templateId);
      if (serverId) {
        finalTemplateId = serverId;
      }
    }
    
    const url = isUpdate && finalTemplateId && !isOfflineId
      ? `${this.baseURL}audit-templates/${finalTemplateId}`
      : `${this.baseURL}audit-templates/new`;
    
    const method = 'POST';
    
    // Prepare data with offline metadata
    const payload = {
      ...data,
      offlineId: isOfflineId ? templateId : null,
      isOffline: isOfflineId
    };
    
    // Always save locally first
    const localId = templateId || `offline_${Date.now()}`;
    await offlineManager.saveAuditTemplateLocally(localId, {
      ...data,
      template_id: localId,
      offlineId: isOfflineId ? templateId : null
    });
    
    // Queue for sync
    return this.post(url, payload, 'SAVE_TEMPLATE');
  }


    async syncPendingTemplates() {
    const pendingOps = JSON.parse(localStorage.getItem('pendingOperations') || '[]');
    const templateOps = pendingOps.filter(op => op.type === 'SAVE_TEMPLATE');
    
    const results = [];
    for (const op of templateOps) {
      const result = await offlineManager.syncOperation(op);
      results.push({
        offlineId: op.data?.offlineId,
        success: result,
        operationId: op.id
      });
    }
    
    return results;
  }

  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      return await response.json();
    } catch (error) {
      console.log('Offline - fetching from cache');
      // Try to get from cache
      const cache = await caches.open('api-cache');
      const cached = await cache.match(`${this.baseURL}${endpoint}`);
      if (cached) return await cached.json();
      throw error;
    }
  }

  async post(endpoint, data) {
    const operation = {
      type: 'CREATE',
      url: `${this.baseURL}${endpoint}`,
      data: data
    };

    if (!navigator.onLine) {
      // Queue for offline
      await offlineManager.queueOperation(operation);
      return { success: true, message: 'Queued for offline sync', data };
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      // Network failed, queue for retry
      await offlineManager.queueOperation(operation);
      throw error;
    }
  }

  async put(endpoint, id, data) {
    const operation = {
      type: 'UPDATE',
      url: `${this.baseURL}${endpoint}/${id}`,
      data: data
    };

    if (!navigator.onLine) {
      await offlineManager.queueOperation(operation);
      return { success: true, message: 'Queued for offline sync', data };
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      await offlineManager.queueOperation(operation);
      throw error;
    }
  }

  async delete(endpoint, id) {
    const operation = {
      type: 'DELETE',
      url: `${this.baseURL}${endpoint}/${id}`,
      data: { id }
    };

    if (!navigator.onLine) {
      await offlineManager.queueOperation(operation);
      return { success: true, message: 'Queued for offline sync' };
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}/${id}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      await offlineManager.queueOperation(operation);
      throw error;
    }
  }
}

export default OfflineAPI;