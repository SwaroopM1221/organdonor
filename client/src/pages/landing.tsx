import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Heart, Users, Clock } from "lucide-react";
import heroImage from "@assets/generated_images/Medical_hero_compassionate_donors_9ce41024.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-96 lg:h-[500px] overflow-hidden">
        <img
          src={heroImage}
          alt="Medical professionals and donors"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        
        <div className="relative h-full flex items-center justify-center px-4">
          <div className="text-center max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
              Save Lives Through <span className="text-primary">Connection</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/90 mb-8">
              Find nearby organ and blood donors in real-time. Connect with verified donors in your area and make a life-saving difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/find">
                <Button 
                  data-testid="button-find-donors"
                  size="lg" 
                  className="text-base px-8 backdrop-blur-sm bg-primary border border-primary-border"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Find Donors
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  data-testid="button-register-donor"
                  size="lg" 
                  variant="outline" 
                  className="text-base px-8 backdrop-blur-sm bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Register as Donor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">
            Three simple steps to connect donors with those in need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <Card className="hover-elevate active-elevate-2 transition-all duration-200">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Register as Donor</CardTitle>
              <CardDescription>
                Sign up with your contact details, blood type, and organs you're willing to donate. Share your location to help people find you.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-elevate active-elevate-2 transition-all duration-200">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Search by Location</CardTitle>
              <CardDescription>
                Use our interactive map to find donors near you. Filter by blood type, organ type, and distance range for accurate results.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover-elevate active-elevate-2 transition-all duration-200">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Connect & Save Lives</CardTitle>
              <CardDescription>
                View donor contact details and reach out directly. Every connection made through our platform has the potential to save a life.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-16 lg:mt-24">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                    Every Second Counts
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    In medical emergencies, finding compatible donors quickly can mean the difference between life and death. Our real-time location-based platform ensures you can connect with nearby donors instantly.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">Real-time Updates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">Location-based Search</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center lg:justify-end">
                  <div className="bg-card rounded-lg p-6 border max-w-sm w-full">
                    <h4 className="font-semibold mb-4 text-center">Emergency Hotline</h4>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">1-800-LIFE-NOW</p>
                      <p className="text-sm text-muted-foreground mt-2">Available 24/7</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h3>
          <p className="text-muted-foreground mb-8">
            Join thousands of donors who are helping save lives every day
          </p>
          <Link href="/register">
            <Button data-testid="button-register-cta" size="lg" className="text-base px-8">
              <Heart className="w-5 h-5 mr-2" />
              Become a Donor Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
