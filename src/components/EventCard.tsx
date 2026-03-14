import { EventOrder, EVENT_TYPE_LABELS, INVOICE_STATUS_LABELS } from '@/types/event';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, MapPin, Users, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

interface EventCardProps {
  event: EventOrder;
  onEdit: (event: EventOrder) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: EventOrder['invoiceStatus']) => void;
  index: number;
}

function getStatusColor(status: EventOrder['invoiceStatus']) {
  switch (status) {
    case 'paid': return 'bg-success/15 text-success border-success/20';
    case 'receipt_sent': return 'bg-info/15 text-info border-info/20';
    case 'invoice_sent': return 'bg-warning/15 text-warning border-warning/20';
    default: return 'bg-muted text-muted-foreground border-border';
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('he-IL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function EventCard({ event, onEdit, onDelete, onStatusChange, index }: EventCardProps) {
  const isPast = new Date(event.eventDate) < new Date();
  const remaining = event.price - event.depositPaid;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-elevated)] ${isPast ? 'opacity-70' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-lg text-foreground">{event.clientName}</h3>
          <p className="text-sm text-muted-foreground">{event.showName}</p>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => onEdit(event)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(event.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <Badge variant="outline" className="font-normal">
          {formatDate(event.eventDate)} · {event.eventTime}
        </Badge>
        <Badge variant="secondary">{EVENT_TYPE_LABELS[event.eventType]}</Badge>
      </div>

      <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5" />
          <span>{event.numberOfKids} ילדים</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5" />
          <span dir="ltr">{event.clientPhone}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div>
          <span className="text-lg font-bold text-foreground">₪{event.price.toLocaleString()}</span>
          {remaining > 0 && (
            <span className="text-xs text-warning mr-2">(נותר ₪{remaining.toLocaleString()})</span>
          )}
        </div>
        <button
          onClick={() => {
            const statuses: EventOrder['invoiceStatus'][] = ['not_sent', 'invoice_sent', 'receipt_sent', 'paid'];
            const currentIdx = statuses.indexOf(event.invoiceStatus);
            const next = statuses[(currentIdx + 1) % statuses.length];
            onStatusChange(event.id, next);
          }}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${getStatusColor(event.invoiceStatus)}`}
        >
          {INVOICE_STATUS_LABELS[event.invoiceStatus]}
        </button>
      </div>

      {event.notes && (
        <p className="text-xs text-muted-foreground mt-3 bg-muted rounded-lg p-2">{event.notes}</p>
      )}
    </motion.div>
  );
}
