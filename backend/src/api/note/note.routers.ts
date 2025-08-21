import { Router } from "express";
import { NoteController } from "./note.controllers";
import { upload } from "../../middleware/multer";

const router = Router();

// router.get("/", NoteController.getAll);
router.get("/", NoteController.getAllWithPagination);
router.get("/:patientId", NoteController.getByPatientId);
router.post("/", NoteController.create);
router.post("/upload", upload.single("file"), NoteController.upload);
router.put("/:id", NoteController.update);
router.delete("/:id", NoteController.delete);

export default router;
