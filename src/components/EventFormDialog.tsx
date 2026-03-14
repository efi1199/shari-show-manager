import { useState, useEffect } from 'react';
import { EventOrder, EventType, InvoiceStatus, EVENT_TYPE_LABELS, SHOW_OPTIONS } from '@/types/event';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface EventFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (event: Omit<EventOrder, 'id' | 'createdAt'>) => void;
  editEvent?: EventOrder | null;
}

const INITIAL: Omit<EventOrder, 'id' | 'createdAt'> = {
  clientName: '',
  clientPhone: '',
  eventDate: '',
  eventTime: '16:00',
  eventType: 'birthday',
  location: '',
  numberOfKids: 20,
  price: 1200,
  depositPaid: 0,
  invoiceStatus: 'not_sent',
  notes: '',
  showName: SHOW_OPTIONS[0],
};

export function EventFormDialog({ open, onClose, onSave, editEvent }: EventFormDialogProps) {
  const [form, setForm] = useState(INITIAL);

  useEffect(() => {
    if (editEvent) {
      const { id, createdAt, ...rest } = editEvent;
      setForm(rest);
    } else {
      setForm(INITIAL);
    }
  }, [editEvent, open]);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl">{editEvent ? 'עריכת אירוע' : 'אירוע חדש'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>שם הלקוח/ה</Label>
              <Input value={form.clientName} onChange={e => update('clientName', e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>טלפון</Label>
              <Input value={form.clientPhone} onChange={e => update('clientPhone', e.target.value)} dir="ltr" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>תאריך</Label>
              <Input type="date" value={form.eventDate} onChange={e => update('eventDate', e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>שעה</Label>
              <Input type="time" value={form.eventTime} onChange={e => update('eventTime', e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>סוג אירוע</Label>
              <Select value={form.eventType} onValueChange={v => update('eventType', v as EventType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(EVENT_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>הצגה</Label>
              <Select value={form.showName} onValueChange={v => update('showName', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SHOW_OPTIONS.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>מיקום האירוע</Label>
            <Input value={form.location} onChange={e => update('location', e.target.value)} required />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>מספר ילדים</Label>
              <Input type="number" value={form.numberOfKids} onChange={e => update('numberOfKids', +e.target.value)} min={1} />
            </div>
            <div className="space-y-1.5">
              <Label>מחיר (₪)</Label>
              <Input type="number" value={form.price} onChange={e => update('price', +e.target.value)} min={0} />
            </div>
            <div className="space-y-1.5">
              <Label>מקדמה (₪)</Label>
              <Input type="number" value={form.depositPaid} onChange={e => update('depositPaid', +e.target.value)} min={0} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>סטטוס חשבונית</Label>
            <Select value={form.invoiceStatus} onValueChange={v => update('invoiceStatus', v as InvoiceStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="not_sent">לא נשלח</SelectItem>
                <SelectItem value="invoice_sent">חשבונית נשלחה</SelectItem>
                <SelectItem value="receipt_sent">קבלה נשלחה</SelectItem>
                <SelectItem value="paid">שולם</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>הערות</Label>
            <Textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={2} />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">{editEvent ? 'עדכון' : 'הוספה'}</Button>
            <Button type="button" variant="outline" onClick={onClose}>ביטול</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
