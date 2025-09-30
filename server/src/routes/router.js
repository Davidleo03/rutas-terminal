import { Router } from "express";

const router = Router();



router.get("/", (req, res) => {
  res.send("Hello from Router!");
});

router.post("/data", (req, res) => {
  const receivedData = req.body;
  console.log("Received data:", receivedData);
  res.json({ message: "Data received successfully", data: receivedData });
});

export default router;