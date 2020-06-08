import express, { response } from "express";
import dbConnection from "../database/connection";

class ItemController {
  async index(req: any, res: any) {
    const items = await dbConnection("items").select("*");
    return res.json({ items });
  }
}

export default new ItemController();
