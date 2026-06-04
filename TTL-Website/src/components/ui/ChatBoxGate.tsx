"use client";

import { usePathname } from "next/navigation";
import ChatBox from "./ChatBox";

export default function ChatBoxGate() {
  const pathname = usePathname();

  if (pathname.startsWith("/auth") || pathname.startsWith("/admin")) {
    return null;
  }

  return <ChatBox />;
}
