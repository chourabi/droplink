import { Link, useNavigate } from 'react-router-dom';
import { Plus, Package, Clock, CheckCircle, MapPin, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StatusBadge from '@/components/StatusBadge';
import type { Delivery } from '@/types';

interface DashboardProps {
  deliveries: Delivery[];
}

export default function Dashboard({ deliveries }: DashboardProps) {
  const navigate = useNavigate();

  const today = deliveries.filter((d) => {
    const created = new Date(d.createdAt);
    const now = new Date();
    return created.toDateString() === now.toDateString();
  });

  const pending = deliveries.filter((d) => d.status === 'waiting_location');
  const completed = deliveries.filter((d) => d.status === 'delivered');
  const totalDistance = deliveries
    .filter((d) => d.distance)
    .reduce((sum, d) => sum + (d.distance || 0), 0);

  const stats = [
    { label: "Today's deliveries", value: today.length, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Pending locations', value: pending.length, icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'Completed', value: completed.length, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
    { label: 'Distance', value: `${totalDistance.toFixed(1)} km`, icon: TrendingUp, color: 'bg-indigo-50 text-indigo-600' },
  ];

  const recent = deliveries.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back. Here's your delivery overview.</p>
        </div>
        <Button onClick={() => navigate('/create-delivery')} className="gap-1.5">
          <Plus className="h-4 w-4" />
          New Delivery
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border/60 shadow-sm">
            <CardContent className="p-4">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent deliveries</h2>
          <Link to="/deliveries">
            <Button variant="ghost" size="sm" className="gap-1">
              View all
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {recent.length === 0 ? (
          <Card className="border-dashed border-border/60">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm font-medium">No deliveries yet</p>
              <p className="text-xs text-muted-foreground">Create your first delivery to get started.</p>
              <Button onClick={() => navigate('/create-delivery')} className="mt-4 gap-1.5" size="sm">
                <Plus className="h-4 w-4" />
                New Delivery
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recent.map((delivery) => (
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
                        #{delivery.id} · {new Date(delivery.createdAt).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <StatusBadge status={delivery.status} />
                      {delivery.distance && (
                        <p className="mt-1 text-xs text-muted-foreground">{delivery.distance} km</p>
                      )}
                    </div>
                    <Button variant="outline" size="sm">Open</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
