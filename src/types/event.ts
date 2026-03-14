export type EventType = 'birthday' | 'kindergarten' | 'school' | 'holiday' | 'other';

export type InvoiceStatus = 'not_sent' | 'invoice_sent' | 'receipt_sent' | 'paid';

export interface EventOrder {
  id: string;
  clientName: string;
  clientPhone: string;
  eventDate: string;
  eventTime: string;
  eventType: EventType;
  location: string;
  numberOfKids: number;
  price: number;
  depositPaid: number;
  invoiceStatus: InvoiceStatus;
  notes: string;
  showName: string;
  createdAt: string;
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  birthday: 'יום הולדת',
  kindergarten: 'גן ילדים',
  school: 'בית ספר',
  holiday: 'חג / אירוע מיוחד',
  other: 'אחר',
};

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  not_sent: 'לא נשלח',
  invoice_sent: 'חשבונית נשלחה',
  receipt_sent: 'קבלה נשלחה',
  paid: 'שולם',
};

export const SHOW_OPTIONS = [
  'הצגת בובות קלאסית',
  'סיפורי קסם',
  'הצגה אינטראקטיבית',
  'סדנת בובות',
  'הצגה מותאמת אישית',
];
