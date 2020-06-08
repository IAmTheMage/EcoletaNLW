import Express from "express";
import dbConnection from "../database/connection";

class PointController {
  async index(req: Express.Request, res: Express.Response) {
    const { city, uf, items } = req.query;
    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));
    const points = await dbConnection("points")
      .join("points_items", "points_items.point_id", "=", "points.id")
      .whereIn("points_items.item_id", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

    return res.status(200).json(points);
  }

  async show(req: Express.Request, res: Express.Response) {
    const { id } = req.params;

    const point = await dbConnection("points").where("id", id).first();

    if (!point) {
      return res.status(400).json({ error: "Point doesn`t not exists" });
    }
    const items = await dbConnection("items")
      .join("points_items", "items.id", "=", "points_items.item_id")
      .where("points_items.point_id", id)
      .select("items.title");
    return res.status(200).json({ point, items });
  }

  async store(req: Express.Request, res: Express.Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = req.body;
    const transaction = await dbConnection.transaction();
    const point = await transaction("points")
      .insert({
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        image: req.file.filename,
      })
      .returning("id");

    const pointItems = items.map((item: number) => {
      return {
        point_id: point[0],
        item_id: item,
      };
    });

    await transaction("points_items").insert(pointItems);
    return res.json({ point: point[0] });
  }
}

export default new PointController();
