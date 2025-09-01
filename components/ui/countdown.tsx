"use client";

import { formatTimeLeft } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CountdownProps {
  endDate: Date;
}

export function Countdown({ endDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    function updateTime() {
      const diff = endDate.getTime() - Date.now();
      setTimeLeft(diff);
    }

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  if (timeLeft === null) return null;

  return (
    <span className="flex text-2xl text-muted-foreground">
      {formatTimeLeft(timeLeft)}
    </span>
  );
}
