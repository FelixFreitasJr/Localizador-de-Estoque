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

  app.post(api.items.bulkCreate.path, async (req, res) => {
    try {
      const input = api.items.bulkCreate.input.parse(req.body);
      const items = await storage.bulkCreateItems(input);
      res.status(201).json(items);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      res.status(500).json({ message: "Erro interno ao processar carga" });
    }
  });

  app.post(api.items.duplicate.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const item = await storage.getItem(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const { id: _, lastUpdated: __, code, ...rest } = item;
    const newItem = await storage.createItem({
      ...rest,
      code: `${code}-COPIA-${Date.now()}`,
    });
    res.status(201).json(newItem);
  });

  // Seed data if empty
  const existing = await storage.getItems();
  if (existing.length === 0) {
    await storage.createItem({
      code: "SER10",
      name: "Seringa 10ml",
      description: "Seringa descartável sem agulha",
      locationExternal: "Prateleira A1",
      locationSatellite: "Armário 2",
    });
    await storage.createItem({
      code: "PARA500",
      name: "Paracetamol 500mg",
      description: "Comprimidos",
      locationExternal: "Gaveta B3",
      locationSatellite: "Gaveta C1",
    });
    await storage.createItem({
      code: "LUV-M",
      name: "Luva de Procedimento M",
      description: "Caixa com 100 unidades",
      locationExternal: "Estante D",
      locationSatellite: "Estante A",
    });
  }

  return httpServer;
}
