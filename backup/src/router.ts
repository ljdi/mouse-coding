import { createRouter } from "@tanstack/react-router";

import indexRoute from "./routes";
import rootRoute from "./routes/__root";
import aboutRoute from "./routes/about";
import playgroundRoute from "./routes/playground";

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  playgroundRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
