import React, { useState } from 'react';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import AuthModal from '@/components/AuthModal';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { LogOut, Settings, Crown, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UserData {
  id: string;
  name: string;
  email: string;
  isPremium: boolean;
  qrCodesCount: number;
  maxQrCodes: number;
}

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleLogin = (user: UserData) => {
    setUserData(user);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUserData(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const openLoginModal = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-secondary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-primary">
                <span className="text-primary-foreground font-bold text-lg">Q</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  QR Generator Pro
                </h1>
                <p className="text-xs text-muted-foreground">Professional QR Code Solutions</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {userData ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}`} />
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                          {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{userData.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{userData.email}</p>
                      {userData.isPremium && (
                        <div className="flex items-center gap-1 mt-1">
                          <Crown className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs font-medium text-yellow-600">Premium</span>
                        </div>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    {!userData.isPremium && (
                      <DropdownMenuItem>
                        <Crown className="mr-2 h-4 w-4" />
                        <span>Upgrade to Premium</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={openLoginModal}>
                    Login
                  </Button>
                  <Button variant="gradient" onClick={openLoginModal}>
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        <QRCodeGenerator 
          onLoginPrompt={openLoginModal}
          isLoggedIn={!!userData}
        />
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Index;
