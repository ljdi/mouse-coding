import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { FC } from "react";

const Root: FC = () => {
  return (
    <>
      {/* <div className="p-2 flex gap-2">
      <Link className="[&.active]:font-bold" to="/">
        Home
      </Link>
      <Link className="[&.active]:font-bold" to="/about">
        About
      </Link>
      <Link className="[&.active]:font-bold" to="/playground">
        Playground
      </Link>
    </div>
    <hr /> */}
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
};

export default createRootRoute({
  component: Root,
});
