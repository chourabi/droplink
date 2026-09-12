import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Navigation, Check, MapPin, Clock, Package, FileText, DollarSign, Copy, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import StatusBadge from '@/components/StatusBadge';
import MapView from '@/components/MapView';
import { toast } from 'sonner';
import { DRIVER_LOCATION, WHATSAPP_MESSAGE } from '@/lib/constants';
import type { Delivery } from '@/types';

interface DeliveryDetailProps {
  deliveries: Delivery[];
  onMarkDelivered: (id: string) => void;
  onLinkSent: (id: string) => void;
}

export default function DeliveryDetail({ deliveries, onMarkDelivered, onLinkSent }: DeliveryDetailProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const delivery = deliveries.find((d) => d.id === id);

  if (!delivery) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <Package className="mx-auto h-12 w-12 text-muted-foreground/40" />
        <h1 className="mt-4 text-xl font-bold">Livraison introuvable</h1>
        <p className="mt-1 text-sm text-muted-foreground">Cette livraison a peut-être été supprimée.</p>
        <Button onClick={() => navigate('/deliveries')} className="mt-6">Retour aux livraisons</Button>
      </div>
    );
  }

  const hasLocation = delivery.customerLatitude != null && delivery.customerLongitude != null;
  const isDelivered = delivery.status === 'delivered';

  const openInMaps = () => {
    if (!hasLocation) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${delivery.customerLatitude},${delivery.customerLongitude}&origin=${DRIVER_LOCATION.lat},${DRIVER_LOCATION.lng}`;
    window.open(url, '_blank');
    toast.success('Ouverture de Google Maps...');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(delivery.shareUrl);
    toast.success('Lien copié');
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(WHATSAPP_MESSAGE(delivery.shareUrl, delivery.customerName));
    window.open(`https://wa.me/?text=${msg}`, '_blank');
    onLinkSent(delivery.id);
    toast.success('WhatsApp ouvert');
  };

  const timeline = [
    { time: new Date(delivery.createdAt).toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }), label: 'Livraison créée' },
    delivery.linkSentAt && { time: new Date(delivery.linkSentAt).toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }), label: 'Lien envoyé' },
    delivery.customerOpenedAt && { time: new Date(delivery.customerOpenedAt).toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }), label: 'Client a ouvert le lien' },
    delivery.locationReceivedAt && { time: new Date(delivery.locationReceivedAt).toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }), label: 'Position reçue' },
    delivery.completedAt && { time: new Date(delivery.completedAt).toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }), label: 'Marquée comme livrée' },
  ].filter(Boolean) as { time: string; label: string }[];

  const estTime = delivery.distance ? Math.ceil((delivery.distance / 30) * 60) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/deliveries')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold tracking-tight">{delivery.customerName}</h1>
          <p className="text-xs text-muted-foreground">#{delivery.id}</p>
        </div>
        <StatusBadge status={delivery.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="overflow-hidden border-border/60 shadow-sm">
            <div className="h-[300px] w-full md:h-[400px]">
              {hasLocation ? (
                <MapView
                  driverLat={DRIVER_LOCATION.lat}
                  driverLng={DRIVER_LOCATION.lng}
                  customerLat={delivery.customerLatitude}
                  customerLng={delivery.customerLongitude}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center bg-muted/30 text-center">
                  <MapPin className="h-10 w-10 text-muted-foreground/40" />
                  <p className="mt-3 text-sm font-medium">En attente de la position du client</p>
                  <p className="text-xs text-muted-foreground">La carte apparaîtra dès que le client partagera sa position.</p>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
                      <Copy className="h-3.5 w-3.5" />
                      Copier le lien
                    </Button>
                    <Button size="sm" onClick={handleWhatsApp} className="gap-1.5 bg-[#25D366] text-white hover:bg-[#1da851]">
                      <MessageCircle className="h-3.5 w-3.5" />
                      Envoyer par WhatsApp
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {hasLocation && !isDelivered && (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={openInMaps} className="flex-1 gap-2">
                <Navigation className="h-4 w-4" />
                Ouvrir dans Google Maps
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Check className="h-4 w-4" />
                    Marquer comme livrée
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Marquer comme livrée ?</AlertDialogTitle>
                    <AlertDialogDescription>Ceci marquera la livraison pour {delivery.customerName} comme terminée.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        onMarkDelivered(delivery.id);
                        toast.success('Livraison terminée');
                        navigate('/deliveries');
                      }}
                    >
                      Marquer livrée
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}

          {isDelivered && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="flex items-center gap-3 p-4">
                <Check className="h-5 w-5 text-green-500" />
                <p className="text-sm font-medium text-green-700">Cette livraison a été terminée.</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="space-y-4 p-5">
              <h3 className="text-sm font-semibold text-muted-foreground">Infos livraison</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Référence :</span>
                  <span className="font-medium">{delivery.reference}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Créée :</span>
                  <span className="font-medium">{new Date(delivery.createdAt).toLocaleString('fr', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {delivery.amount != null && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Montant :</span>
                    <span className="font-medium">{delivery.amount} TND</span>
                  </div>
                )}
                {delivery.notes && (
                  <div className="flex items-start gap-2">
                    <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Notes :</span>
                    <span className="font-medium">{delivery.notes}</span>
                  </div>
                )}
              </div>
              <Separator />
              {hasLocation && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Distance :</span>
                    <span className="font-medium">{delivery.distance} km</span>
                  </div>
                  {estTime && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Temps estimé :</span>
                      <span className="font-medium">~{estTime} min</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Coordonnées :</span>
                    <span className="font-mono text-xs">{delivery.customerLatitude?.toFixed(5)}, {delivery.customerLongitude?.toFixed(5)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-5">
              <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Historique</h3>
              <div className="space-y-4">
                {timeline.map((event, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`h-2.5 w-2.5 rounded-full ${i === timeline.length - 1 ? 'bg-primary' : 'bg-border'}`} />
                      {i < timeline.length - 1 && <div className="h-full w-px flex-1 bg-border" />}
                    </div>
                    <div className="pb-1">
                      <p className="text-xs font-medium">{event.label}</p>
                      <p className="text-xs text-muted-foreground">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
