import { useForm } from 'react-hook-form';
import { Interaction, INTERACTION_TYPE_LABELS } from '@/types/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InteractionFormData {
  type: Interaction['type'];
  date: string;
  summary: string;
}

interface InteractionFormDialogProps {
  open: boolean;
  clientName: string;
  onClose: () => void;
  onSave: (data: InteractionFormData) => void;
}

export function InteractionFormDialog({ open, clientName, onClose, onSave }: InteractionFormDialogProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm<InteractionFormData>({
    defaultValues: {
      type: 'call',
      date: new Date().toISOString().split('T')[0],
      summary: '',
    },
  });

  const onSubmit = (data: InteractionFormData) => {
    onSave(data);
    onClose();
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>אינטראקציה חדשה עם {clientName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Type & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>סוג</Label>
              <Select value={watch('type')} onValueChange={(v) => setValue('type', v as Interaction['type'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(INTERACTION_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">תאריך</Label>
              <Input id="date" {...register('date', { required: true })} type="date" />
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary">תקציר *</Label>
            <Textarea
              id="summary"
              {...register('summary', { required: true })}
              placeholder="מה דובר? מה סוכם?"
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">
              הוספה
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
