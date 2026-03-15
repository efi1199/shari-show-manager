import { useState } from 'react';
import { useClients } from '@/hooks/useClients';
import { ClientCard } from '@/components/ClientCard';
import { ClientFormDialog } from '@/components/ClientFormDialog';
import { InteractionFormDialog } from '@/components/InteractionFormDialog';
import { Client, ClientStatus, CLIENT_STATUS_LABELS } from '@/types/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, Users, UserPlus, UserCheck, UserX, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Clients = () => {
  const { clients, addClient, updateClient, deleteClient, addInteraction, getClientsNeedingFollowUp } = useClients();
  const [formOpen, setFormOpen] = useState(false);
  const [interactionOpen, setInteractionOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [interactionClient, setInteractionClient] = useState<Client | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('all');

  const followUpClients = getClientsNeedingFollowUp();

  const filtered = clients
    .filter(c => {
      if (search) {
        const q = search.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.phone.includes(q);
      }
      return true;
    })
    .filter(c => statusFilter === 'all' || c.status === statusFilter)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const stats = {
    total: clients.length,
    leads: clients.filter(c => c.status === 'lead').length,
    active: clients.filter(c => c.status === 'active').length,
    needFollowUp: followUpClients.length,
  };

  const handleEdit = (client: Client) => {
    setEditClient(client);
    setFormOpen(true);
  };

  const handleAddInteraction = (client: Client) => {
    setInteractionClient(client);
    setInteractionOpen(true);
  };

  const handleSave = (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'interactions'>) => {
    if (editClient) {
      updateClient(editClient.id, data);
    } else {
      addClient(data);
    }
    setEditClient(null);
  };

  const handleSaveInteraction = (data: { type: string; date: string; summary: string }) => {
    if (interactionClient) {
      addInteraction(interactionClient.id, data as any);
    }
    setInteractionClient(null);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">ניהול לקוחות</h1>
              <p className="text-xs text-muted-foreground">CRM - מספרים עם שרי</p>
            </div>
          </div>
          <Button onClick={() => { setEditClient(null); setFormOpen(true); }} className="gap-2">
            <Plus className="w-4 h-4" />
            לקוח חדש
          </Button>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">סה״כ לקוחות</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.leads}</p>
                <p className="text-xs text-muted-foreground">פוטנציאליים</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">פעילים</p>
              </div>
            </CardContent>
          </Card>
          <Card className={stats.needFollowUp > 0 ? 'ring-2 ring-yellow-400' : ''}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <UserX className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.needFollowUp}</p>
                <p className="text-xs text-muted-foreground">צריכים פולו-אפ</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="חיפוש לפי שם או טלפון..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pr-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              הכל
            </Button>
            {(['lead', 'active', 'past'] as const).map(status => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {CLIENT_STATUS_LABELS[status]}
              </Button>
            ))}
          </div>
        </div>

        {/* Clients Grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-muted-foreground"
          >
            <p className="text-lg">אין לקוחות להצגה</p>
            <p className="text-sm mt-1">הוסיפי לקוח חדש כדי להתחיל</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((client, i) => (
              <ClientCard
                key={client.id}
                client={client}
                index={i}
                onEdit={handleEdit}
                onDelete={deleteClient}
                onStatusChange={(id, status) => updateClient(id, { status })}
                onAddInteraction={handleAddInteraction}
              />
            ))}
          </div>
        )}
      </main>

      <ClientFormDialog
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditClient(null); }}
        onSave={handleSave}
        editClient={editClient}
      />

      <InteractionFormDialog
        open={interactionOpen}
        clientName={interactionClient?.name || ''}
        onClose={() => { setInteractionOpen(false); setInteractionClient(null); }}
        onSave={handleSaveInteraction}
      />
    </div>
  );
};

export default Clients;
