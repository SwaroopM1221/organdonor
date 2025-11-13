import { type Donor, type InsertDonor } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getDonor(id: string): Promise<Donor | undefined>;
  getAllDonors(): Promise<Donor[]>;
  createDonor(donor: InsertDonor): Promise<Donor>;
  updateDonorAvailability(id: string, available: boolean): Promise<Donor | undefined>;
}

export class MemStorage implements IStorage {
  private donors: Map<string, Donor>;

  constructor() {
    this.donors = new Map();
    this.seedDemoData();
  }

  private seedDemoData() {
    const demoDonors: InsertDonor[] = [
      {
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "+1 (555) 123-4567",
        bloodType: "O+",
        organDonations: ["Kidney", "Liver"],
        latitude: 28.6139,
        longitude: 77.2090,
        address: "123 Main St, New Delhi, India",
        available: true,
      },
      {
        name: "Michael Chen",
        email: "michael.chen@email.com",
        phone: "+1 (555) 234-5678",
        bloodType: "A+",
        organDonations: ["Heart", "Lungs", "Corneas"],
        latitude: 28.6229,
        longitude: 77.2195,
        address: "456 Oak Ave, New Delhi, India",
        available: true,
      },
      {
        name: "Emily Rodriguez",
        email: "emily.r@email.com",
        phone: "+1 (555) 345-6789",
        bloodType: "B-",
        organDonations: ["Bone Marrow", "Kidney"],
        latitude: 28.6059,
        longitude: 77.1985,
        address: "789 Pine Rd, New Delhi, India",
        available: false,
      },
      {
        name: "David Williams",
        email: "david.w@email.com",
        phone: "+1 (555) 456-7890",
        bloodType: "AB+",
        organDonations: ["Liver", "Pancreas"],
        latitude: 28.6289,
        longitude: 77.2145,
        address: "321 Elm St, New Delhi, India",
        available: false,
      },
      {
        name: "Priya Sharma",
        email: "priya.sharma@email.com",
        phone: "+1 (555) 567-8901",
        bloodType: "O-",
        organDonations: ["Heart", "Kidney", "Liver"],
        latitude: 28.6179,
        longitude: 77.2250,
        address: "567 Maple Dr, New Delhi, India",
        available: true,
      },
    ];

    demoDonors.forEach((donor) => {
      const id = randomUUID();
      const fullDonor: Donor = {
        ...donor,
        id,
        lastActive: new Date(),
        createdAt: new Date(),
      };
      this.donors.set(id, fullDonor);
    });
  }

  async getDonor(id: string): Promise<Donor | undefined> {
    return this.donors.get(id);
  }

  async getAllDonors(): Promise<Donor[]> {
    return Array.from(this.donors.values());
  }

  async createDonor(insertDonor: InsertDonor): Promise<Donor> {
    const id = randomUUID();
    const donor: Donor = {
      ...insertDonor,
      id,
      lastActive: new Date(),
      createdAt: new Date(),
    };
    this.donors.set(id, donor);
    return donor;
  }

  async updateDonorAvailability(
    id: string,
    available: boolean
  ): Promise<Donor | undefined> {
    const donor = this.donors.get(id);
    if (!donor) return undefined;

    const updatedDonor = { ...donor, available, lastActive: new Date() };
    this.donors.set(id, updatedDonor);
    return updatedDonor;
  }
}

export const storage = new MemStorage();
