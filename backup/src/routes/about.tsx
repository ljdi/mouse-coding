import { createRoute } from "@tanstack/react-router";
import { FC } from "react";

import rootRoute from "./__root";

import { Button } from "@repo/ui/components/button";

const About: FC = () => {
  return <Button>About</Button>;
};

export default createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});
