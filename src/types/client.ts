export type ClientStatus = 'lead' | 'active' | 'past' | 'lost';

export type ClientSource = 'facebook' | 'instagram' | 'referral' | 'website' | 'returning' | 'other';

export interface Interaction {
  id: string;
  date: string;
  type: 'call' | 'whatsapp' | 'email' | 'meeting' | 'note';
  summary: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  location?: string;
  status: ClientStatus;
  source: ClientSource;
  followUpDate?: string;
  interactions: Interaction[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  lead: 'פוטנציאלי',
  active: 'פעיל',
  past: 'לשעבר',
  lost: 'אבוד',
};

export const CLIENT_STATUS_COLORS: Record<ClientStatus, string> = {
  lead: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  past: 'bg-gray-100 text-gray-800',
  lost: 'bg-red-100 text-red-800',
};

export const CLIENT_SOURCE_LABELS: Record<ClientSource, string> = {
  facebook: 'פייסבוק',
  instagram: 'אינסטגרם',
  referral: 'המלצה',
  website: 'אתר',
  returning: 'לקוח חוזר',
  other: 'אחר',
};

export const INTERACTION_TYPE_LABELS: Record<Interaction['type'], string> = {
  call: 'שיחה',
  whatsapp: 'וואטסאפ',
  email: 'אימייל',
  meeting: 'פגישה',
  note: 'הערה',
};

export const INTERACTION_TYPE_ICONS: Record<Interaction['type'], string> = {
  call: '📞',
  whatsapp: '💬',
  email: '📧',
  meeting: '🤝',
  note: '📝',
};
