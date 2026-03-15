export type EventType = 'library' | 'kindergarten' | 'matnас' | 'other';

export type ShowType = 'show' | 'workshop';

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
  showType: ShowType;
  showName: string;
  createdAt: string;
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  library: 'ספרייה',
  kindergarten: 'גן ילדים',
  matnас: 'מתנ"ס',
  other: 'אחר',
};

export const SHOW_TYPE_LABELS: Record<ShowType, string> = {
  show: 'הצגה',
  workshop: 'סדנה',
};

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  not_sent: 'לא נשלח',
  invoice_sent: 'חשבונית נשלחה',
  receipt_sent: 'קבלה נשלחה',
  paid: 'שולם',
};
