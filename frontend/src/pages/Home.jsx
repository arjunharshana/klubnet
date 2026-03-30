import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import {
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "motion/react";

const WORD_CONTAINER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const WORD = {
  hidden: { y: 80, opacity: 0, rotateX: -40 },
  visible: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};
const slideLeft = {
  hidden: { x: -80, opacity: 0 },
  visible: (i = 0) => ({
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};
const slideRight = {
  hidden: { x: 80, opacity: 0 },
  visible: (i = 0) => ({
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};
const fadeUp = {
  hidden: { y: 50, opacity: 0 },
  visible: (i = 0) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};
const popIn = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: (i = 0) => ({
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 280, damping: 18, delay: i * 0.1 },
  }),
};

function useScrollReveal(margin = "-80px 0px") {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin });
  return [ref, inView];
}

/* Animated counter */
function Counter({ to, duration = 1.8, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) {
        setCount(to);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, to, duration]);
  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* Particle dot field */
function ParticleField({ count = 28 }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      dur: 4 + Math.random() * 6,
      delay: Math.random() * 4,
      amp: 8 + Math.random() * 20,
    })),
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.current.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{ y: [0, -p.amp, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

function OrbitRing({
  size,
  duration,
  reverse = false,
  dashed = false,
  cls = "border-border/40",
}) {
  return (
    <motion.div
      className={`absolute rounded-full border ${dashed ? "border-dashed" : ""} ${cls}`}
      style={{
        width: size,
        height: size,
        top: "50%",
        left: "50%",
        x: "-50%",
        y: "-50%",
      }}
      animate={{ rotate: reverse ? [0, -360] : [0, 360] }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    />
  );
}

function TiltCard({ children, className = "" }) {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 25 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientY - r.top) / r.height - 0.5) * -14);
    y.set(((e.clientX - r.left) / r.width - 0.5) * 14);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 900 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedPath({ d, className, strokeWidth = "2", delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.path
      ref={ref}
      d={d}
      className={className}
      strokeWidth={strokeWidth}
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={inView ? { pathLength: 1, opacity: 1 } : {}}
      transition={{ duration: 2, delay, ease: "easeInOut" }}
    />
  );
}

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const [howRef, howInView] = useScrollReveal();
  const [featRef, featInView] = useScrollReveal();
  const [connRef, connInView] = useScrollReveal();
  const [ctaRef, ctaInView] = useScrollReveal();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-text font-display selection:bg-primary/20 overflow-x-hidden">
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="z-50 relative"
      >
        <Navbar />
      </motion.div>

      <main className="flex-1">
        <section
          ref={heroRef}
          className="relative w-full overflow-hidden pt-1 pb-8 md:pt-2 md:pb-8 flex items-center justify-center"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,hsl(var(--primary)/0.22),transparent_42%)] z-0 pointer-events-none" />

          {/* SVG Art and Floating Shapes */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
            <motion.div
              style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
              className="relative h-[600px] w-full max-w-5xl items-center justify-center opacity-80 dark:opacity-60"
            >
              {/* Spinning orbit rings */}
              <OrbitRing
                size={288}
                duration={18}
                dashed
                cls="border-border/40"
              />
              <OrbitRing
                size={384}
                duration={24}
                reverse
                cls="border-primary/15"
              />
              <OrbitRing size={450} duration={30} cls="border-border/25" />
              <OrbitRing
                size={560}
                duration={40}
                reverse
                dashed
                cls="border-border/15"
              />

              {/* Breathing glow blob */}
              <motion.div
                className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl pointer-events-none"
                animate={{ scale: [1, 1.4, 1], opacity: [0.35, 0.65, 0.35] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Orbiting dots */}
              {[
                {
                  size: 288,
                  dur: 18,
                  angle: 0,
                  color: "bg-primary",
                  reverse: false,
                },
                {
                  size: 450,
                  dur: 30,
                  angle: 120,
                  color: "bg-primary/70",
                  reverse: true,
                },
                {
                  size: 384,
                  dur: 24,
                  angle: 240,
                  color: "bg-primary/50",
                  reverse: false,
                },
              ].map((dot, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: dot.size,
                    height: dot.size,
                    x: "-50%",
                    y: "-50%",
                  }}
                  animate={{
                    rotate: dot.reverse
                      ? [dot.angle, dot.angle - 360]
                      : [dot.angle, dot.angle + 360],
                  }}
                  transition={{
                    duration: dot.dur,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div
                    className={`absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full ${dot.color} shadow-lg shadow-primary/50`}
                  />
                </motion.div>
              ))}

              {/* Centre pulsing orb */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <motion.div
                  className="h-24 w-24 rounded-full bg-primary"
                  animate={{
                    scale: [1, 1.18, 1],
                    boxShadow: [
                      "0 0 40px hsl(var(--primary)/0.4)",
                      "0 0 90px hsl(var(--primary)/0.75)",
                      "0 0 40px hsl(var(--primary)/0.4)",
                    ],
                  }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-background" />
              </div>

              {/* Rotating decorative shapes */}
              <motion.div
                className="absolute h-52 w-52 rounded-2xl border-4 border-dashed border-border/70 bg-card/20 backdrop-blur-sm"
                style={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute h-64 w-64 rounded-2xl border-2 border-primary/20 bg-primary/5 backdrop-blur-sm"
                style={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />

              {/* bubbles */}
              {[
                {
                  cls: "top-[18%] left-[22%] h-14 w-14 bg-primary/60 rounded-full",
                  amp: 20,
                  delay: 0,
                },
                {
                  cls: "bottom-[18%] right-[22%] h-14 w-14 bg-primary/60 rounded-full",
                  amp: 16,
                  delay: 0.8,
                },
                {
                  cls: "top-[12%] right-[18%] h-9 w-9 bg-primary/40 rounded-full",
                  amp: 24,
                  delay: 1.2,
                },
                {
                  cls: "bottom-[12%] left-[18%] h-9 w-9 bg-primary/40 rounded-full",
                  amp: 22,
                  delay: 0.4,
                },
                {
                  cls: "top-[4%] left-[8%] h-6 w-6 bg-primary/30 rounded-full",
                  amp: 14,
                  delay: 1.8,
                },
                {
                  cls: "bottom-[4%] right-[8%] h-6 w-6 bg-primary/30 rounded-full",
                  amp: 12,
                  delay: 0.6,
                },
                {
                  cls: "top-[33%] right-[4%] h-16 w-16 rounded-lg border-2 border-border/50 bg-card/20 backdrop-blur-sm",
                  amp: 14,
                  delay: 0.9,
                },
                {
                  cls: "bottom-[33%] left-[4%] h-16 w-16 rounded-lg border-2 border-border/50 bg-card/20 backdrop-blur-sm",
                  amp: 14,
                  delay: 0.3,
                },
              ].map((b, i) => (
                <motion.div
                  key={i}
                  className={`absolute backdrop-blur-sm ${b.cls}`}
                  animate={{
                    y: [0, -b.amp, 0],
                    rotate: [0, i % 2 === 0 ? 12 : -12, 0],
                  }}
                  transition={{
                    duration: 3.5 + i * 0.35,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: b.delay,
                  }}
                />
              ))}

              {/* SVG Drawing */}
              <svg
                className="absolute h-full w-[150%] max-w-[1400px] top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                fill="none"
                viewBox="0 0 1050 500"
                xmlns="http://www.w3.org/2000/svg"
              >
                <AnimatedPath
                  d="M262.1 138.6C264.5 101.9 298.3 74 335 76.4C371.7 78.8 399.5 112.6 397.1 149.3C394.7 186 360.9 218 324.2 215.6C287.5 213.2 259.7 175.3 262.1 138.6Z"
                  className="stroke-primary/30"
                  strokeWidth="2"
                  delay={0.2}
                />
                <AnimatedPath
                  d="M683.1 307.6C685.5 270.9 719.3 243 756 245.4C792.7 247.8 820.5 281.6 818.1 318.3C815.7 355 781.9 387 745.2 384.6C708.5 382.2 680.7 344.3 683.1 307.6Z"
                  className="stroke-primary/30"
                  strokeWidth="2"
                  delay={0.5}
                />
                <AnimatedPath
                  d="M899 250C899 341.127 824.127 416 733 416C641.873 416 567 341.127 567 250C567 158.873 641.873 84 733 84C824.127 84 899 158.873 899 250Z"
                  className="stroke-primary/15"
                  strokeWidth="1"
                  delay={0.8}
                />
                <AnimatedPath
                  d="M316 250C316 128.583 218.417 31 97 31C-24.4175 31 -122 128.583 -122 250C-122 371.417 -24.4175 469 97 469C218.417 469 316 371.417 316 250Z"
                  className="stroke-primary/15"
                  strokeWidth="1"
                  delay={1.0}
                />
                <AnimatedPath
                  d="M1021.5 87C1095.84 87 1156 147.157 1156 221.5C1156 295.843 1095.84 356 1021.5 356C947.157 356 887 295.843 887 221.5C887 147.157 947.157 87 1021.5 87Z"
                  className="stroke-primary/20"
                  strokeWidth="1"
                  delay={1.2}
                />
                <motion.line
                  className="stroke-border/30"
                  strokeDasharray="2 4"
                  strokeWidth="1"
                  x1="0"
                  x2="1050"
                  y1="100"
                  y2="100"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 1.4 }}
                />
                <motion.line
                  className="stroke-border/30"
                  strokeDasharray="2 4"
                  strokeWidth="1"
                  x1="0"
                  x2="1050"
                  y1="400"
                  y2="400"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 1.6 }}
                />
                <motion.circle
                  className="stroke-primary/15"
                  cx="150"
                  cy="350"
                  r="40"
                  strokeWidth="2"
                  fill="none"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 1.8,
                    originX: "150px",
                    originY: "350px",
                  }}
                />
                <motion.circle
                  className="fill-primary/25"
                  cx="950"
                  cy="150"
                  r="15"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 2 }}
                />
              </svg>
            </motion.div>
          </div>

          {/* text */}
          <div className="container relative mx-auto max-w-7xl px-4 z-20 pointer-events-none py-6 md:py-10">
            <motion.div
              className="flex flex-col items-center text-center w-full"
              initial="hidden"
              animate="visible"
            >
              {/* Title & Subtitle */}
              <div className="flex flex-col gap-4 items-center w-full mb-4">
                <div style={{ perspective: 1200 }}>
                  <motion.div
                    className="flex flex-wrap justify-center gap-x-4 text-5xl font-black leading-tight tracking-tighter text-text md:text-7xl drop-shadow-lg"
                    variants={WORD_CONTAINER}
                  >
                    {["Your", "Campus,"].map((w) => (
                      <motion.span
                        key={w}
                        variants={WORD}
                        style={{ display: "inline-block" }}
                      >
                        {w}
                      </motion.span>
                    ))}

                    <motion.span
                      variants={WORD}
                      style={{ display: "inline-block" }}
                      className="text-primary"
                    >
                      <motion.span
                        style={{ display: "inline-block" }}
                        animate={{
                          textShadow: [
                            "0 0 0px hsl(var(--primary)/0)",
                            "0 0 30px hsl(var(--primary)/0.6)",
                            "0 0 0px hsl(var(--primary)/0)",
                          ],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1,
                        }}
                      >
                        Connected.
                      </motion.span>
                    </motion.span>
                  </motion.div>
                </div>

                <motion.p
                  className="mx-auto max-w-xl text-lg font-normal text-text/60 md:text-xl mt-4 backdrop-blur-sm bg-background/30 p-2 rounded-xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  KlubNet centralizes club activities, events, and student life
                  into one seamless digital hub.
                </motion.p>
              </div>

              <div
                className="h-[350px] md:h-[400px] w-full flex-shrink-0"
                aria-hidden="true"
              ></div>

              {/*Button & Stats */}
              <div className="flex flex-col items-center w-full pointer-events-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }} // NO MORE MAGNETIC, JUST PURE HOVER
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                    delay: 0.9,
                  }}
                  className="inline-block relative z-[100]"
                >
                  <Link
                    to="/register"
                    className="group relative flex h-14 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary px-8 text-lg font-bold text-primary-foreground shadow-xl shadow-primary/40 transition-colors duration-300 hover:shadow-2xl hover:shadow-primary/60"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 ease-in-out group-hover:translate-x-full" />
                    <span className="relative truncate">
                      Find Your Community
                    </span>
                    <span className="material-symbols-outlined ml-2 relative transition-transform duration-300 group-hover:translate-x-1.5">
                      east
                    </span>
                  </Link>
                </motion.div>

                {/* Animated stats */}
                <motion.div
                  className="flex gap-8 mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  {[
                    { label: "Clubs", value: 120, suffix: "+" },
                    { label: "Students", value: 8000, suffix: "+" },
                    { label: "Events/mo", value: 50, suffix: "+" },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col items-center">
                      <span className="text-2xl font-black text-primary drop-shadow-sm">
                        <Counter to={s.value} suffix={s.suffix} />
                      </span>
                      <span className="text-xs text-text/50 uppercase tracking-widest font-bold mt-1">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="w-full bg-background py-16 md:py-24 overflow-hidden">
          <div className="container mx-auto max-w-7xl px-4">
            <div
              ref={howRef}
              className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20"
            >
              <motion.div
                className="relative order-2 lg:order-1"
                variants={slideLeft}
                initial="hidden"
                animate={howInView ? "visible" : "hidden"}
              >
                <motion.div
                  className="absolute -inset-4 rounded-xl bg-primary/15 blur-2xl"
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <TiltCard className="relative aspect-[4/3] w-full rounded-xl overflow-hidden shadow-2xl shadow-primary/20 max-w-lg mx-auto lg:max-w-none">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAR50BymB03tb64X2idxn1SodyiYsq6TnZuZNzr8Ny2WUEPRkRWpXgB_qum2X7UZDhzzhWdYPgYxsrXQDgKYPZHk4p_LMccEApqHaxwy4KZ_GmpNPaxFhJ4eh1oBIHmY62uOmAVigjoAM65K_WDbFijX8Pn1rXHYu03npwnq9ZYOFtImfG-ULS_84qErU4fXAwvgekjaNZEm4zw-gwdPumfRgMIpVNGfvzTQV_1KSdstJbCRT_DItzNB5q925KFKu-EQnm4iZ6R6o"
                    alt="Illustration of students interacting"
                    className="w-full h-full object-cover"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut",
                    }}
                  />
                </TiltCard>
              </motion.div>

              <motion.div
                className="order-1 flex flex-col gap-6 lg:order-2"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.15 } },
                }}
                initial="hidden"
                animate={howInView ? "visible" : "hidden"}
              >
                <motion.h2
                  className="text-3xl font-bold tracking-tight md:text-4xl text-text"
                  variants={slideRight}
                >
                  How KlubNet Works
                </motion.h2>
                <motion.p
                  className="max-w-md text-lg text-text/60"
                  variants={slideRight}
                >
                  Getting started is simple. Follow these three easy steps to
                  unlock your campus community.
                </motion.p>
                <div className="flex flex-col gap-6 border-l-2 border-primary/20 pl-6">
                  {[
                    {
                      step: "1",
                      title: "Create Your Profile",
                      desc: "Sign up in minutes and tell us about your interests.",
                    },
                    {
                      step: "2",
                      title: "Explore & Join",
                      desc: "Browse clubs, check out events, and join communities.",
                    },
                    {
                      step: "3",
                      title: "Get Involved",
                      desc: "Participate in discussions and attend events.",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.step}
                      className="flex items-start gap-4"
                      variants={slideRight}
                      custom={i}
                      whileHover={{ x: 8 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <motion.div
                        className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground"
                        whileHover={{ scale: 1.3, rotate: 12 }}
                        animate={{
                          boxShadow: [
                            "0 0 0px hsl(var(--primary)/0)",
                            "0 0 20px hsl(var(--primary)/0.6)",
                            "0 0 0px hsl(var(--primary)/0)",
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.7,
                          ease: "easeInOut",
                        }}
                      >
                        {item.step}
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-bold text-text">
                          {item.title}
                        </h3>
                        <p className="text-base text-text/60">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full bg-primary/5 py-16 md:py-24 overflow-hidden"
        >
          <div className="container mx-auto max-w-7xl px-4">
            <div ref={featRef} className="flex flex-col gap-12">
              <motion.div
                className="flex flex-col gap-4 text-center"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.12 } },
                }}
                initial="hidden"
                animate={featInView ? "visible" : "hidden"}
              >
                <motion.h1
                  className="text-3xl font-bold tracking-tight md:text-4xl text-text"
                  variants={fadeUp}
                  custom={0}
                >
                  Everything You Need
                </motion.h1>
                <motion.p
                  className="mx-auto max-w-2xl text-lg text-text/60"
                  variants={fadeUp}
                  custom={1}
                >
                  Discover the tools to enhance your university experience, all
                  in one place.
                </motion.p>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 gap-6 md:grid-cols-3 md:grid-rows-2"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.13 } },
                }}
                initial="hidden"
                animate={featInView ? "visible" : "hidden"}
              >
                <motion.div
                  variants={popIn}
                  custom={0}
                  className="md:col-span-2"
                >
                  <FeatureCard
                    title="Club Directory"
                    desc="Find your niche from a complete list of campus clubs."
                    icon="search"
                    bigIcon="search"
                    className="h-full"
                    bigIconClass="-bottom-6 -right-6 text-9xl"
                  />
                </motion.div>
                <motion.div
                  variants={popIn}
                  custom={1}
                  className="md:row-span-2"
                >
                  <FeatureCard
                    title="Event Calendar"
                    desc="Never miss an event with a centralized campus calendar."
                    icon="calendar_month"
                    bigIcon="calendar_month"
                    className="h-full"
                    bigIconClass="-bottom-8 -right-8 text-[12rem]"
                  />
                </motion.div>
                <motion.div variants={popIn} custom={2}>
                  <FeatureCard
                    title="1-Click RSVP"
                    desc="Join events instantly."
                    icon="check_circle"
                    bigIcon="check_circle"
                    bigIconClass="-bottom-6 -right-6 text-9xl"
                  />
                </motion.div>
                <motion.div variants={popIn} custom={3}>
                  <FeatureCard
                    title="Admin Dashboard"
                    desc="Manage your club."
                    icon="dashboard"
                    bigIcon="dashboard"
                    bigIconClass="-bottom-6 -right-6 text-9xl"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 overflow-hidden">
          <div className="container mx-auto max-w-7xl px-4">
            <motion.div
              ref={connRef}
              className="grid grid-cols-1 overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-primary/5 lg:grid-cols-2"
              initial={{ opacity: 0, y: 60 }}
              animate={connInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col justify-center gap-8 p-12">
                <motion.h2
                  className="text-3xl font-bold tracking-tight md:text-4xl text-text"
                  initial={{ opacity: 0, x: -40 }}
                  animate={connInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Your Campus, Connected.
                </motion.h2>
                <div className="flex flex-col gap-6">
                  {[
                    {
                      icon: "groups_2",
                      title: "Forge new connections",
                      desc: "Meet like-minded peers, discover new communities.",
                    },
                    {
                      icon: "lock_open",
                      title: "Unlock campus opportunities",
                      desc: "Find exclusive events, workshops, and leadership roles.",
                    },
                    {
                      icon: "auto_awesome",
                      title: "Enhance your college experience",
                      desc: "Go beyond academics. Create memories.",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-4 cursor-default"
                      initial={{ opacity: 0, x: -30 }}
                      animate={connInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.55, delay: 0.3 + i * 0.12 }}
                      whileHover={{ x: 10 }}
                    >
                      <motion.div
                        className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                        whileHover={{
                          scale: 1.35,
                          rotate: 20,
                          backgroundColor: "hsl(var(--primary))",
                          color: "hsl(var(--primary-foreground))",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 14,
                        }}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {item.icon}
                        </span>
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-bold text-text">
                          {item.title}
                        </h3>
                        <p className="text-text/60">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-text/5 dark:bg-transparent flex items-center justify-center overflow-hidden relative">
                <ParticleField count={14} />
                <motion.div
                  className="min-h-[400px] relative flex items-center justify-center p-8 w-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={connInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    duration: 0.7,
                    delay: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <motion.img
                    src="https://illustrations.popsy.co/purple/creative-work.svg"
                    alt="Students working together"
                    className="w-full max-w-[450px] md:max-w-[350px] h-auto object-contain drop-shadow-xl bg-slate-400 rounded-lg"
                    animate={{ y: [0, -20, 0], rotate: [0, 1.5, -1.5, 0] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 h-8 w-36 rounded-full bg-primary/20 blur-xl"
                    animate={{ scaleX: [1, 0.65, 1], opacity: [0.4, 0.9, 0.4] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="w-full py-8 md:py-12 mb-10">
          <div className="container mx-auto max-w-7xl px-4">
            <motion.div
              ref={ctaRef}
              className="relative overflow-hidden rounded-xl bg-primary p-10 text-center text-primary-foreground md:p-20 shadow-2xl shadow-primary/20"
              initial={{ opacity: 0, scale: 0.88, y: 50 }}
              animate={ctaInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Animated blobs */}
              {[
                {
                  cls: "absolute -top-1/2 -left-1/4 size-[500px] rounded-full bg-white/10",
                  dur: 6,
                  delay: 0,
                },
                {
                  cls: "absolute -bottom-1/2 -right-1/4 size-[500px] rounded-full bg-white/10",
                  dur: 7,
                  delay: 1.5,
                },
                {
                  cls: "absolute top-1/4 right-1/3 size-[200px] rounded-full bg-white/5",
                  dur: 5,
                  delay: 0.8,
                },
              ].map((b, i) => (
                <motion.div
                  key={i}
                  className={b.cls}
                  animate={{
                    scale: [1, 1.25, 1],
                    x: [0, 24, 0],
                    y: [0, -18, 0],
                  }}
                  transition={{
                    duration: b.dur,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: b.delay,
                  }}
                />
              ))}

              {/* Moving grid overlay */}
              <motion.div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, white 1px, transparent 1px), linear-gradient(0deg, white 1px, transparent 1px)",
                  backgroundSize: "60px 60px",
                }}
                animate={{ backgroundPosition: ["0px 0px", "60px 60px"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />

              <div className="relative z-10 flex flex-col items-center justify-center gap-8">
                <motion.div
                  className="flex flex-col gap-4"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.14 } },
                  }}
                  initial="hidden"
                  animate={ctaInView ? "visible" : "hidden"}
                >
                  <motion.h1
                    className="text-3xl font-bold tracking-tight md:text-5xl"
                    variants={fadeUp}
                    custom={0}
                  >
                    Ready to Join the Hub?
                  </motion.h1>
                  <motion.p
                    className="mx-auto max-w-2xl text-primary-foreground/80"
                    variants={fadeUp}
                    custom={1}
                  >
                    Sign up now and become a part of your campus's digital
                    community.
                  </motion.p>
                </motion.div>

                <motion.div
                  variants={popIn}
                  initial="hidden"
                  animate={ctaInView ? "visible" : "hidden"}
                  custom={2}
                  className="pointer-events-auto"
                >
                  <Link
                    to="/register"
                    className="group relative flex h-14 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-background dark:bg-background/80 px-8 text-lg font-bold text-primary shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-primary/100 transition-transform duration-500 ease-in-out group-hover:translate-x-full" />
                    <span className="relative truncate">Sign Up for Free</span>
                    <span className="material-symbols-outlined ml-2 relative transition-transform duration-300 group-hover:translate-x-1.5">
                      arrow_forward
                    </span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <motion.footer
        className="w-full border-t border-border bg-background py-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto flex max-w-7xl items-center justify-center px-4">
          <p className="text-sm text-text/60">
            © {new Date().getFullYear()} KlubNet. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE CARD — 3D tilt + hover effects
───────────────────────────────────────────── */
function FeatureCard({
  title,
  desc,
  icon,
  bigIcon,
  className = "",
  bigIconClass = "",
}) {
  return (
    <TiltCard className="h-full">
      <motion.div
        className={`group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-6 h-full ${className}`}
        whileHover={{
          borderColor: "hsl(var(--primary)/0.5)",
          boxShadow: "0 25px 50px hsl(var(--primary)/0.18)",
        }}
        transition={{ duration: 0.25 }}
      >
        {/* hover glow sweep */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        />
        <div className="relative flex flex-col gap-2 z-10">
          <motion.div
            className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary"
            whileHover={{
              scale: 1.25,
              backgroundColor: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
              rotate: 12,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 14 }}
          >
            <span className="material-symbols-outlined text-3xl">{icon}</span>
          </motion.div>
          <h2 className="text-xl font-bold text-text">{title}</h2>
          <p className="text-base text-text/60">{desc}</p>
        </div>
        <motion.span
          className={`material-symbols-outlined absolute text-primary/5 ${bigIconClass}`}
          whileHover={{ scale: 1.18, color: "hsl(var(--primary)/0.12)" }}
          transition={{ duration: 0.3 }}
        >
          {bigIcon}
        </motion.span>
      </motion.div>
    </TiltCard>
  );
}

export default Home;
