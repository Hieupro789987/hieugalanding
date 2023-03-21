import { useState } from "react";
import { NotificationList } from "../../../layouts/shop-layout/components/notification-list";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { Spinner } from "../../shared/utilities/misc";

export function NotificationPage() {
  const { user } = useAuth();

  return (
    <div className={`relative min-h-screen bg-white`}>
      <div className="py-2">
        {!user ? (
          <Spinner />
        ) : (
          <NotificationList
            isPopoverMode={false}
            onClose={() => {}}
            onRead={() => {
              // loadNotificationCount();
            }}
          />
        )}
      </div>
    </div>
  );
}
