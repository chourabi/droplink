import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Check, Truck, ShieldCheck, Loader2, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MapView from '@/components/MapView';
import { toast } from 'sonner';
import { CUSTOMER_LOCATION } from '@/lib/constants';
import type { Delivery } from '@/types';

interface CustomerLocationProps {
  deliveries: Delivery[];
  onShareLocation: (id: string, lat: number, lng: number) => void;
  onCustomerOpened: (id: string) => void;
}

export default function CustomerLocation({ deliveries, onShareLocation, onCustomerOpened }: CustomerLocationProps) {
  const { deliveryId } = useParams();
  const delivery = deliveries.find((d) => d.id === deliveryId);

  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (deliveryId) onCustomerOpened(deliveryId);
  }, [deliveryId, onCustomerOpened]);

  if (!delivery) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[hsl(210,40%,98%)] px-4">
        <Card className="max-w-md border-border/60 shadow-lg">
          <CardContent className="p-8 text-center">
            <Truck className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <h1 className="mt-4 text-xl font-bold">Livraison introuvable</h1>
            <p className="mt-1 text-sm text-muted-foreground">Ce lien de livraison est peut-être invalide ou expiré.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const alreadyShared = delivery.status === 'location_received' && delivery.customerLatitude != null;

  const handleShare = () => {
    setState('loading');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lng: longitude });
          onShareLocation(delivery.id, latitude, longitude);
          setState('success');
          toast.success('Position partagée !');
        },
        () => {
          setState('error');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setState('error');
    }
  };

  const handleSimulate = () => {
    setState('loading');
    setTimeout(() => {
      const lat = CUSTOMER_LOCATION.lat + (Math.random() - 0.5) * 0.01;
      const lng = CUSTOMER_LOCATION.lng + (Math.random() - 0.5) * 0.01;
      setLocation({ lat, lng });
      onShareLocation(delivery.id, lat, lng);
      setState('success');
      toast.success('Position partagée !');
    }, 800);
  };

  if (alreadyShared || state === 'success') {
    const displayLocation = location || { lat: delivery.customerLatitude!, lng: delivery.customerLongitude! };
    return (
      <div className="min-h-screen bg-[hsl(210,40%,98%)]">
        <div className="mx-auto max-w-md px-4 py-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 animate-slide-up">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Position partagée !</h1>
            <p className="mt-2 text-sm text-muted-foreground">Votre livreur a maintenant votre position exacte.</p>
          </div>

          <Card className="mt-6 overflow-hidden border-border/60 shadow-sm">
            <div className="h-[250px] w-full">
              <MapView singlePoint={displayLocation} />
            </div>
          </Card>

          <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-700">Position reçue par votre livreur</span>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Vous pouvez fermer cette page maintenant.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(210,40%,98%)]">
      <div className="mx-auto max-w-md px-4 py-8">
        <div className="flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Truck className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">DropLink</span>
        </div>

        <div className="mt-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <Truck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Votre livraison est en route</h1>
          <p className="mt-2 text-sm text-muted-foreground">Aidez votre livreur à vous trouver en partageant votre position.</p>
        </div>

        <Card className="mt-6 border-border/60 bg-white/80 shadow-sm">
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Livreur :</span>
              <span className="text-sm font-medium">Livreur DropLink</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Commande :</span>
              <span className="text-sm font-medium">#{delivery.id}</span>
            </div>
            {delivery.reference && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Référence :</span>
                <span className="text-sm font-medium">{delivery.reference}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6">
          <Button
            onClick={handleShare}
            disabled={state === 'loading'}
            className="h-16 w-full gap-3 text-base font-semibold shadow-lg"
            size="lg"
          >
            {state === 'loading' ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                Récupération de votre position...
              </>
            ) : (
              <>
                <MapPin className="h-6 w-6" />
                Partager ma position
              </>
            )}
          </Button>
        </div>

        {state === 'error' && (
          <div className="mt-4 animate-fade-in">
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-5">
                <p className="text-sm font-medium text-amber-700">Accès à la position indisponible</p>
                <p className="mt-1 text-xs text-amber-600">
                  Nous n'avons pas pu accéder à votre GPS. Vous pouvez simuler votre position à la place.
                </p>
                <Button onClick={handleSimulate} variant="outline" className="mt-3 w-full gap-2 border-amber-300 text-amber-700 hover:bg-amber-100">
                  <Navigation className="h-4 w-4" />
                  Simuler ma position
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-6 flex items-start gap-2 rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Nous utilisons votre position uniquement pour aider le livreur à vous trouver. Votre position n'est ni stockée ni partagée avec qui que ce soit d'autre.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Button onClick={handleSimulate} variant="ghost" size="sm" className="text-xs text-muted-foreground">
            Démo : Simuler la position du client
          </Button>
        </div>
      </div>
    </div>
  );
}
