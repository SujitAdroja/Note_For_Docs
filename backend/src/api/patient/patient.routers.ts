import { Router } from "express";
import { PatientController } from "./patient.controllers";

const router = Router();

router.get("/", PatientController.getAll);
router.get("/paginated", PatientController.getAllWithPagination);
router.get("/:id", PatientController.getById);
router.post("/", PatientController.create);
router.put("/:id", PatientController.update);
router.delete("/:id", PatientController.delete);

export default router;
