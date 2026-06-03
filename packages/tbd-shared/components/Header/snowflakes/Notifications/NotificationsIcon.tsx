import { lazy, memo, Suspense } from "react";

const OpenEvelopeIcon = lazy(() => import("../images/open-envelope.svg"));
const CloseEnvelopeIcon = lazy(() => import("../images/close-envelope.svg"));

export const NotificationsIcon = memo(({ unreadNotifications }: { unreadNotifications: boolean }) => {
  const LazySVGComponent = unreadNotifications ? CloseEnvelopeIcon : OpenEvelopeIcon;

  return (
    <Suspense fallback={<></>}>
      <LazySVGComponent />
    </Suspense>
  );
});

NotificationsIcon.displayName = "NotificationsIcon";
