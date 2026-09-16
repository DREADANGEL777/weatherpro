import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import { SubscriptionProvider } from "./context/SubscriptionContext";

import "./i18n";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SubscriptionProvider>
      <App />
    </SubscriptionProvider>
  </StrictMode>,
);
