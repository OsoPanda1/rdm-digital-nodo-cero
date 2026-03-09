import { motion } from "framer-motion";

interface LoadingSkeletonProps {
  variant?: "card" | "text" | "image" | "event";
  count?: number;
  className?: string;
}

const SkeletonPulse = ({ className = "" }: { className?: string }) => (
  <motion.div
    className={`rounded-xl loading-shimmer ${className}`}
    animate={{ opacity: [0.5, 0.8, 0.5] }}
    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
  />
);

const CardSkeleton = () => (
  <div className="glass-card rounded-2xl overflow-hidden">
    <SkeletonPulse className="h-48 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <SkeletonPulse className="h-4 w-3/4" />
      <SkeletonPulse className="h-3 w-full" />
      <SkeletonPulse className="h-3 w-2/3" />
    </div>
  </div>
);

const EventSkeleton = () => (
  <div className="glass-card rounded-2xl p-5 space-y-3">
    <div className="flex items-center gap-3">
      <SkeletonPulse className="w-12 h-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <SkeletonPulse className="h-4 w-2/3" />
        <SkeletonPulse className="h-3 w-1/2" />
      </div>
    </div>
    <SkeletonPulse className="h-3 w-full" />
    <SkeletonPulse className="h-3 w-4/5" />
  </div>
);

const LoadingSkeleton = ({ variant = "card", count = 4, className = "" }: LoadingSkeletonProps) => {
  const Skeleton = variant === "event" ? EventSkeleton : CardSkeleton;
  
  return (
    <div className={`grid gap-6 ${
      variant === "event" ? "md:grid-cols-3" : 
      count <= 2 ? "md:grid-cols-2" : 
      "sm:grid-cols-2 lg:grid-cols-4"
    } ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Skeleton />
        </motion.div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
