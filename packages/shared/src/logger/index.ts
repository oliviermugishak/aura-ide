const logger = {
  info: (message: string) => {
    console.log(`[INFO]: ${message}`);
  },
  warn: (message: string) => {
    console.warn(`[WARN]: ${message}`);
  },
};

export { logger };
