import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DotsRingProps {
  size?: number;
  className?: string;
  label?: string;
  decorative?: boolean;
}

export const DotsRing = ({
  size = 48,
  className,
  label = "Carregando",
  decorative = false,
}: DotsRingProps) => {
  const reducedMotion = useReducedMotion();
  return (
    <div
      className={cn("dots-ring text-primary relative shrink-0", className)}
      style={{ width: size, height: size }}
      role={decorative ? undefined : "status"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
    >
      <div
        className="relative h-12 w-12"
        style={{
          transform: `scale(${size / 48})`,
          transformOrigin: "top left",
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <motion.div
            key={i}
            className="absolute top-0 left-1/2 -ml-1 h-2 w-2 origin-[4px_24px] rounded-full bg-current"
            style={{ rotate: i * 45 }}
            animate={
              reducedMotion
                ? { scale: 1, opacity: 1 }
                : { scale: [1, 0.5, 1], opacity: [1, 0.3, 1] }
            }
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }
            }
          />
        ))}
      </div>
    </div>
  );
};

export default DotsRing;
