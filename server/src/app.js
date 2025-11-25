import express from 'express';
import cors from 'cors';

import configuraction from './config/env.config.js';
import router from './routes/router.js';
import errorHandler from './middleware/errorHandler.js';



const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router)

// Registrar middleware de manejo de errores (después de las rutas)
app.use(errorHandler);

const PORT = configuraction.port;



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});