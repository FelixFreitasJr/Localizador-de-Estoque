import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.items.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const items = await storage.getItems(search);
    res.json(items);
  });

  app.get(api.items.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    
    const item = await storage.getItem(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  });

  app.post(api.items.create.path, async (req, res) => {
    try {
      const input = api.items.create.input.parse(req.body);
      const item = await storage.createItem(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.items.update.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

      const input = api.items.update.input.parse(req.body);
      const item = await storage.updateItem(id, input);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.items.delete.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    await storage.deleteItem(id);
    res.status(204).send();
  });

  // Seed data if empty
  const existing = await storage.getItems();
  if (existing.length === 0) {
    await storage.createItem({
      name: "Seringa 10ml",
      description: "Seringa descartável sem agulha",
      category: "Descartáveis",
      locationExternal: "Prateleira A1",
      locationSatellite: "Armário 2",
      quantityExternal: 150,
      quantitySatellite: 50,
    });
    await storage.createItem({
      name: "Paracetamol 500mg",
      description: "Comprimidos",
      category: "Medicamentos",
      locationExternal: "Gaveta B3",
      locationSatellite: "Gaveta C1",
      quantityExternal: 500,
      quantitySatellite: 200,
    });
    await storage.createItem({
      name: "Luva de Procedimento M",
      description: "Caixa com 100 unidades",
      category: "EPI",
      locationExternal: "Estante D",
      locationSatellite: "Estante A",
      quantityExternal: 30,
      quantitySatellite: 10,
    });
  }

  return httpServer;
}
