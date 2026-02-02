import { Mountain, Heart, Compass } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div 
      className="min-h-screen pt-24 pb-16 page-enter"
      style={{ backgroundColor: 'hsl(20 15% 8%)' }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p 
            className="text-sm uppercase tracking-[0.3em] mb-4 font-medium"
            style={{ color: 'hsl(170 60% 55%)' }}
          >
            Our Story
          </p>
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            style={{ color: 'hsl(0 0% 100%)' }}
          >
            About SoulRide
          </h1>
          <p 
            className="text-xl font-script"
            style={{ color: 'hsl(30 15% 60%)' }}
          >
            Inspiring motorbike journeys through undiscovered beauty
          </p>
        </motion.div>

        {/* Story Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8 mb-16"
        >
          <div 
            className="p-8 md:p-10 rounded-2xl"
            style={{
              background: 'linear-gradient(180deg, hsl(20 18% 12%) 0%, hsl(25 15% 10%) 100%)',
              border: '1px solid hsl(25 15% 18%)',
              boxShadow: '0 8px 40px -8px hsl(0 0% 0% / 0.4)',
            }}
          >
            <p 
              className="text-lg leading-relaxed mb-6"
              style={{ color: 'hsl(30 15% 75%)' }}
            >
              SoulRide was born from a simple truth: the best roads are the ones most riders never find. 
              They're not on popular GPS routes or tourist maps. They hide in the folds of mountains, 
              wind through villages time forgot, and lead to viewpoints that make you pull over and 
              simply breathe.
            </p>
            <p 
              className="text-lg leading-relaxed mb-6"
              style={{ color: 'hsl(30 15% 75%)' }}
            >
              We are a collective of riders, dreamers, and wanderers based in Ohrid, Macedonia—a land 
              where ancient lakes mirror endless skies and mountain passes test both machine and spirit. 
              Every spot we share has been ridden, felt, and earned through countless kilometers of 
              exploration.
            </p>
            <p 
              className="text-lg leading-relaxed"
              style={{ color: 'hsl(30 15% 75%)' }}
            >
              This isn't just a directory of destinations. It's an invitation to ride with intention, 
              to seek beauty in the forgotten corners, and to let the road transform you one curve at a time.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Mountain,
              title: "Adventure",
              description: "We chase horizons and embrace the unknown paths.",
            },
            {
              icon: Heart,
              title: "Authenticity",
              description: "Every spot is personally discovered and passionately shared.",
            },
            {
              icon: Compass,
              title: "Freedom",
              description: "The road answers to no schedule. Neither do we.",
            },
          ].map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="p-6 text-center rounded-2xl transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'linear-gradient(180deg, hsl(20 18% 12%) 0%, hsl(25 15% 10%) 100%)',
                border: '1px solid hsl(25 15% 18%)',
              }}
            >
              <div 
                className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4"
                style={{ 
                  background: 'hsl(15 70% 50% / 0.15)',
                  border: '1px solid hsl(15 70% 50% / 0.25)',
                }}
              >
                <value.icon className="w-7 h-7" style={{ color: 'hsl(15 70% 55%)' }} />
              </div>
              <h3 
                className="text-xl font-bold tracking-tight mb-2"
                style={{ color: 'hsl(0 0% 100%)' }}
              >
                {value.title}
              </h3>
              <p 
                className="text-sm"
                style={{ color: 'hsl(30 10% 60%)' }}
              >
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="p-8 rounded-2xl text-center"
          style={{
            background: 'hsl(15 70% 50% / 0.08)',
            border: '1px solid hsl(15 70% 50% / 0.2)',
          }}
        >
          <p 
            className="font-script text-xl"
            style={{ color: 'hsl(30 25% 65%)' }}
          >
            "The best roads are not marked on any map — they are found by those who ride with soul."
          </p>
        </motion.div>

        {/* Built in Ohrid */}
        <div className="mt-12 text-center">
          <p 
            className="text-sm"
            style={{ color: 'hsl(30 10% 50%)' }}
          >
            Built with soul in <span style={{ color: 'hsl(170 60% 55%)' }}>Ohrid, Macedonia</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
