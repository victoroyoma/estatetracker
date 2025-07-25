import './index.css';
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { DevTools } from './lib/devTools';
import { env } from './lib/env';

// Initialize development tools
if (env.DEBUG_MODE) {
  DevTools.init();
}

const container = document.getElementById("root");
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);
root.render(<App />);