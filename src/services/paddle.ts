import { initializePaddle } from "@paddle/paddle-js";
import type { Paddle } from "@paddle/paddle-js";

let paddleInstance: Paddle | undefined = undefined;

export const initPaddle = async (): Promise<Paddle | undefined> => {
  if (paddleInstance) {
    return paddleInstance;
  }

  const clientToken = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;

  if (!clientToken) {
    console.error(
      "VITE_PADDLE_CLIENT_TOKEN is missing in environment variables.",
    );
    return undefined;
  }

  try {
    paddleInstance = await initializePaddle({
      token: clientToken,
    });
    return paddleInstance;
  } catch (error) {
    console.error("Failed to initialize Paddle:", error);
    return undefined;
  }
};
