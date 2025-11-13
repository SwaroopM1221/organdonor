import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { getDistance } from "geolib";
import L from "leaflet";
import { MapPin, Phone, Droplet, Heart, MapPinned, Filter } from "lucide-react";
import type { Donor } from "@shared/schema";
import { BLOOD_TYPES, ORGAN_TYPES, SEARCH_RANGES } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ContactModal } from "@/components/contact-modal";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

const customMarkerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userLocationIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNSIgY3k9IjE1IiByPSIxNCIgZmlsbD0iIzM4NzZGRiIgZmlsbC1vcGFjaXR5PSIwLjMiLz48Y2lyY2xlIGN4PSIxNSIgY3k9IjE1IiByPSI4IiBmaWxsPSIjMzg3NkZGIi8+PGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iNCIgZmlsbD0id2hpdGUiLz48L3N2Zz4=",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

interface MapControllerProps {
  center: [number, number];
}

function MapController({ center }: MapControllerProps) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
}

export default function Home() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedRange, setSelectedRange] = useState(10);
  const [selectedBloodTypes, setSelectedBloodTypes] = useState<string[]>([]);
  const [selectedOrgans, setSelectedOrgans] = useState<string[]>([]);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const { data: donors = [], isLoading } = useQuery<Donor[]>({
    queryKey: ["/api/donors"],
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setLocationError(null);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Unable to get your location. Please enable location services.");
          setUserLocation([28.6139, 77.2090]);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
      setUserLocation([28.6139, 77.2090]);
    }
  }, []);

  const filteredDonors = donors.filter((donor) => {
    if (!userLocation) return false;

    const distance = getDistance(
      { latitude: userLocation[0], longitude: userLocation[1] },
      { latitude: donor.latitude, longitude: donor.longitude }
    ) / 1000;

    if (distance > selectedRange) return false;

    if (showOnlyAvailable && !donor.available) return false;

    if (selectedBloodTypes.length > 0 && !selectedBloodTypes.includes(donor.bloodType)) {
      return false;
    }

    if (selectedOrgans.length > 0) {
      const hasMatchingOrgan = selectedOrgans.some(organ => 
        donor.organDonations.includes(organ)
      );
      if (!hasMatchingOrgan) return false;
    }

    return true;
  });

  const getDonorDistance = (donor: Donor) => {
    if (!userLocation) return 0;
    return getDistance(
      { latitude: userLocation[0], longitude: userLocation[1] },
      { latitude: donor.latitude, longitude: donor.longitude }
    ) / 1000;
  };

  const handleBloodTypeToggle = (bloodType: string) => {
    setSelectedBloodTypes((prev) =>
      prev.includes(bloodType)
        ? prev.filter((bt) => bt !== bloodType)
        : [...prev, bloodType]
    );
  };

  const handleOrganToggle = (organ: string) => {
    setSelectedOrgans((prev) =>
      prev.includes(organ)
        ? prev.filter((o) => o !== organ)
        : [...prev, organ]
    );
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPinned className="w-5 h-5 text-primary" />
          <Label className="text-sm font-medium">Search Range</Label>
        </div>
        <Select value={selectedRange.toString()} onValueChange={(v) => setSelectedRange(Number(v))}>
          <SelectTrigger data-testid="select-range" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SEARCH_RANGES.map((range) => (
              <SelectItem key={range.value} value={range.value.toString()}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Droplet className="w-5 h-5 text-primary" />
          <Label className="text-sm font-medium">Blood Type</Label>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {BLOOD_TYPES.map((bloodType) => (
            <Button
              key={bloodType}
              data-testid={`button-blood-${bloodType}`}
              variant={selectedBloodTypes.includes(bloodType) ? "default" : "outline"}
              size="sm"
              onClick={() => handleBloodTypeToggle(bloodType)}
              className="text-xs"
            >
              {bloodType}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          <Label className="text-sm font-medium">Organ Types</Label>
        </div>
        <div className="space-y-2">
          {ORGAN_TYPES.map((organ) => (
            <div key={organ} className="flex items-center space-x-2">
              <Checkbox
                id={organ}
                data-testid={`checkbox-organ-${organ}`}
                checked={selectedOrgans.includes(organ)}
                onCheckedChange={() => handleOrganToggle(organ)}
              />
              <label
                htmlFor={organ}
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {organ}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium">Availability</Label>
        <div className="flex items-center justify-between">
          <Label htmlFor="availability-toggle" className="text-sm font-normal">
            Show only available donors
          </Label>
          <Switch
            id="availability-toggle"
            data-testid="switch-availability"
            checked={showOnlyAvailable}
            onCheckedChange={setShowOnlyAvailable}
          />
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-2">Found Donors</p>
          <p className="text-lg font-semibold text-primary">{filteredDonors.length}</p>
          <p className="text-xs mt-1">within {selectedRange} km</p>
        </div>
      </div>
    </div>
  );

  if (!userLocation) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Getting your location...</CardTitle>
          </CardHeader>
          <CardContent>
            {locationError ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">{locationError}</p>
                <p className="text-sm text-muted-foreground">
                  Using default location (New Delhi). The map will work, but distances may not be accurate.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <aside className="hidden lg:block w-80 border-r bg-card p-6 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Find Donors</h2>
          <p className="text-sm text-muted-foreground">
            Filter donors by blood type, organ, and distance
          </p>
        </div>
        <FilterPanel />
      </aside>

      <div className="flex-1 relative">
        <div className="lg:hidden absolute top-4 left-4 z-[1000]">
          <Sheet>
            <SheetTrigger asChild>
              <Button data-testid="button-filter-mobile" variant="default" size="icon" className="shadow-lg">
                <Filter className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filter Donors</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterPanel />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading donors...</p>
            </div>
          </div>
        ) : (
          <MapContainer
            center={userLocation}
            zoom={13}
            className="h-full w-full"
            zoomControl={true}
          >
            <MapController center={userLocation} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <Marker position={userLocation} icon={userLocationIcon}>
              <Popup>
                <div className="text-center">
                  <p className="font-semibold">Your Location</p>
                </div>
              </Popup>
            </Marker>

            {filteredDonors.map((donor) => (
              <Marker
                key={donor.id}
                position={[donor.latitude, donor.longitude]}
                icon={customMarkerIcon}
              >
                <Popup>
                  <div className="space-y-2 min-w-[200px]">
                    <div>
                      <p className="text-lg font-semibold">{donor.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="default" className="rounded-full">
                          <Droplet className="w-3 h-3 mr-1" />
                          {donor.bloodType}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{getDonorDistance(donor).toFixed(1)} km away</span>
                      </div>
                    </div>

                    {donor.organDonations.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {donor.organDonations.slice(0, 3).map((organ) => (
                          <Badge key={organ} variant="secondary" className="text-xs">
                            {organ}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Button
                      data-testid={`button-contact-${donor.id}`}
                      variant="default"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => setSelectedDonor(donor)}
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      Contact
                    </Button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {selectedDonor && (
        <ContactModal
          donor={selectedDonor}
          distance={getDonorDistance(selectedDonor)}
          onClose={() => setSelectedDonor(null)}
        />
      )}
    </div>
  );
}
