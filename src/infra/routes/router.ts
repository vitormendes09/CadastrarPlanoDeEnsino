import { Router } from "express";
import { factoryConsultaGradeCurricularController } from "../factory/factorycontroller";

const router = Router();

const consultaGradeCurricularController = factoryConsultaGradeCurricularController();

router.get('/vivo', (req, res) => {
  res.status(200).json({ message: 'Estou vivo!' });
});

router.get('/curriculo/:cursoId', (req, res) => {
  consultaGradeCurricularController.handle(req, res);
});

export { router };