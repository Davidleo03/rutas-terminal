import express from 'express';
import cors from 'cors';

import configuraction from './config/env.config.js';
import router from './routes/router.js';


const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router)



const PORT = configuraction.port;



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});