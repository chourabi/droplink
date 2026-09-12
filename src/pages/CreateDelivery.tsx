import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, MessageCircle, Check, Link2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { WHATSAPP_MESSAGE } from '@/lib/constants';
import type { Delivery } from '@/types';

interface CreateDeliveryProps {
  onCreate: (data: Pick<Delivery, 'customerName' | 'reference' | 'amount' | 'notes'>) => Delivery;
  onLinkSent: (id: string) => void;
}

export default function CreateDelivery({ onCreate, onLinkSent }: CreateDeliveryProps) {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<Delivery | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      toast.error('Le nom du client est requis');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const delivery = onCreate({
        customerName: customerName.trim(),
        reference: reference.trim(),
        amount: amount ? parseFloat(amount) : undefined,
        notes: notes.trim() || undefined,
      });
      setLoading(false);
      setCreated(delivery);
      toast.success('Livraison créée !');
    }, 500);
  };

  const handleCopy = () => {
    if (!created) return;
    navigator.clipboard.writeText(created.shareUrl);
    setCopied(true);
    toast.success('Lien copié');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!created) return;
    const msg = encodeURIComponent(WHATSAPP_MESSAGE(created.shareUrl, created.customerName));
    window.open(`https://wa.me/?text=${msg}`, '_blank');
    onLinkSent(created.id);
    toast.success('WhatsApp ouvert');
  };

  if (created) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Button>

        <Card className="border-border/60 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Livraison créée</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Envoyez ce lien à {created.customerName} pour qu'il partage sa position.
            </p>

            <Card className="mt-6 border-border/60 bg-muted/30">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Link2 className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-medium">{created.shareUrl}</p>
                  <p className="text-xs text-muted-foreground">Livraison #{created.id}</p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button onClick={handleCopy} variant="outline" className="flex-1 gap-2">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copié !' : 'Copier le lien'}
              </Button>
              <Button
                onClick={handleWhatsApp}
                className="flex-1 gap-2 bg-[#25D366] text-white hover:bg-[#1da851]"
              >
                <MessageCircle className="h-4 w-4" />
                Envoyer par WhatsApp
              </Button>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button variant="ghost" size="sm" onClick={() => navigate(`/deliveries/${created.id}`)} className="gap-1.5">
                Voir la livraison
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setCreated(null); setCustomerName(''); setReference(''); setAmount(''); setNotes(''); }} className="gap-1.5">
                <Send className="h-4 w-4" />
                Créer une autre
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="gap-1.5">
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nouvelle livraison</h1>
        <p className="text-sm text-muted-foreground">Créez une livraison en quelques secondes. Envoyez le lien à votre client.</p>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Nom du client *</Label>
              <Input
                id="customerName"
                placeholder="ex. Ahmed"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Commande / numéro de référence</Label>
              <Input
                id="reference"
                placeholder="ex. CMD-8842"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Montant à encaisser (optionnel)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="ex. 42.50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                id="notes"
                placeholder="ex. Appartement près de la pharmacie"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Création...' : 'Créer la livraison'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
