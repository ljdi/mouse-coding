import { createRoute } from "@tanstack/react-router";
import { FC } from "react";

import rootRoute from "./__root";

const Index: FC = () => {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  );
};

export default createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Index,
});
