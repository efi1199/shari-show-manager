import { useState, useCallback } from 'react';
import { EventOrder } from '@/types/event';

const STORAGE_KEY = 'sari_events';

function loadEvents(): EventOrder[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getSampleEvents();
  } catch {
    return getSampleEvents();
  }
}

function saveEvents(events: EventOrder[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function getSampleEvents(): EventOrder[] {
  return [
    {
      id: '1',
      clientName: 'רונית כהן',
      clientPhone: '050-1234567',
      eventDate: '2026-03-20',
      eventTime: '16:00',
      eventType: 'library',
      location: 'ספריית בית אריאלה, תל אביב',
      numberOfKids: 25,
      price: 1200,
      depositPaid: 400,
      invoiceStatus: 'invoice_sent',
      notes: 'פעילות לילדי גן',
      showType: 'show',
      showName: 'הצגת בובות קלאסית',
      createdAt: '2026-03-01',
    },
    {
      id: '2',
      clientName: 'מיכל לוי',
      clientPhone: '052-9876543',
      eventDate: '2026-03-25',
      eventTime: '10:00',
      eventType: 'kindergarten',
      location: 'גן ילדים "פרחים", רמת גן',
      numberOfKids: 35,
      price: 1500,
      depositPaid: 1500,
      invoiceStatus: 'paid',
      notes: '',
      showType: 'workshop',
      showName: 'סדנת יצירה עם בובות',
      createdAt: '2026-03-05',
    },
    {
      id: '3',
      clientName: 'דנה אברהם',
      clientPhone: '054-5551234',
      eventDate: '2026-04-02',
      eventTime: '17:30',
      eventType: 'matnас',
      location: 'מתנ"ס הרצליה',
      numberOfKids: 40,
      price: 1800,
      depositPaid: 0,
      invoiceStatus: 'not_sent',
      notes: 'צריך להביא מערכת הגברה',
      showType: 'show',
      showName: 'הצגה אינטראקטיבית',
      createdAt: '2026-03-10',
    },
  ];
}

export function useEvents() {
  const [events, setEvents] = useState<EventOrder[]>(loadEvents);

  const addEvent = useCallback((event: Omit<EventOrder, 'id' | 'createdAt'>): EventOrder => {
    const newEvent: EventOrder = {
      ...event,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setEvents(prev => {
      const updated = [...prev, newEvent];
      saveEvents(updated);
      return updated;
    });
    return newEvent;
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<EventOrder>) => {
    setEvents(prev => {
      const updated = prev.map(e => e.id === id ? { ...e, ...updates } : e);
      saveEvents(updated);
      return updated;
    });
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => {
      const updated = prev.filter(e => e.id !== id);
      saveEvents(updated);
      return updated;
    });
  }, []);

  return { events, addEvent, updateEvent, deleteEvent };
}
