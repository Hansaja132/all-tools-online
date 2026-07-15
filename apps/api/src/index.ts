import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { logger } from '@tools-website/utils';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server successfully started running on port ${PORT}`);
});
