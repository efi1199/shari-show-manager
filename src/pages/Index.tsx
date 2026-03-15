import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '@/hooks/useEvents';
import { StatsCards } from '@/components/StatsCards';
import { EventCard } from '@/components/EventCard';
import { EventFormDialog } from '@/components/EventFormDialog';
import { EventOrder } from '@/types/event';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const [formOpen, setFormOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<EventOrder | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const filtered = events
    .filter(e => {
      if (search) {
        const q = search.toLowerCase();
        return e.clientName.toLowerCase().includes(q) || e.location.toLowerCase().includes(q);
      }
      return true;
    })
    .filter(e => {
      const d = new Date(e.eventDate);
      const now = new Date();
      if (filter === 'upcoming') return d >= now;
      if (filter === 'past') return d < now;
      return true;
    })
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  const handleEdit = (event: EventOrder) => {
    setEditEvent(event);
    setFormOpen(true);
  };

  const handleSave = (data: Omit<EventOrder, 'id' | 'createdAt'>) => {
    if (editEvent) {
      updateEvent(editEvent.id, data);
    } else {
      addEvent(data);
    }
    setEditEvent(null);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Star className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">מספרים עם שרי</h1>
              <p className="text-xs text-muted-foreground">ניהול הזמנות והפעלות</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/clients" className="gap-2">
                <Users className="w-4 h-4" />
                לקוחות
              </Link>
            </Button>
            <Button onClick={() => { setEditEvent(null); setFormOpen(true); }} className="gap-2">
              <Plus className="w-4 h-4" />
              אירוע חדש
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        <StatsCards events={events} />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="חיפוש לפי שם או מיקום..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pr-10"
            />
          </div>
          <div className="flex gap-2">
            {([['all', 'הכל'], ['upcoming', 'קרובים'], ['past', 'עברו']] as const).map(([key, label]) => (
              <Button
                key={key}
                variant={filter === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(key)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-muted-foreground"
          >
            <p className="text-lg">אין אירועים להצגה</p>
            <p className="text-sm mt-1">הוסיפי אירוע חדש כדי להתחיל</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((event, i) => (
              <EventCard
                key={event.id}
                event={event}
                index={i}
                onEdit={handleEdit}
                onDelete={deleteEvent}
                onStatusChange={(id, status) => updateEvent(id, { invoiceStatus: status })}
              />
            ))}
          </div>
        )}
      </main>

      <EventFormDialog
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditEvent(null); }}
        onSave={handleSave}
        editEvent={editEvent}
      />
    </div>
  );
};

export default Index;
