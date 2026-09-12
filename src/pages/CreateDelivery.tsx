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
      toast.error('Customer name is required');
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
      toast.success('Delivery created!');
    }, 500);
  };

  const handleCopy = () => {
    if (!created) return;
    navigator.clipboard.writeText(created.shareUrl);
    setCopied(true);
    toast.success('Link copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!created) return;
    const msg = encodeURIComponent(WHATSAPP_MESSAGE(created.shareUrl, created.customerName));
    window.open(`https://wa.me/?text=${msg}`, '_blank');
    onLinkSent(created.id);
    toast.success('WhatsApp opened');
  };

  if (created) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Button>

        <Card className="border-border/60 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Delivery created</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Send this link to {created.customerName} so they can share their location.
            </p>

            <Card className="mt-6 border-border/60 bg-muted/30">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Link2 className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-medium">{created.shareUrl}</p>
                  <p className="text-xs text-muted-foreground">Delivery #{created.id}</p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button onClick={handleCopy} variant="outline" className="flex-1 gap-2">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy link'}
              </Button>
              <Button
                onClick={handleWhatsApp}
                className="flex-1 gap-2 bg-[#25D366] text-white hover:bg-[#1da851]"
              >
                <MessageCircle className="h-4 w-4" />
                Send via WhatsApp
              </Button>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button variant="ghost" size="sm" onClick={() => navigate(`/deliveries/${created.id}`)} className="gap-1.5">
                View delivery
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setCreated(null); setCustomerName(''); setReference(''); setAmount(''); setNotes(''); }} className="gap-1.5">
                <Send className="h-4 w-4" />
                Create another
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
        Back
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">New delivery</h1>
        <p className="text-sm text-muted-foreground">Create a delivery in seconds. Send the link to your customer.</p>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer name *</Label>
              <Input
                id="customerName"
                placeholder="e.g. Ahmed"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Order / reference number</Label>
              <Input
                id="reference"
                placeholder="e.g. ORD-8842"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount to collect (optional)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g. 42.50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="e.g. Apartment near the pharmacy"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create delivery'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
