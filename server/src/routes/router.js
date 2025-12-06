import { Router } from "express";

import UserRoutes from "./auth.routes.js";
import EmpresaRoutes from "./empresa.routes.js";
import BusesRoutes from "./buses.routes.js";
import RutasRoutes from "./rutas.routes.js";
import RutasTRRoutes from "./rutas_RT.routes.js";

const router = Router();


router.use("/auth", UserRoutes);

router.use("/empresas", EmpresaRoutes);

router.use("/buses", BusesRoutes);

router.use("/rutas", RutasRoutes);

router.use("/rutas_tiempo_real", RutasTRRoutes);



router.get("/", (req, res) => {
  res.json({ data: "Hello from Router!"});
});






export default router;