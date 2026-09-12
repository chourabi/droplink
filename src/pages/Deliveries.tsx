import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatusBadge from '@/components/StatusBadge';
import type { Delivery, DeliveryStatus } from '@/types';

interface DeliveriesProps {
  deliveries: Delivery[];
}

type Filter = 'all' | DeliveryStatus;

export default function Deliveries({ deliveries }: DeliveriesProps) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = deliveries.filter((d) => {
    if (filter === 'all') return true;
    return d.status === filter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Livraisons</h1>
        <p className="text-sm text-muted-foreground">Toutes vos livraisons au même endroit.</p>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="waiting_location">En attente</TabsTrigger>
          <TabsTrigger value="location_received">Reçues</TabsTrigger>
          <TabsTrigger value="delivered">Livraisons</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <Card className="border-dashed border-border/60">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium">Aucune livraison trouvée</p>
            <p className="text-xs text-muted-foreground">Essayez un autre filtre ou créez une nouvelle livraison.</p>
            <Button onClick={() => navigate('/create-delivery')} className="mt-4" size="sm">Nouvelle livraison</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((delivery) => (
            <Card
              key={delivery.id}
              className="cursor-pointer border-border/60 shadow-sm transition-all hover:shadow-md"
              onClick={() => navigate(`/deliveries/${delivery.id}`)}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{delivery.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      #{delivery.id} · {new Date(delivery.createdAt).toLocaleString('fr', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <StatusBadge status={delivery.status} />
                    <div className="mt-1 flex items-center justify-end gap-2 text-xs text-muted-foreground">
                      {delivery.amount != null && <span>{delivery.amount} TND</span>}
                      {delivery.distance && <span>{delivery.distance} km</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
