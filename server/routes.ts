import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDonorSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/donors", async (req, res) => {
    try {
      const donors = await storage.getAllDonors();
      res.json(donors);
    } catch (error) {
      console.error("Error fetching donors:", error);
      res.status(500).json({ error: "Failed to fetch donors" });
    }
  });

  app.get("/api/donors/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const donor = await storage.getDonor(id);
      
      if (!donor) {
        return res.status(404).json({ error: "Donor not found" });
      }
      
      res.json(donor);
    } catch (error) {
      console.error("Error fetching donor:", error);
      res.status(500).json({ error: "Failed to fetch donor" });
    }
  });

  app.post("/api/donors", async (req, res) => {
    try {
      const validatedData = insertDonorSchema.parse(req.body);
      const donor = await storage.createDonor(validatedData);
      res.status(201).json(donor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      console.error("Error creating donor:", error);
      res.status(500).json({ error: "Failed to create donor" });
    }
  });

  app.patch("/api/donors/:id/availability", async (req, res) => {
    try {
      const { id } = req.params;
      const availabilitySchema = z.object({
        available: z.boolean(),
      });
      
      const validatedData = availabilitySchema.parse(req.body);
      const donor = await storage.updateDonorAvailability(id, validatedData.available);
      
      if (!donor) {
        return res.status(404).json({ error: "Donor not found" });
      }
      
      res.json(donor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      console.error("Error updating donor availability:", error);
      res.status(500).json({ error: "Failed to update donor availability" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
