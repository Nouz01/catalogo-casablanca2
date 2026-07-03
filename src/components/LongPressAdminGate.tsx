"use client";

import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

const HOLD_MS = 700;
const MOVE_THRESHOLD = 12;

export function LongPressAdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startPos.current = null;
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      startPos.current = { x: e.clientX, y: e.clientY };
      timerRef.current = setTimeout(() => {
        router.push("/login");
      }, HOLD_MS);
    },
    [router]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!startPos.current) return;
      const dx = Math.abs(e.clientX - startPos.current.x);
      const dy = Math.abs(e.clientY - startPos.current.y);
      if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
        clear();
      }
    },
    [clear]
  );

  return (
    <div
      style={{
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={clear}
      onPointerCancel={clear}
      onPointerLeave={clear}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}
