import { useMemo } from 'react';
import { CalendarDays, Users, Banknote, Clock } from 'lucide-react';
import { EventOrder } from '@/types/event';
import { motion } from 'framer-motion';

interface StatsCardsProps {
  events: EventOrder[];
}

export function StatsCards({ events }: StatsCardsProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const upcoming = events.filter(e => new Date(e.eventDate) >= now);
    const thisMonth = events.filter(e => {
      const d = new Date(e.eventDate);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    const monthlyRevenue = thisMonth.reduce((sum, e) => sum + e.price, 0);
    const pendingPayment = events.filter(e => e.invoiceStatus !== 'paid' && new Date(e.eventDate) <= now);

    return [
      { label: 'אירועים קרובים', value: upcoming.length, icon: CalendarDays, color: 'primary' as const },
      { label: 'הכנסות החודש', value: `₪${monthlyRevenue.toLocaleString()}`, icon: Banknote, color: 'success' as const },
      { label: 'ילדים החודש', value: thisMonth.reduce((s, e) => s + e.numberOfKids, 0), icon: Users, color: 'secondary' as const },
      { label: 'ממתינים לתשלום', value: pendingPayment.length, icon: Clock, color: 'warning' as const },
    ];
  }, [events]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="rounded-xl bg-card p-5 shadow-[var(--shadow-card)] border border-border"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${
              stat.color === 'primary' ? 'bg-primary/10 text-primary' :
              stat.color === 'success' ? 'bg-success/10 text-success' :
              stat.color === 'secondary' ? 'bg-secondary text-secondary-foreground' :
              'bg-warning/10 text-warning'
            }`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
