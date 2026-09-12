import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface AuthProps {
  mode: 'login' | 'signup';
  onLogin: () => void;
}

export default function Auth({ mode, onLogin }: AuthProps) {
  const navigate = useNavigate();
  const isSignup = mode === 'signup';
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignup && (!name || !phone))) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
      toast.success(isSignup ? 'Compte créé !' : 'Bon retour !');
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[hsl(210,40%,98%)]">
      <div className="flex items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">DropLink</span>
        </Link>
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Accueil
          </Button>
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md border-border/60 shadow-lg">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold tracking-tight">
              {isSignup ? 'Créez votre compte' : 'Bon retour'}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {isSignup
                ? 'Commencez à partager des liens de position avec vos clients.'
                : 'Connectez-vous à votre compte livreur DropLink.'}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {isSignup && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input id="name" placeholder="Votre nom" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              )}
              {isSignup && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" placeholder="+216 22 123 456" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Veuillez patienter...' : isSignup ? 'Créer le compte' : 'Se connecter'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isSignup ? (
                <>
                  Vous avez déjà un compte ?{' '}
                  <Link to="/login" className="font-medium text-primary hover:underline">Se connecter</Link>
                </>
              ) : (
                <>
                  Vous n'avez pas de compte ?{' '}
                  <Link to="/signup" className="font-medium text-primary hover:underline">S'inscrire</Link>
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
