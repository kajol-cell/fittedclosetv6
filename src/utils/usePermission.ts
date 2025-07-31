import { useState, useEffect, useCallback, useRef } from 'react';
import {
  checkPermission,
  requestPermission,
  ensurePermission,
  PermissionStatus,
  PermissionType,
  showPermissionDeniedAlert,
  isPermissionPermanentlyDenied,
  canRequestPermission,
} from './permissionUtils';

interface UsePermissionOptions {
  autoCheck?: boolean;
  autoRequest?: boolean;
  onStatusChange?: (status: PermissionStatus) => void;
}

interface UsePermissionReturn {
  status: PermissionStatus;
  isLoading: boolean;
  check: () => Promise<void>;
  request: () => Promise<void>;
  ensure: () => Promise<boolean>;
  showSettingsAlert: () => void;
  isGranted: boolean;
  isDenied: boolean;
  isBlocked: boolean;
  canRequest: boolean;
}

/**
 * Custom hook for managing permissions
 */
export const usePermission = (
  type: PermissionType,
  options: UsePermissionOptions = {}
): UsePermissionReturn => {
  const { autoCheck = true, autoRequest = false, onStatusChange } = options;
  
  const [status, setStatus] = useState<PermissionStatus>('checking');
  const [isLoading, setIsLoading] = useState(false);

  const onStatusChangeRef = useRef(onStatusChange);
  onStatusChangeRef.current = onStatusChange;

  const updateStatus = useCallback((newStatus: PermissionStatus) => {
    setStatus(newStatus);
    onStatusChangeRef.current?.(newStatus);
  }, []);

  const check = useCallback(async () => {
    setIsLoading(true);
    try {
      const permissionStatus = await checkPermission(type);
      updateStatus(permissionStatus);
    } catch (error) {
      console.error(`Error checking ${type} permission:`, error);
      updateStatus('denied');
    } finally {
      setIsLoading(false);
    }
  }, [type, updateStatus]);

  const request = useCallback(async () => {
    setIsLoading(true);
    try {
      const permissionStatus = await requestPermission(type);
      updateStatus(permissionStatus);
    } catch (error) {
      console.error(`Error requesting ${type} permission:`, error);
      updateStatus('denied');
    } finally {
      setIsLoading(false);
    }
  }, [type, updateStatus]);

  const ensure = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await ensurePermission(type);
      const newStatus = result ? 'granted' : 'denied';
      updateStatus(newStatus);
      return result;
    } catch (error) {
      console.error(`Error ensuring ${type} permission:`, error);
      updateStatus('denied');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [type, updateStatus]);

  const showSettingsAlert = useCallback(() => {
    showPermissionDeniedAlert(type);
  }, [type]);

  // Auto-check permission on mount
  useEffect(() => {
    if (autoCheck) {
      check();
    }
  }, [autoCheck, check]);

  // Auto-request permission if needed
  useEffect(() => {
    if (autoRequest && status === 'denied' && !isLoading) {
      request();
    }
  }, [autoRequest, status, isLoading, request]);

  return {
    status,
    isLoading,
    check,
    request,
    ensure,
    showSettingsAlert,
    isGranted: status === 'granted' || status === 'limited',
    isDenied: status === 'denied',
    isBlocked: isPermissionPermanentlyDenied(status),
    canRequest: canRequestPermission(status),
  };
};

/**
 * Specialized hook for camera permission with common patterns
 */
export const useCameraPermission = (options: UsePermissionOptions = {}) => {
  return usePermission('camera', options);
};

/**
 * Specialized hook for photo library permission
 */
export const usePhotoLibraryPermission = (options: UsePermissionOptions = {}) => {
  return usePermission('photoLibrary', options);
};

/**
 * Hook for managing multiple permissions
 */
export const useMultiplePermissions = (
  types: PermissionType[],
  options: UsePermissionOptions = {}
) => {
  const permissions = types.map(type => usePermission(type, options));
  
  const allGranted = permissions.every(p => p.isGranted);
  const anyDenied = permissions.some(p => p.isDenied);
  const anyBlocked = permissions.some(p => p.isBlocked);
  const isLoading = permissions.some(p => p.isLoading);
  
  const checkAll = useCallback(async () => {
    await Promise.all(permissions.map(p => p.check()));
  }, [permissions]);
  
  const requestAll = useCallback(async () => {
    await Promise.all(permissions.map(p => p.request()));
  }, [permissions]);
  
  return {
    permissions,
    allGranted,
    anyDenied,
    anyBlocked,
    isLoading,
    checkAll,
    requestAll,
  };
}; 