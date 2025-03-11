import { myStreamsFetcher } from "@/api/stream";
import type { NotificationResponse } from "@/api/types";
import { WEBSOCKET_URL } from "@/constants/api";
import { useAppStore } from "@/store/store.ts";
import { createCable } from "@anycable/web";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useEffect } from "react";
import { Toaster, toast } from "sonner";
import useSWR from "swr";

export const Route = createRootRoute({
  component: () => {
    const { data: streams } = useSWR("streams", myStreamsFetcher);
    const accessToken = useAppStore((state) => state.accessToken);
    const clearAll = useAppStore((state) => state.clearAll);

    useEffect(() => {
      if (!streams) return;

      const cable = createCable(WEBSOCKET_URL, {
        logLevel: "debug",
      });
      const notificationChannel = cable.streamFromSigned(streams.notifications);

      notificationChannel.on("message", (receivedMessage) => {
        const notification = receivedMessage as NotificationResponse;
        toast(
          `${notification.from.name} reacted with ${notification.notifiable.reaction.emoji} to: ${notification.notifiable.reaction.tweet.text}`,
        );
      });

      return () => {
        notificationChannel.disconnect();
      };
    }, [streams]);

    return (
      <>
        <div className="flex gap-2 p-2">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>
          <Link to="/companion" className="[&.active]:font-bold">
            Companion
          </Link>
          <Link to="/tool" className="[&.active]:font-bold">
            Tool
          </Link>
          <Link to="/notification" className="[&.active]:font-bold">
            Notification
          </Link>
          <Link to="/settings/profile" className="[&.active]:font-bold">
            Settings
          </Link>
          {accessToken && (
            <Link to={"/"} params={{ logout: true }} onClick={() => clearAll()}>
              Logout
            </Link>
          )}
          <Toaster position="top-right" expand={true} closeButton />
        </div>
        <hr />
        <Outlet />
        <TanStackRouterDevtools />
      </>
    );
  },
});
