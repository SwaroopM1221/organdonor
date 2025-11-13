import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { insertDonorSchema, BLOOD_TYPES, ORGAN_TYPES, type InsertDonor } from "@shared/schema";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { MapPin, User, Droplet, Heart, Phone, Mail, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import heroImage from "@assets/generated_images/Community_support_helping_hands_382c90aa.png";

const STEPS = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Medical Details", icon: Droplet },
  { id: 3, title: "Contact & Location", icon: MapPin },
];

export default function Register() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [locationPermission, setLocationPermission] = useState<"pending" | "granted" | "denied">("pending");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const form = useForm<InsertDonor & { termsAccepted: boolean }>({
    resolver: zodResolver(insertDonorSchema.extend({
      termsAccepted: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms and conditions",
      }),
    })),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      bloodType: undefined,
      organDonations: [],
      address: "",
      latitude: 28.6139,
      longitude: 77.2090,
      available: true,
      termsAccepted: false,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertDonor) => {
      return await apiRequest("POST", "/api/donors", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/donors"] });
      toast({
        title: "Registration Successful!",
        description: "You've been registered as a donor. Thank you for saving lives!",
      });
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });

  useEffect(() => {
    if (currentStep === 3 && locationPermission === "pending") {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            form.setValue("latitude", position.coords.latitude);
            form.setValue("longitude", position.coords.longitude);
            setLocationPermission("granted");
          },
          (error) => {
            console.error("Location error:", error);
            setLocationPermission("denied");
            const fallbackLat = 28.6139;
            const fallbackLng = 77.2090;
            setUserLocation({
              latitude: fallbackLat,
              longitude: fallbackLng,
            });
            form.setValue("latitude", fallbackLat);
            form.setValue("longitude", fallbackLng);
            toast({
              title: "Location Access Denied",
              description: "Using default location (New Delhi). You can still register.",
            });
          }
        );
      } else {
        setLocationPermission("denied");
        const fallbackLat = 28.6139;
        const fallbackLng = 77.2090;
        setUserLocation({
          latitude: fallbackLat,
          longitude: fallbackLng,
        });
        form.setValue("latitude", fallbackLat);
        form.setValue("longitude", fallbackLng);
      }
    }
  }, [currentStep, locationPermission, form, toast]);

  const onSubmit = (data: InsertDonor & { termsAccepted: boolean }) => {
    const { termsAccepted, ...donorData } = data;
    registerMutation.mutate(donorData);
  };

  const validateStep = async () => {
    let fieldsToValidate: (keyof InsertDonor)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ["name", "email", "phone"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["bloodType", "organDonations"];
    }

    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const progressValue = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-48 bg-gradient-to-r from-primary/10 to-primary/5 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Community support" 
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground">Become a Donor</h1>
            <p className="text-muted-foreground mt-2">Join our community of life-savers</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-8">
        <Card className="shadow-lg">
          <CardHeader className="space-y-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl">Registration Progress</CardTitle>
              <CardDescription>
                Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
              </CardDescription>
            </div>
            <Progress value={progressValue} className="h-2" />
            <div className="flex justify-between pt-2">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isCompleted
                          ? "bg-primary text-primary-foreground"
                          : isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <p className={`text-xs mt-2 text-center ${isActive ? "font-medium" : "text-muted-foreground"}`}>
                      {step.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input 
                              data-testid="input-name"
                              placeholder="John Doe" 
                              {...field} 
                              className="h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                              <Input 
                                data-testid="input-email"
                                type="email" 
                                placeholder="john@example.com" 
                                {...field}
                                className="pl-9 h-11"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                              <Input 
                                data-testid="input-phone"
                                type="tel" 
                                placeholder="+1 (555) 000-0000" 
                                {...field}
                                className="pl-9 h-11"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="bloodType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Type *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-blood-type" className="h-11">
                                <SelectValue placeholder="Select your blood type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {BLOOD_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  <div className="flex items-center gap-2">
                                    <Droplet className="w-4 h-4 text-primary" />
                                    {type}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="organDonations"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Organs Willing to Donate *</FormLabel>
                            <FormDescription>
                              Select all organs you're willing to donate
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {ORGAN_TYPES.map((organ) => (
                              <FormField
                                key={organ}
                                control={form.control}
                                name="organDonations"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={organ}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          data-testid={`checkbox-organ-reg-${organ}`}
                                          checked={field.value?.includes(organ)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, organ])
                                              : field.onChange(
                                                  field.value?.filter((value) => value !== organ)
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal cursor-pointer">
                                        {organ}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address *</FormLabel>
                          <FormControl>
                            <Input 
                              data-testid="input-address"
                              placeholder="123 Main St, City, State, ZIP" 
                              {...field}
                              className="h-11"
                            />
                          </FormControl>
                          <FormDescription>
                            Your full residential address
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="rounded-lg border bg-muted/50 p-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Location Access</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {locationPermission === "granted" ? (
                              <span className="text-green-600 dark:text-green-400">
                                ✓ Location detected successfully
                              </span>
                            ) : locationPermission === "denied" ? (
                              <span className="text-muted-foreground">
                                Using default location (New Delhi). You can still register.
                              </span>
                            ) : (
                              "We need your location to help people find nearby donors."
                            )}
                          </p>
                          {userLocation && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Lat: {userLocation.latitude.toFixed(4)}, Long: {userLocation.longitude.toFixed(4)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              data-testid="checkbox-terms"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              I accept the terms and conditions *
                            </FormLabel>
                            <FormDescription>
                              By checking this box, you agree to be contacted for organ and blood donation requests and consent to share your information with those in need.
                            </FormDescription>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="flex-1"
                      data-testid="button-back"
                    >
                      Back
                    </Button>
                  )}
                  
                  {currentStep < STEPS.length ? (
                    <Button
                      type="button"
                      onClick={validateStep}
                      className="flex-1"
                      data-testid="button-next"
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={registerMutation.isPending}
                      data-testid="button-register"
                    >
                      {registerMutation.isPending ? "Registering..." : "Complete Registration"}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
