import { Router } from "express";
import supabase from '../config/supabase.js';

const router = Router();



router.get("/", (req, res) => {
  res.json({ data: "Hello from Router!"});
});






export default router;