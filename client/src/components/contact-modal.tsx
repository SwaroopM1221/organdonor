import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Donor } from "@shared/schema";
import { Phone, Mail, MapPin, Droplet, Heart, MessageSquare } from "lucide-react";

interface ContactModalProps {
  donor: Donor;
  distance: number;
  onClose: () => void;
}

export function ContactModal({ donor, distance, onClose }: ContactModalProps) {
  const handleCall = () => {
    window.location.href = `tel:${donor.phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${donor.email}`;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">{donor.name}</DialogTitle>
          <DialogDescription>
            Donor contact information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="default" className="rounded-full">
                  <Droplet className="w-3 h-3 mr-1" />
                  {donor.bloodType}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{distance.toFixed(1)} km away</span>
                </div>
              </div>
            </div>
          </div>

          {donor.organDonations.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Willing to Donate</p>
              <div className="flex flex-wrap gap-2">
                {donor.organDonations.map((organ) => (
                  <Badge key={organ} variant="secondary">
                    {organ}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{donor.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{donor.email}</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
              <span className="font-medium">{donor.address}</span>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-3">
            <Button 
              data-testid="button-call"
              onClick={handleCall} 
              variant="default" 
              className="w-full"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
            <Button 
              data-testid="button-email"
              onClick={handleEmail} 
              variant="outline"
              className="w-full"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              <strong>Privacy Notice:</strong> Please respect donor privacy and only contact them for legitimate medical needs. Misuse of contact information may result in account suspension.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
