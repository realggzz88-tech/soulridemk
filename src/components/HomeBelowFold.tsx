import { Link } from "react-router-dom";
import { ArrowRight, Mountain, Compass, Users, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import DailySoulGem from "@/components/DailySoulGem";
import JourneyPlanner from "@/components/JourneyPlanner";
import PopularRoutes from "@/components/PopularRoutes";
import WhySoulRide from "@/components/WhySoulRide";

const HomeBelowFold = () => {
  return (
    <>
      <WhySoulRide />
      <JourneyPlanner />
      <PopularRoutes />

      <section className="py-20 sm:py-28 px-4" style={{ backgroundColor: "hsl(20 15% 8%)" }}>
        <div className="max-w-7xl mx-auto">
          <DailySoulGem />
        </div>
      </section>

      <section
        className="py-20 sm:py-28 px-4 relative overflow-hidden"
        style={{ backgroundColor: "hsl(20 15% 10%)" }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle, hsl(170 60% 50%) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p
              className="text-sm uppercase tracking-[0.3em] mb-4 font-medium"
              style={{ color: "hsl(170 60% 55%)" }}
            >
              Искуството
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5"
              style={{ color: "hsl(0 0% 100%)" }}
            >
              Вози со намера
            </h2>
            <p className="max-w-xl mx-auto text-lg font-script" style={{ color: "hsl(30 15% 60%)" }}>
              "Секој пат раскажува приказна. Секоја дестинација крие тајна."
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                icon: Mountain,
                title: "Скриени видиковци",
                description:
                  "Откријте гледишта и панорами што повеќето карти ги заборавиле. Каде перспективата се заработува низ кривулести патишта.",
              },
              {
                icon: Compass,
                title: "Селектирани рути",
                description:
                  "Рачно избрани патишта што се вијат и наградуваат. Рути избрани за радоста на патувањето.",
              },
              {
                icon: Users,
                title: "Братство на возачи",
                description:
                  "Совети и приказни од души што живеат за следниот завој. Споделена мудрост, разменети приказни.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="group rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "linear-gradient(180deg, hsl(20 18% 13%) 0%, hsl(25 15% 11%) 100%)",
                  border: "1px solid hsl(25 15% 18%)",
                }}
              >
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: "hsl(15 70% 50% / 0.15)",
                    border: "1px solid hsl(15 70% 50% / 0.25)",
                  }}
                >
                  <feature.icon className="w-7 h-7" style={{ color: "hsl(15 70% 55%)" }} />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-3" style={{ color: "hsl(0 0% 100%)" }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(30 10% 60%)" }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32 px-4 relative overflow-hidden" style={{ backgroundColor: "hsl(20 15% 8%)" }}>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, hsl(15 70% 50% / 0.1) 0%, transparent 50%)",
            filter: "blur(60px)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center relative z-10"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <MapPin className="w-5 h-5" style={{ color: "hsl(15 70% 55%)" }} />
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5"
            style={{ color: "hsl(0 0% 100%)" }}
          >
            Твоето патување те чека
          </h2>
          <p className="mb-10 max-w-lg mx-auto text-lg font-script" style={{ color: "hsl(30 15% 60%)" }}>
            "Безброј скриени места. Бесконечни спомени чекаат да се создадат."
          </p>
          <Link to="/spots" className="btn-primary arrow-animate inline-flex items-center gap-3 group">
            <span>Истражи ги сите места</span>
            <ArrowRight size={16} className="arrow-icon transition-transform" />
          </Link>

          <p className="mt-14 text-sm" style={{ color: "hsl(30 10% 45%)" }}>
            "Патот повикува. Дали ќе одговориш?"
          </p>
        </motion.div>
      </section>
    </>
  );
};

export default HomeBelowFold;
