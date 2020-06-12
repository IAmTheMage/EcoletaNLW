import Express from "express";
import dbConnection from "../database/connection";

class PointController {
  async index(req: Express.Request, res: Express.Response) {
    const { city, uf, items } = req.query;
    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));
    console.log(parsedItems);
    const points = await dbConnection("points")
      .join("points_items", "points_items.point_id", "=", "points.id")
      .whereIn("points_items.item_id", parsedItems || "1,2,3,4,5,6")
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
    try {
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
      console.log(point[0]);
      const pointItems = items
        .split(",")
        .map((item: string) => Number(item.trim()))
        .map((item: number) => {
          return {
            item_id: item,
            point_id: point[0],
          };
        });

      await transaction("points_items").insert(pointItems);
      await transaction.commit();
      return res.json({ point: point[0] });
    } catch (e) {
      await transaction.rollback();
    }
  }
}

export default new PointController();
