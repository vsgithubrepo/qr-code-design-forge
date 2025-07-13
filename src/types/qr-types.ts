export interface QRCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  fields: QRField[];
  color: string;
}

export interface QRField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select' | 'number';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface QRCodeData {
  id: string;
  categoryId: string;
  name: string;
  data: Record<string, any>;
  qrCodeUrl: string;
  createdAt: Date;
  isFavorite?: boolean;
}

export interface UserLimits {
  maxQRCodes: number;
  currentCount: number;
  isPremium: boolean;
  daysRemaining: number;
}

// QR Category Definitions
export const QR_CATEGORIES: QRCategory[] = [
  {
    id: 'website-links',
    name: 'Website & Links',
    icon: 'Link',
    description: 'Create QR codes for websites, social media, and online content',
    color: 'bg-blue-500',
    fields: [
      { name: 'url', type: 'url', label: 'Website URL', placeholder: 'https://example.com', required: true },
      { name: 'title', type: 'text', label: 'Title (Optional)', placeholder: 'My Website' }
    ]
  },
  {
    id: 'contact-communication',
    name: 'Contact & Communication',
    icon: 'Phone',
    description: 'Share contact details, phone numbers, and communication links',
    color: 'bg-green-500',
    fields: [
      { name: 'type', type: 'select', label: 'Contact Type', options: ['vCard', 'Phone', 'SMS', 'Email', 'WhatsApp'], required: true },
      { name: 'firstName', type: 'text', label: 'First Name', placeholder: 'John', required: true },
      { name: 'middleName', type: 'text', label: 'Middle Name', placeholder: 'Michael' },
      { name: 'lastName', type: 'text', label: 'Last Name', placeholder: 'Doe' },
      { name: 'mobileNumber1', type: 'tel', label: 'Mobile Number 1', placeholder: '+1234567890', required: true },
      { name: 'mobileLabel1', type: 'select', label: 'Mobile 1 Label', options: ['Personal', 'WhatsApp', 'Official', 'Work', 'Home'], required: true },
      { name: 'mobileNumber2', type: 'tel', label: 'Mobile Number 2 (Optional)', placeholder: '+1234567890' },
      { name: 'mobileLabel2', type: 'select', label: 'Mobile 2 Label', options: ['Personal', 'WhatsApp', 'Official', 'Work', 'Home'] },
      { name: 'mobileNumber3', type: 'tel', label: 'Mobile Number 3 (Optional)', placeholder: '+1234567890' },
      { name: 'mobileLabel3', type: 'select', label: 'Mobile 3 Label', options: ['Personal', 'WhatsApp', 'Official', 'Work', 'Home'] },
      { name: 'homeAddress', type: 'textarea', label: 'Home Address', placeholder: '123 Home Street, City, State, ZIP' },
      { name: 'officeAddress', type: 'textarea', label: 'Office Address', placeholder: '456 Office Building, City, State, ZIP' },
      { name: 'email', type: 'email', label: 'Email Address', placeholder: 'john@example.com' },
      { name: 'linkedinLink', type: 'url', label: 'LinkedIn Profile', placeholder: 'https://linkedin.com/in/johndoe' },
      { name: 'instagramLink', type: 'url', label: 'Instagram Profile', placeholder: 'https://instagram.com/johndoe' },
      { name: 'xAccount', type: 'url', label: 'X (Twitter) Profile', placeholder: 'https://x.com/johndoe' },
      { name: 'facebook', type: 'url', label: 'Facebook Profile', placeholder: 'https://facebook.com/johndoe' },
      { name: 'website', type: 'url', label: 'Website', placeholder: 'https://johndoe.com' },
      { name: 'summary', type: 'textarea', label: 'About/Summary', placeholder: 'Brief description about yourself or your profession...' },
      { name: 'message', type: 'textarea', label: 'Message (for SMS/WhatsApp)', placeholder: 'Hello! Nice to connect with you.' }
    ]
  },
  {
    id: 'documents-files',
    name: 'Documents & Files',
    icon: 'FileText',
    description: 'Link to downloadable files, documents, and resources',
    color: 'bg-purple-500',
    fields: [
      { name: 'fileUrl', type: 'url', label: 'File URL', placeholder: 'https://example.com/document.pdf', required: true },
      { name: 'fileName', type: 'text', label: 'File Name', placeholder: 'Document.pdf', required: true },
      { name: 'description', type: 'textarea', label: 'Description', placeholder: 'Brief description of the file' }
    ]
  },
  {
    id: 'payments-donations',
    name: 'Payments & Donations',
    icon: 'CreditCard',
    description: 'Create payment links and donation QR codes',
    color: 'bg-yellow-500',
    fields: [
      { name: 'paymentType', type: 'select', label: 'Payment Type', options: ['UPI', 'PayPal', 'Stripe', 'Crypto', 'Donation'], required: true },
      { name: 'recipient', type: 'text', label: 'Recipient', placeholder: 'john@upi or wallet address', required: true },
      { name: 'amount', type: 'number', label: 'Amount (Optional)', placeholder: '10.00' },
      { name: 'currency', type: 'text', label: 'Currency', placeholder: 'USD' },
      { name: 'note', type: 'text', label: 'Payment Note', placeholder: 'Payment for...' }
    ]
  },
  {
    id: 'business-marketing',
    name: 'Business & Marketing',
    icon: 'Briefcase',
    description: 'Digital business cards, promotions, and marketing materials',
    color: 'bg-indigo-500',
    fields: [
      { name: 'businessType', type: 'select', label: 'Business Type', options: ['Business Card', 'Promotion', 'Menu', 'Review', 'Loyalty'], required: true },
      { name: 'businessName', type: 'text', label: 'Business Name', placeholder: 'ABC Company', required: true },
      { name: 'contactPerson', type: 'text', label: 'Contact Person', placeholder: 'John Doe' },
      { name: 'phone', type: 'tel', label: 'Phone', placeholder: '+1234567890' },
      { name: 'email', type: 'email', label: 'Email', placeholder: 'info@company.com' },
      { name: 'website', type: 'url', label: 'Website', placeholder: 'https://company.com' },
      { name: 'address', type: 'textarea', label: 'Address', placeholder: '123 Business St, City, State' }
    ]
  },
  {
    id: 'events-ticketing',
    name: 'Events & Ticketing',
    icon: 'Calendar',
    description: 'Event invitations, tickets, and RSVP forms',
    color: 'bg-pink-500',
    fields: [
      { name: 'eventName', type: 'text', label: 'Event Name', placeholder: 'Birthday Party', required: true },
      { name: 'eventDate', type: 'text', label: 'Event Date', placeholder: '2024-12-25' },
      { name: 'eventTime', type: 'text', label: 'Event Time', placeholder: '7:00 PM' },
      { name: 'location', type: 'textarea', label: 'Location', placeholder: '123 Party Ave, City' },
      { name: 'rsvpUrl', type: 'url', label: 'RSVP URL (Optional)', placeholder: 'https://rsvp.com/event' },
      { name: 'description', type: 'textarea', label: 'Event Description', placeholder: 'Join us for a celebration!' }
    ]
  },
  {
    id: 'location-navigation',
    name: 'Location & Navigation',
    icon: 'MapPin',
    description: 'Share locations, addresses, and navigation links',
    color: 'bg-red-500',
    fields: [
      { name: 'locationName', type: 'text', label: 'Location Name', placeholder: 'My Store', required: true },
      { name: 'address', type: 'textarea', label: 'Full Address', placeholder: '123 Main St, City, State, ZIP', required: true },
      { name: 'coordinates', type: 'text', label: 'GPS Coordinates (Optional)', placeholder: '40.7128,-74.0060' },
      { name: 'instructions', type: 'textarea', label: 'Directions/Instructions', placeholder: 'Additional navigation help' }
    ]
  },
  {
    id: 'media-entertainment',
    name: 'Media & Entertainment',
    icon: 'Play',
    description: 'Share music, videos, and entertainment content',
    color: 'bg-orange-500',
    fields: [
      { name: 'mediaType', type: 'select', label: 'Media Type', options: ['Music', 'Video', 'Playlist', 'Photo Gallery', 'AR/VR'], required: true },
      { name: 'mediaUrl', type: 'url', label: 'Media URL', placeholder: 'https://spotify.com/playlist/...', required: true },
      { name: 'title', type: 'text', label: 'Title', placeholder: 'My Awesome Playlist', required: true },
      { name: 'artist', type: 'text', label: 'Artist/Creator', placeholder: 'Artist Name' },
      { name: 'description', type: 'textarea', label: 'Description', placeholder: 'About this content...' }
    ]
  },
  {
    id: 'wifi-auth',
    name: 'WiFi & Authentication',
    icon: 'Wifi',
    description: 'WiFi access codes and authentication setup',
    color: 'bg-teal-500',
    fields: [
      { name: 'authType', type: 'select', label: 'Type', options: ['WiFi', '2FA Setup', 'Login'], required: true },
      { name: 'networkName', type: 'text', label: 'Network Name (SSID)', placeholder: 'MyWiFi' },
      { name: 'password', type: 'text', label: 'Password', placeholder: 'wifi-password' },
      { name: 'security', type: 'select', label: 'Security Type', options: ['WPA2', 'WPA3', 'WEP', 'None'] },
      { name: 'loginUrl', type: 'url', label: 'Login URL (Optional)', placeholder: 'https://login.example.com' }
    ]
  },
  {
    id: 'creative-fun',
    name: 'Creative & Fun',
    icon: 'Sparkles',
    description: 'Hidden messages, games, and creative uses',
    color: 'bg-violet-500',
    fields: [
      { name: 'creativeType', type: 'select', label: 'Creative Type', options: ['Hidden Message', 'Game', 'Treasure Hunt', 'Surprise', 'Art'], required: true },
      { name: 'title', type: 'text', label: 'Title', placeholder: 'Secret Message', required: true },
      { name: 'content', type: 'textarea', label: 'Content/Message', placeholder: 'Your hidden message or instructions...', required: true },
      { name: 'revealUrl', type: 'url', label: 'Reveal URL (Optional)', placeholder: 'https://surprise.com' }
    ]
  }
];