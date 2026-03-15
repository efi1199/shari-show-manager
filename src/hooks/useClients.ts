import { useState, useCallback } from 'react';
import { Client, Interaction } from '@/types/client';

const STORAGE_KEY = 'sari_clients';

function loadClients(): Client[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getSampleClients();
  } catch {
    return getSampleClients();
  }
}

function saveClients(clients: Client[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

function getSampleClients(): Client[] {
  const now = new Date().toISOString();
  return [
    {
      id: '1',
      name: 'רונית כהן',
      phone: '050-1234567',
      email: 'ronit@example.com',
      location: 'ספריית בית אריאלה, תל אביב',
      status: 'active',
      source: 'referral',
      followUpDate: undefined,
      interactions: [
        { id: '1', date: '2026-03-01', type: 'call', summary: 'התקשרה לברר על יום הולדת לבת' },
        { id: '2', date: '2026-03-02', type: 'whatsapp', summary: 'שלחתי הצעת מחיר' },
        { id: '3', date: '2026-03-03', type: 'whatsapp', summary: 'אישרה! נסגר ל-20/3' },
      ],
      notes: 'לקוחה מאוד נחמדה, הגיעה דרך המלצה של מיכל',
      createdAt: '2026-03-01T10:00:00Z',
      updatedAt: now,
    },
    {
      id: '2',
      name: 'יעל ברק',
      phone: '052-1112233',
      email: '',
      location: 'גן "שקד", רמת גן',
      status: 'lead',
      source: 'facebook',
      followUpDate: '2026-03-17',
      interactions: [
        { id: '1', date: '2026-03-14', type: 'whatsapp', summary: 'הגיעה מפרסום בפייסבוק, מתעניינת בגן' },
      ],
      notes: 'גננת בגן "שקד", רוצה הצגה לפורים',
      createdAt: '2026-03-14T14:00:00Z',
      updatedAt: now,
    },
    {
      id: '3',
      name: 'דנה אברהם',
      phone: '054-5551234',
      email: 'dana.a@gmail.com',
      location: 'מתנ"ס הרצליה',
      status: 'lead',
      source: 'instagram',
      followUpDate: '2026-03-16',
      interactions: [
        { id: '1', date: '2026-03-10', type: 'call', summary: 'מתעניינת ביום הולדת לבן, עדיין לא סגרה תאריך' },
      ],
      notes: 'צריך לחזור אליה',
      createdAt: '2026-03-10T09:00:00Z',
      updatedAt: now,
    },
  ];
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>(loadClients);

  const addClient = useCallback((client: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'interactions'>) => {
    const now = new Date().toISOString();
    const newClient: Client = {
      ...client,
      id: crypto.randomUUID(),
      interactions: [],
      createdAt: now,
      updatedAt: now,
    };
    setClients(prev => {
      const updated = [...prev, newClient];
      saveClients(updated);
      return updated;
    });
    return newClient;
  }, []);

  const updateClient = useCallback((id: string, updates: Partial<Omit<Client, 'id' | 'createdAt'>>) => {
    setClients(prev => {
      const updated = prev.map(c =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      );
      saveClients(updated);
      return updated;
    });
  }, []);

  const deleteClient = useCallback((id: string) => {
    setClients(prev => {
      const updated = prev.filter(c => c.id !== id);
      saveClients(updated);
      return updated;
    });
  }, []);

  const addInteraction = useCallback((clientId: string, interaction: Omit<Interaction, 'id'>) => {
    setClients(prev => {
      const updated = prev.map(c => {
        if (c.id === clientId) {
          return {
            ...c,
            interactions: [...c.interactions, { ...interaction, id: crypto.randomUUID() }],
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      });
      saveClients(updated);
      return updated;
    });
  }, []);

  const getClientById = useCallback((id: string) => {
    return clients.find(c => c.id === id);
  }, [clients]);

  const getClientsNeedingFollowUp = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return clients.filter(c => c.followUpDate && c.followUpDate <= today && c.status === 'lead');
  }, [clients]);

  return {
    clients,
    addClient,
    updateClient,
    deleteClient,
    addInteraction,
    getClientById,
    getClientsNeedingFollowUp,
  };
}
