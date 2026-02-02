import { motion } from "framer-motion";
import { Compass } from "lucide-react";

const PageLoader = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'hsl(var(--background))' }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
          style={{
            background: 'hsl(var(--primary) / 0.15)',
            border: '2px solid hsl(var(--primary) / 0.3)',
          }}
        >
          <Compass 
            className="w-8 h-8" 
            style={{ color: 'hsl(var(--primary))' }} 
          />
        </motion.div>
        <p 
          className="text-sm tracking-wider"
          style={{ 
            fontFamily: "'Special Elite', monospace",
            color: 'hsl(var(--muted-foreground))',
          }}
        >
          Loading the road ahead...
        </p>
      </motion.div>
    </div>
  );
};

export default PageLoader;
