import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Client, ClientStatus, ClientSource, CLIENT_STATUS_LABELS, CLIENT_SOURCE_LABELS } from '@/types/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ClientFormData {
  name: string;
  phone: string;
  email: string;
  location: string;
  status: ClientStatus;
  source: ClientSource;
  followUpDate: string;
  notes: string;
}

interface ClientFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ClientFormData) => void;
  editClient: Client | null;
}

export function ClientFormDialog({ open, onClose, onSave, editClient }: ClientFormDialogProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<ClientFormData>({
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      location: '',
      status: 'lead',
      source: 'other',
      followUpDate: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (editClient) {
      setValue('name', editClient.name);
      setValue('phone', editClient.phone);
      setValue('email', editClient.email || '');
      setValue('location', editClient.location || '');
      setValue('status', editClient.status);
      setValue('source', editClient.source);
      setValue('followUpDate', editClient.followUpDate || '');
      setValue('notes', editClient.notes);
    } else {
      reset();
    }
  }, [editClient, setValue, reset]);

  const onSubmit = (data: ClientFormData) => {
    onSave(data);
    onClose();
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>{editClient ? 'עריכת לקוח' : 'לקוח חדש'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">שם *</Label>
            <Input id="name" {...register('name', { required: true })} placeholder="שם הלקוח" />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">טלפון *</Label>
            <Input id="phone" {...register('phone', { required: true })} placeholder="050-1234567" type="tel" />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">אימייל</Label>
            <Input id="email" {...register('email')} placeholder="email@example.com" type="email" />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">מיקום / כתובת</Label>
            <Input id="location" {...register('location')} placeholder='למשל: גן "שקד", רמת גן' />
          </div>

          {/* Status & Source */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>סטטוס</Label>
              <Select value={watch('status')} onValueChange={(v) => setValue('status', v as ClientStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CLIENT_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>מקור הגעה</Label>
              <Select value={watch('source')} onValueChange={(v) => setValue('source', v as ClientSource)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CLIENT_SOURCE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Follow-up Date */}
          <div className="space-y-2">
            <Label htmlFor="followUpDate">תאריך לפולו-אפ</Label>
            <Input id="followUpDate" {...register('followUpDate')} type="date" />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">הערות</Label>
            <Textarea id="notes" {...register('notes')} placeholder="הערות על הלקוח..." rows={3} />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">
              {editClient ? 'שמירה' : 'הוספה'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              ביטול
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
