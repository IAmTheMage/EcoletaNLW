import { Router } from "express";
import multer from "multer";
import storage from "./config/upload";
import ItemsController from "./controllers/ItemsController";
import PointController from "./controllers/PointController";

const router = Router();

const upload = multer({ storage });

router.get("/items", ItemsController.index);
router.post("/points", upload.single("file"), PointController.store);
router.get("/points/:id", PointController.show);
router.get("/points", PointController.index);

export default router;
