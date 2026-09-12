import { User, Phone, Mail, Crown, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { PLAN_LIMITS } from '@/lib/constants';
import type { Driver, Delivery } from '@/types';

interface ProfileProps {
  driver: Driver;
  deliveries: Delivery[];
}

export default function Profile({ driver, deliveries }: ProfileProps) {
  const limit = PLAN_LIMITS[driver.plan];
  const thisMonth = deliveries.filter((d) => {
    const created = new Date(d.createdAt);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;
  const usagePct = limit === Infinity ? 30 : Math.min((thisMonth / limit) * 100, 100);

  const initials = driver.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">Your account details and plan.</p>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{driver.name}</h2>
              <p className="text-sm text-muted-foreground">Delivery Driver</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm font-medium">{driver.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium">{driver.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                <Mail className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{driver.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-semibold">Plan</h2>
            </div>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">{driver.plan}</span>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Usage this month</span>
              <span className="font-medium">
                {thisMonth} / {limit === Infinity ? '∞' : limit} deliveries
              </span>
            </div>
            <Progress value={usagePct} className="mt-2" />
          </div>

          {driver.plan === 'free' && (
            <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-primary">Upgrade to Pro</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Unlimited deliveries, delivery history, statistics, and priority support.
              </p>
              <Button
                onClick={() => toast.info('Payment integration coming soon! This is a prototype.')}
                className="mt-4 w-full gap-2"
              >
                <Crown className="h-4 w-4" />
                Upgrade to Pro — $9/month
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
