import React, { useState, useCallback, useRef } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { QR_CATEGORIES, QRCategory, QRField } from '@/types/qr-types';
import { Download, Heart, Star, Users, Sparkles } from 'lucide-react';

interface QRCodeGeneratorProps {
  onLoginPrompt: () => void;
  isLoggedIn: boolean;
}

export default function QRCodeGenerator({ onLoginPrompt, isLoggedIn }: QRCodeGeneratorProps) {
  const [selectedCategory, setSelectedCategory] = useState<QRCategory>(QR_CATEGORIES[0]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleCategoryChange = useCallback((category: QRCategory) => {
    setSelectedCategory(category);
    setFormData({});
    setQrCodeUrl('');
  }, []);

  const handleInputChange = useCallback((fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }, []);

  const generateQRData = useCallback((category: QRCategory, data: Record<string, any>): string => {
    switch (category.id) {
      case 'website-links':
        return data.url || '';
      
      case 'contact-communication':
        if (data.type === 'vCard') {
          return `BEGIN:VCARD
VERSION:3.0
FN:${data.name || ''}
TEL:${data.phone || ''}
EMAIL:${data.email || ''}
END:VCARD`;
        } else if (data.type === 'Phone') {
          return `tel:${data.phone || ''}`;
        } else if (data.type === 'SMS') {
          return `sms:${data.phone || ''}?body=${encodeURIComponent(data.message || '')}`;
        } else if (data.type === 'Email') {
          return `mailto:${data.email || ''}?subject=${encodeURIComponent(data.message || '')}`;
        } else if (data.type === 'WhatsApp') {
          return `https://wa.me/${data.phone?.replace(/[^0-9]/g, '') || ''}?text=${encodeURIComponent(data.message || '')}`;
        }
        return '';
      
      case 'documents-files':
        return data.fileUrl || '';
      
      case 'payments-donations':
        if (data.paymentType === 'UPI') {
          return `upi://pay?pa=${data.recipient}&am=${data.amount || ''}&cu=${data.currency || 'INR'}&tn=${encodeURIComponent(data.note || '')}`;
        }
        return data.recipient || '';
      
      case 'business-marketing':
        if (data.businessType === 'Business Card') {
          return `BEGIN:VCARD
VERSION:3.0
FN:${data.contactPerson || ''}
ORG:${data.businessName || ''}
TEL:${data.phone || ''}
EMAIL:${data.email || ''}
URL:${data.website || ''}
ADR:;;${data.address || ''};;;;
END:VCARD`;
        }
        return data.website || data.email || '';
      
      case 'events-ticketing':
        return `BEGIN:VEVENT
SUMMARY:${data.eventName || ''}
DTSTART:${data.eventDate ? data.eventDate.replace(/-/g, '') : ''}
LOCATION:${data.location || ''}
DESCRIPTION:${data.description || ''}
URL:${data.rsvpUrl || ''}
END:VEVENT`;
      
      case 'location-navigation':
        if (data.coordinates) {
          return `geo:${data.coordinates}?q=${encodeURIComponent(data.locationName + ', ' + data.address)}`;
        }
        return `https://maps.google.com/maps?q=${encodeURIComponent(data.address || '')}`;
      
      case 'media-entertainment':
        return data.mediaUrl || '';
      
      case 'wifi-auth':
        if (data.authType === 'WiFi') {
          return `WIFI:T:${data.security || 'WPA2'};S:${data.networkName || ''};P:${data.password || ''};H:false;;`;
        }
        return data.loginUrl || '';
      
      case 'creative-fun':
        return data.revealUrl || data.content || '';
      
      default:
        return JSON.stringify(data);
    }
  }, []);

  const generateQRCode = useCallback(async () => {
    try {
      setIsGenerating(true);
      
      // Validate required fields
      const requiredFields = selectedCategory.fields.filter(field => field.required);
      const missingFields = requiredFields.filter(field => !formData[field.name]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Missing Required Fields",
          description: `Please fill in: ${missingFields.map(f => f.label).join(', ')}`,
          variant: "destructive"
        });
        return;
      }

      const qrData = generateQRData(selectedCategory, formData);
      
      if (!qrData) {
        toast({
          title: "Invalid Data",
          description: "Please provide valid information to generate QR code",
          variant: "destructive"
        });
        return;
      }

      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 400,
        margin: 2,
        color: {
          dark: '#1a1a1a',
          light: '#ffffff'
        }
      });

      setQrCodeUrl(qrCodeDataUrl);
      toast({
        title: "QR Code Generated!",
        description: "Your QR code is ready to download",
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  }, [selectedCategory, formData, generateQRData]);

  const downloadQRCode = useCallback(() => {
    if (!qrCodeUrl) return;
    
    if (!isLoggedIn) {
      onLoginPrompt();
      return;
    }

    const link = document.createElement('a');
    link.download = `qr-code-${selectedCategory.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`;
    link.href = qrCodeUrl;
    link.click();
    
    toast({
      title: "QR Code Downloaded!",
      description: "Your QR code has been saved to your downloads folder",
    });
  }, [qrCodeUrl, isLoggedIn, onLoginPrompt, selectedCategory]);

  const toggleFavorite = useCallback((categoryId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(categoryId)) {
        newFavorites.delete(categoryId);
      } else {
        newFavorites.add(categoryId);
      }
      return newFavorites;
    });
  }, []);

  const renderField = useCallback((field: QRField) => {
    const value = formData[field.name] || '';
    
    switch (field.type) {
      case 'select':
        return (
          <Select value={value} onValueChange={(val) => handleInputChange(field.name, val)}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="min-h-[100px]"
          />
        );
      
      default:
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
          />
        );
    }
  }, [formData, handleInputChange]);

  // Sort categories to show favorites first
  const sortedCategories = React.useMemo(() => {
    const favoriteCategories = QR_CATEGORIES.filter(cat => favorites.has(cat.id));
    const regularCategories = QR_CATEGORIES.filter(cat => !favorites.has(cat.id));
    return [...favoriteCategories, ...regularCategories];
  }, [favorites]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-accent/30 to-secondary/20">
      {/* Sidebar */}
      <div className="w-80 bg-card/80 backdrop-blur-lg border-r border-border/50 shadow-card overflow-y-auto">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                QR Generator
              </h1>
              <p className="text-xs text-muted-foreground">Professional QR Code Creator</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Free Plan: 10/30 codes</span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
              <Star className="w-4 h-4" />
              FAVORITES
            </h3>
            {favorites.size === 0 && (
              <p className="text-xs text-muted-foreground italic">Click ♡ to add favorites</p>
            )}
          </div>
          
          <div className="space-y-2">
            {sortedCategories.map((category) => (
              <div
                key={category.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-smooth border ${
                  selectedCategory.id === category.id
                    ? 'bg-gradient-accent border-primary/30 shadow-primary'
                    : 'bg-card/50 border-border/30 hover:bg-accent/50 hover:border-primary/20'
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${category.color}`} />
                      <h4 className="font-medium text-sm leading-tight">{category.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(category.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                  >
                    <Heart 
                      className={`w-4 h-4 ${
                        favorites.has(category.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-muted-foreground hover:text-red-500'
                      }`} 
                    />
                  </button>
                </div>
                {favorites.has(category.id) && (
                  <Badge variant="outline" className="absolute -top-1 -right-1 text-xs px-1 py-0">
                    ★
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Form Section */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-12 h-12 rounded-xl ${selectedCategory.color} flex items-center justify-center text-white shadow-lg`}>
                  <span className="text-xl">🔗</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedCategory.name}</h2>
                  <p className="text-muted-foreground">{selectedCategory.description}</p>
                </div>
              </div>
            </div>

            <Card className="shadow-card bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">QR Code Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedCategory.fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name} className="text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {renderField(field)}
                  </div>
                ))}

                <div className="pt-4">
                  <Button
                    onClick={generateQRCode}
                    disabled={isGenerating}
                    className="w-full"
                    variant="gradient"
                    size="lg"
                  >
                    {isGenerating ? 'Generating...' : 'Generate QR Code'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* QR Code Preview Section */}
        <div className="w-96 p-8 bg-gradient-to-b from-card/80 to-accent/20 backdrop-blur-sm border-l border-border/50">
          <div className="sticky top-8">
            <h3 className="text-lg font-semibold mb-6">QR Code Preview</h3>
            
            <Card className="shadow-card bg-card/60 backdrop-blur-sm border-border/30">
              <CardContent className="p-6">
                <div className="aspect-square bg-white rounded-lg p-4 mb-4 flex items-center justify-center">
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="QR Code" className="max-w-full max-h-full" />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <div className="w-32 h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center mb-3">
                        <span className="text-4xl">📱</span>
                      </div>
                      <p className="text-sm">Your QR code will appear here</p>
                    </div>
                  )}
                </div>

                {qrCodeUrl && (
                  <div className="space-y-3">
                    <Button
                      onClick={downloadQRCode}
                      className="w-full"
                      variant="secondary"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download QR Code
                    </Button>
                    
                    {!isLoggedIn && (
                      <p className="text-xs text-center text-muted-foreground">
                        Login to save QR codes to your profile
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Usage Stats */}
            <Card className="mt-6 shadow-card bg-gradient-accent border-border/30">
              <CardContent className="p-4">
                <h4 className="font-semibold text-sm mb-3">Usage Statistics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">QR Codes Created:</span>
                    <span className="font-medium">3/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days Remaining:</span>
                    <span className="font-medium">27</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div className="bg-gradient-primary h-2 rounded-full w-[30%]"></div>
                  </div>
                </div>
                <Button variant="link" className="w-full mt-3 text-xs p-0 h-auto">
                  Upgrade to Premium
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}