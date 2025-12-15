import { NextRequest } from "next/server";
import { Server } from "socket.io";

export const dynamic = "force-dynamic";

// Workaround for Socket.io with Next.js App Router
const ioHandler = (req: NextRequest) => {
  // This will be handled by middleware
};

export { ioHandler as GET, ioHandler as POST };
