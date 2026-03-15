import { useState, useEffect, useRef } from 'react';
import { EventOrder, EventType, ShowType, InvoiceStatus, EVENT_TYPE_LABELS, SHOW_TYPE_LABELS } from '@/types/event';
import { useClients } from '@/hooks/useClients';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Check, ChevronsUpDown, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  eventType: 'kindergarten',
  location: '',
  numberOfKids: 20,
  price: 1200,
  depositPaid: 0,
  invoiceStatus: 'not_sent',
  notes: '',
  showType: 'show',
  showName: '',
};

export function EventFormDialog({ open, onClose, onSave, editEvent }: EventFormDialogProps) {
  const [form, setForm] = useState(INITIAL);
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const { clients } = useClients();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editEvent) {
      const { id, createdAt, ...rest } = editEvent;
      // Handle old events that don't have showType
      const formData = {
        ...rest,
        showType: rest.showType || 'show',
      };
      setForm(formData);
      setClientSearch(rest.clientName);
    } else {
      setForm(INITIAL);
      setClientSearch('');
    }
  }, [editEvent, open]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setClientDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.phone.includes(clientSearch)
  );

  const handleClientSelect = (client: typeof clients[0]) => {
    setForm(prev => ({
      ...prev,
      clientName: client.name,
      clientPhone: client.phone,
    }));
    setClientSearch(client.name);
    setClientDropdownOpen(false);
  };

  const handleClientInputChange = (value: string) => {
    setClientSearch(value);
    update('clientName', value);
    setClientDropdownOpen(true);
  };

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
            {/* Client Name with Dropdown */}
            <div className="space-y-1.5 relative" ref={dropdownRef}>
              <Label>שם הלקוח/ה</Label>
              <div className="relative">
                <Input
                  value={clientSearch}
                  onChange={e => handleClientInputChange(e.target.value)}
                  onFocus={() => setClientDropdownOpen(true)}
                  placeholder="הקלידי שם או בחרי מהרשימה"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setClientDropdownOpen(!clientDropdownOpen)}
                >
                  <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
              
              {/* Dropdown */}
              {clientDropdownOpen && (
                <div className="absolute z-50 top-full mt-1 w-full bg-popover border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredClients.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground text-center">
                      <UserPlus className="h-4 w-4 mx-auto mb-1" />
                      לקוח חדש — הקלידי את השם
                    </div>
                  ) : (
                    filteredClients.map(client => (
                      <button
                        key={client.id}
                        type="button"
                        className={cn(
                          "w-full px-3 py-2 text-right hover:bg-muted flex items-center justify-between transition-colors",
                          form.clientName === client.name && "bg-muted"
                        )}
                        onClick={() => handleClientSelect(client)}
                      >
                        <div>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-xs text-muted-foreground">{client.phone}</div>
                        </div>
                        {form.clientName === client.name && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
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

          {/* Show Type and Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>סוג הפעלה</Label>
              <Select value={form.showType} onValueChange={v => update('showType', v as ShowType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(SHOW_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>שם ה{SHOW_TYPE_LABELS[form.showType]}</Label>
              <Input 
                value={form.showName} 
                onChange={e => update('showName', e.target.value)} 
                placeholder={`לדוגמה: ${form.showType === 'show' ? 'הצגת בובות' : 'סדנת יצירה'}`}
                required 
              />
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
