import { Client, CLIENT_STATUS_LABELS, CLIENT_STATUS_COLORS, CLIENT_SOURCE_LABELS, INTERACTION_TYPE_ICONS } from '@/types/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Phone, Mail, MoreVertical, Pencil, Trash2, Calendar, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface ClientCardProps {
  client: Client;
  index: number;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Client['status']) => void;
  onAddInteraction: (client: Client) => void;
}

export function ClientCard({ client, index, onEdit, onDelete, onStatusChange, onAddInteraction }: ClientCardProps) {
  const lastInteraction = client.interactions[client.interactions.length - 1];
  const needsFollowUp = client.followUpDate && client.followUpDate <= new Date().toISOString().split('T')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={`overflow-hidden hover:shadow-md transition-shadow ${needsFollowUp ? 'ring-2 ring-yellow-400' : ''}`}>
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg">{client.name}</h3>
              <div className="flex gap-2 mt-1">
                <Badge className={CLIENT_STATUS_COLORS[client.status]}>
                  {CLIENT_STATUS_LABELS[client.status]}
                </Badge>
                <Badge variant="outline">{CLIENT_SOURCE_LABELS[client.source]}</Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(client)}>
                  <Pencil className="h-4 w-4 ml-2" />
                  עריכה
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddInteraction(client)}>
                  <MessageSquare className="h-4 w-4 ml-2" />
                  הוסף אינטראקציה
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(client.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 ml-2" />
                  מחיקה
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Contact Info */}
          <div className="space-y-1 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3" />
              <a href={`tel:${client.phone}`} className="hover:underline">{client.phone}</a>
            </div>
            {client.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <a href={`mailto:${client.email}`} className="hover:underline">{client.email}</a>
              </div>
            )}
          </div>

          {/* Follow-up Alert */}
          {needsFollowUp && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mb-3 text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4 text-yellow-600" />
              <span className="text-yellow-800">צריך לחזור היום!</span>
            </div>
          )}

          {/* Last Interaction */}
          {lastInteraction && (
            <div className="bg-muted/50 rounded-md p-2 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <span>{INTERACTION_TYPE_ICONS[lastInteraction.type]}</span>
                <span>{new Date(lastInteraction.date).toLocaleDateString('he-IL')}</span>
              </div>
              <p className="text-foreground line-clamp-2">{lastInteraction.summary}</p>
            </div>
          )}

          {/* Status Quick Actions */}
          <div className="flex gap-1 mt-3 pt-3 border-t">
            {(['lead', 'active', 'past', 'lost'] as const).map(status => (
              <Button
                key={status}
                variant={client.status === status ? 'default' : 'ghost'}
                size="sm"
                className="flex-1 text-xs"
                onClick={() => onStatusChange(client.id, status)}
              >
                {CLIENT_STATUS_LABELS[status]}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
