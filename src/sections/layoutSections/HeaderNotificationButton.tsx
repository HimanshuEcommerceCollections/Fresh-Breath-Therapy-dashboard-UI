"use client";

import type { Notification } from "@/src/data/layoutData/notificationData";

export default function HeaderNotificationButton({
  notification,
}: {
  notification: Notification;
}) {
  return (
    <button
      type="button"
      aria-label="Notifications"
      onClick={() => {
        // TODO: open the notifications panel once it exists.
      }}
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#071123] transition-colors hover:bg-black/[0.04]"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.84534 14C6.96237 14.2027 7.13068 14.371 7.33337 14.488C7.53605 14.605 7.76597 14.6666 8 14.6666C8.23404 14.6666 8.46396 14.605 8.66664 14.488C8.86933 14.371 9.03764 14.2027 9.15467 14"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.17467 10.216C2.08758 10.3115 2.0301 10.4302 2.00924 10.5577C1.98837 10.6852 2.00501 10.8161 2.05714 10.9343C2.10926 11.0525 2.19462 11.1531 2.30284 11.2237C2.41105 11.2943 2.53745 11.3319 2.66667 11.332H13.3333C13.4625 11.3321 13.589 11.2946 13.6972 11.2241C13.8055 11.1536 13.891 11.0532 13.9433 10.935C13.9955 10.8169 14.0123 10.6861 13.9916 10.5586C13.9709 10.431 13.9136 10.3123 13.8267 10.2167C12.94 9.3027 12 8.33136 12 5.33203C12 4.27117 11.5786 3.25375 10.8284 2.5036C10.0783 1.75346 9.06087 1.33203 8 1.33203C6.93914 1.33203 5.92172 1.75346 5.17157 2.5036C4.42143 3.25375 4 4.27117 4 5.33203C4 8.33136 3.05933 9.3027 2.17467 10.216Z"
          stroke="currentColor"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {notification.hasUnread && (
        <span
          aria-hidden
          className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#F22A36]"
        />
      )}
    </button>
  );
}
