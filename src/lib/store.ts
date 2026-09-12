import { useEffect, useState, useCallback } from 'react';
import type { Delivery, Driver, DeliveryStatus } from '@/types';
import { STORAGE_KEYS, DRIVER_LOCATION, CUSTOMER_LOCATION } from './constants';

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

const DEFAULT_DRIVER: Driver = {
  name: 'Karim Driver',
  phone: '+216 22 123 456',
  email: 'karim@droplink.app',
  plan: 'free',
};

function seedDeliveries(): Delivery[] {
  return [
    {
      id: 'DL-1042',
      customerName: 'Ahmed',
      reference: 'ORD-8842',
      amount: 42.5,
      notes: 'Apartment near the pharmacy',
      status: 'location_received',
      shareUrl: `${window.location.origin}/d/DL-1042`,
      customerLatitude: CUSTOMER_LOCATION.lat,
      customerLongitude: CUSTOMER_LOCATION.lng,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      linkSentAt: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
      customerOpenedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      locationReceivedAt: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
      distance: 4.7,
    },
    {
      id: 'DL-1041',
      customerName: 'Sonia',
      reference: 'ORD-8839',
      amount: 18,
      status: 'delivered',
      shareUrl: `${window.location.origin}/d/DL-1041`,
      customerLatitude: 36.8095,
      customerLongitude: 10.1685,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString(),
      locationReceivedAt: new Date(Date.now() - 1000 * 60 * 60 * 2.8).toISOString(),
      distance: 2.3,
    },
    {
      id: 'DL-1040',
      customerName: 'Mehdi',
      reference: 'ORD-8835',
      amount: 65,
      notes: 'Call before arriving',
      status: 'waiting_location',
      shareUrl: `${window.location.origin}/d/DL-1040`,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      linkSentAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    },
  ];
}

export function useDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    const stored = readJSON<Delivery[] | null>(STORAGE_KEYS.DELIVERIES, null);
    if (stored && stored.length > 0) {
      setDeliveries(stored);
    } else {
      const seed = seedDeliveries();
      setDeliveries(seed);
      writeJSON(STORAGE_KEYS.DELIVERIES, seed);
    }
  }, []);

  const persist = useCallback((next: Delivery[]) => {
    setDeliveries(next);
    writeJSON(STORAGE_KEYS.DELIVERIES, next);
  }, []);

  const createDelivery = useCallback(
    (data: Pick<Delivery, 'customerName' | 'reference' | 'amount' | 'notes'>) => {
      const id = `DL-${Math.floor(1000 + Math.random() * 9000)}`;
      const delivery: Delivery = {
        id,
        customerName: data.customerName,
        reference: data.reference || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        amount: data.amount,
        notes: data.notes,
        status: 'waiting_location',
        shareUrl: `${window.location.origin}/d/${id}`,
        createdAt: new Date().toISOString(),
      };
      setDeliveries((prev) => {
        const next = [delivery, ...prev];
        writeJSON(STORAGE_KEYS.DELIVERIES, next);
        return next;
      });
      return delivery;
    },
    []
  );

  const updateDelivery = useCallback((id: string, updates: Partial<Delivery>) => {
    setDeliveries((prev) => {
      const next = prev.map((d) => (d.id === id ? { ...d, ...updates } : d));
      writeJSON(STORAGE_KEYS.DELIVERIES, next);
      return next;
    });
  }, []);

  const shareLocation = useCallback(
    (id: string, lat: number, lng: number) => {
      setDeliveries((prev) => {
        const next = prev.map((d) =>
          d.id === id
            ? {
                ...d,
                status: 'location_received' as DeliveryStatus,
                customerLatitude: lat,
                customerLongitude: lng,
                locationReceivedAt: new Date().toISOString(),
                customerOpenedAt: d.customerOpenedAt ?? new Date().toISOString(),
                distance: calcDistance(DRIVER_LOCATION.lat, DRIVER_LOCATION.lng, lat, lng),
              }
            : d
        );
        writeJSON(STORAGE_KEYS.DELIVERIES, next);
        return next;
      });
    },
    []
  );

  const markDelivered = useCallback((id: string) => {
    setDeliveries((prev) => {
      const next = prev.map((d) =>
        d.id === id ? { ...d, status: 'delivered' as DeliveryStatus, completedAt: new Date().toISOString() } : d
      );
      writeJSON(STORAGE_KEYS.DELIVERIES, next);
      return next;
    });
  }, []);

  const markLinkSent = useCallback((id: string) => {
    setDeliveries((prev) => {
      const next = prev.map((d) => (d.id === id && !d.linkSentAt ? { ...d, linkSentAt: new Date().toISOString() } : d));
      writeJSON(STORAGE_KEYS.DELIVERIES, next);
      return next;
    });
  }, []);

  const markCustomerOpened = useCallback((id: string) => {
    setDeliveries((prev) => {
      const next = prev.map((d) =>
        d.id === id && !d.customerOpenedAt ? { ...d, customerOpenedAt: new Date().toISOString() } : d
      );
      writeJSON(STORAGE_KEYS.DELIVERIES, next);
      return next;
    });
  }, []);

  return {
    deliveries,
    createDelivery,
    updateDelivery,
    shareLocation,
    markDelivered,
    markLinkSent,
    markCustomerOpened,
    persist,
  };
}

export function useDriver() {
  const [driver, setDriver] = useState<Driver>(DEFAULT_DRIVER);

  useEffect(() => {
    setDriver(readJSON(STORAGE_KEYS.DRIVER, DEFAULT_DRIVER));
  }, []);

  const updateDriver = useCallback((updates: Partial<Driver>) => {
    setDriver((prev) => {
      const next = { ...prev, ...updates };
      writeJSON(STORAGE_KEYS.DRIVER, next);
      return next;
    });
  }, []);

  return { driver, updateDriver };
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(readJSON(STORAGE_KEYS.AUTH, false));
  }, []);

  const login = useCallback(() => {
    setIsAuthenticated(true);
    writeJSON(STORAGE_KEYS.AUTH, true);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    writeJSON(STORAGE_KEYS.AUTH, false);
  }, []);

  return { isAuthenticated, login, logout };
}

function calcDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

export { calcDistance };
