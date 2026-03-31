import { useEffect, useState } from "react";

const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setIsExpired(true);
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return (
      <div className="rounded-xl bg-secondary p-4 text-center">
        <p className="font-display font-bold text-destructive">Event has started!</p>
      </div>
    );
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-3 justify-center">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center rounded-xl bg-secondary p-3 min-w-[60px]">
          <span className="font-display text-2xl font-bold text-primary">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="text-xs text-muted-foreground">{unit.label}</span>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
