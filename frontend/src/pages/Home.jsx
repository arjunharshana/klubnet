import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-text font-display selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/30">
              <svg
                className="size-6"
                fill="currentColor"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-text">
              KlubNet
            </h2>
          </div>
          {/*Navbar*/}
          <nav className="hidden items-center gap-1 rounded-full border border-border bg-card/50 p-1 md:flex">
            <a
              className="rounded-full px-4 py-2 text-sm font-medium text-text transition-colors hover:text-primary"
              href="#"
            >
              Home
            </a>
            <a
              className="rounded-full px-4 py-2 text-sm font-medium text-text/60 transition-colors hover:text-primary"
              href="#features"
            >
              Features
            </a>
            <a
              className="rounded-full px-4 py-2 text-sm font-medium text-text/60 transition-colors hover:text-primary"
              href="#about"
            >
              About
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="flex h-11 items-center justify-center rounded-full px-5 text-base font-bold text-primary transition-colors hover:bg-primary/10"
            >
              <span>Login</span>
            </Link>
            <Link
              to="/register"
              className="group relative flex h-11 items-center justify-center rounded-full bg-primary px-5 text-base font-bold text-primary-foreground shadow-lg shadow-primary/40 transition-transform duration-300 hover:scale-105"
            >
              <span>Sign Up</span>
              <span className="material-symbols-outlined ml-2 transition-transform duration-300 group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Main section */}
        <section className="relative w-full overflow-hidden pt-10 pb-32 md:pt-16 md:pb-40">
          {}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,hsl(var(--primary)/0.2),transparent_40%)]"></div>

          <div className="container relative mx-auto max-w-7xl px-4">
            <div className="flex flex-col items-center gap-12 text-center">
              <div className="flex flex-col items-center gap-8">
                <div className="flex flex-col gap-4">
                  <h1 className="text-5xl font-black leading-tight tracking-tighter text-text md:text-7xl">
                    Your Campus,{" "}
                    <span className="text-primary">Connected.</span>
                  </h1>
                  <p className="mx-auto max-w-xl text-lg font-normal text-text/60 md:text-xl">
                    KlubNet centralizes club activities, events, and student
                    life into one seamless digital hub.
                  </p>
                </div>
                <Link
                  to="/register"
                  className="group relative flex h-14 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary px-8 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-300 hover:scale-105"
                >
                  <span className="truncate">Find Your Community</span>
                  <span className="material-symbols-outlined ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    east
                  </span>
                </Link>
              </div>

              {/* Illustration */}
              <div className="relative mt-8 h-[450px] w-full items-center justify-center lg:h-[500px]">
                <div className="absolute inset-x-0 top-1/2 h-full w-full -translate-y-1/2">
                  <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"></div>
                </div>
                <div className="relative flex h-full w-full items-center justify-center overflow-visible">
                  {}
                  <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 scale-110 rounded-full border-2 border-dashed border-border/50"></div>
                  <div className="absolute top-1/2 left-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/50"></div>
                  <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/30"></div>
                  <div className="absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-lg shadow-primary/40"></div>

                  {/* Floating Bubbles */}
                  <div className="absolute top-[20%] left-[25%] h-12 w-12 rounded-full bg-primary/70 backdrop-blur-sm"></div>
                  <div className="absolute bottom-[20%] right-[25%] h-12 w-12 rounded-full bg-primary/70 backdrop-blur-sm"></div>
                  <div className="absolute top-[15%] right-[20%] h-8 w-8 rounded-full bg-primary/50"></div>
                  <div className="absolute bottom-[15%] left-[20%] h-8 w-8 rounded-full bg-primary/50"></div>
                  <div className="absolute h-48 w-48 rotate-45 rounded-2xl border-4 border-dashed border-border/80 bg-card/30 backdrop-blur-sm"></div>
                  <div className="absolute h-60 w-60 -rotate-12 rounded-2xl border-2 border-border/60 bg-card/10 backdrop-blur-sm"></div>
                  <div className="absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-background"></div>
                  <div className="absolute top-[5%] left-[10%] h-6 w-6 rounded-full bg-primary/40"></div>
                  <div className="absolute bottom-[5%] right-[10%] h-6 w-6 rounded-full bg-primary/40"></div>
                  <div className="absolute top-[35%] right-[5%] h-16 w-16 rotate-12 rounded-lg border-2 border-border/50 bg-card/20 backdrop-blur-sm"></div>
                  <div className="absolute bottom-[35%] left-[5%] h-16 w-16 -rotate-12 rounded-lg border-2 border-border/50 bg-card/20 backdrop-blur-sm"></div>

                  {}
                  <svg
                    className="absolute h-full w-[150%] max-w-[1400px]"
                    fill="none"
                    viewBox="0 0 1050 500"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className="stroke-primary/20"
                      d="M262.1 138.6C264.5 101.9 298.3 74 335 76.4C371.7 78.8 399.5 112.6 397.1 149.3C394.7 186 360.9 218 324.2 215.6C287.5 213.2 259.7 175.3 262.1 138.6Z"
                      strokeWidth="2"
                    ></path>
                    <path
                      className="stroke-primary/20"
                      d="M683.1 307.6C685.5 270.9 719.3 243 756 245.4C792.7 247.8 820.5 281.6 818.1 318.3C815.7 355 781.9 387 745.2 384.6C708.5 382.2 680.7 344.3 683.1 307.6Z"
                      strokeWidth="2"
                    ></path>
                    <path
                      className="stroke-primary/10"
                      d="M899 250C899 341.127 824.127 416 733 416C641.873 416 567 341.127 567 250C567 158.873 641.873 84 733 84C824.127 84 899 158.873 899 250Z"
                      strokeDasharray="8 8"
                      strokeWidth="1"
                    ></path>
                    <path
                      className="stroke-primary/10"
                      d="M316 250C316 128.583 218.417 31 97 31C-24.4175 31 -122 128.583 -122 250C-122 371.417 -24.4175 469 97 469C218.417 469 316 371.417 316 250Z"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    ></path>
                    <path
                      className="stroke-primary/15"
                      d="M1021.5 87C1095.84 87 1156 147.157 1156 221.5C1156 295.843 1095.84 356 1021.5 356C947.157 356 887 295.843 887 221.5C887 147.157 947.157 87 1021.5 87Z"
                      strokeWidth="1"
                    ></path>
                    <line
                      className="stroke-border/40"
                      strokeDasharray="2 4"
                      strokeWidth="1"
                      x1="0"
                      x2="1050"
                      y1="100"
                      y2="100"
                    ></line>
                    <line
                      className="stroke-border/40"
                      strokeDasharray="2 4"
                      strokeWidth="1"
                      x1="0"
                      x2="1050"
                      y1="400"
                      y2="400"
                    ></line>
                    <circle
                      className="stroke-primary/10"
                      cx="150"
                      cy="350"
                      r="40"
                      strokeWidth="2"
                    ></circle>
                    <circle
                      className="fill-primary/20"
                      cx="950"
                      cy="150"
                      r="15"
                    ></circle>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How klubnet works section*/}
        <section className="w-full bg-background py-16 md:py-24">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div className="relative order-2 lg:order-1">
                <div className="absolute -inset-4 rounded-xl bg-primary/10 blur-2xl"></div>
                {}
                <div className="relative aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-card to-secondary/10 border border-border flex items-center justify-center shadow-2xl shadow-primary/10 max-w-lg mx-auto lg:max-w-none">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAR50BymB03tb64X2idxn1SodyiYsq6TnZuZNzr8Ny2WUEPRkRWpXgB_qum2X7UZDhzzhWdYPgYxsrXQDgKYPZHk4p_LMccEApqHaxwy4KZ_GmpNPaxFhJ4eh1oBIHmY62uOmAVigjoAM65K_WDbFijX8Pn1rXHYu03npwnq9ZYOFtImfG-ULS_84qErU4fXAwvgekjaNZEm4zw-gwdPumfRgMIpVNGfvzTQV_1KSdstJbCRT_DItzNB5q925KFKu-EQnm4iZ6R6o"
                    alt="Illustration of students interacting"
                    className="relative aspect-[4/3] w-full rounded-xl object-cover shadow-2xl shadow-primary/10"
                  />
                </div>
              </div>
              <div className="order-1 flex flex-col gap-6 lg:order-2">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-text">
                  How KlubNet Works
                </h2>
                <p className="max-w-md text-lg text-text/60">
                  Getting started is simple. Follow these three easy steps to
                  unlock your campus community.
                </p>
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
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-text">
                          {item.title}
                        </h3>
                        <p className="text-base text-text/60">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full bg-primary/5 py-16 md:py-24">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-4 text-center">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-text">
                  Everything You Need
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-text/60">
                  Discover the tools to enhance your university experience, all
                  in one place.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:grid-rows-2">
                <FeatureCard
                  title="Club Directory"
                  desc="Find your niche from a complete list of campus clubs."
                  icon="search"
                  bigIcon="search"
                  className="md:col-span-2"
                  bigIconClass="-bottom-6 -right-6 text-9xl"
                />
                <FeatureCard
                  title="Event Calendar"
                  desc="Never miss an event with a centralized campus calendar."
                  icon="calendar_month"
                  bigIcon="calendar_month"
                  className="md:row-span-2"
                  bigIconClass="-bottom-8 -right-8 text-[12rem]"
                />
                <FeatureCard
                  title="1-Click RSVP"
                  desc="Join events instantly."
                  icon="check_circle"
                  bigIcon="check_circle"
                  bigIconClass="-bottom-6 -right-6 text-9xl"
                />
                <FeatureCard
                  title="Admin Dashboard"
                  desc="Manage your club."
                  icon="dashboard"
                  bigIcon="dashboard"
                  bigIconClass="-bottom-6 -right-6 text-9xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Your Campus Connected Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-primary/5 lg:grid-cols-2">
              <div className="flex flex-col justify-center gap-8 p-12">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-text">
                  Your Campus, Connected.
                </h2>
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
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-xl">
                          {item.icon}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-text">
                          {item.title}
                        </h3>
                        <p className="text-text/60">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-text/5 ">
                {}
                <div className="flex items-center justify-center">
                  <div className="min-h-[400px] bg-primary/5 relative flex items-center justify-center p-8 max-w-[600px] md:max-w-[500px] lg:max-w-[700px] mx-auto w-full">
                    <img
                      src="https://illustrations.popsy.co/purple/creative-work.svg"
                      alt="Students working together"
                      className="w-full max-w-[450px] md:max-w-[350px] h-auto object-contain drop-shadow-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ready to Join Section */}
        <section className="w-full py-8 md:py-12">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="relative overflow-hidden rounded-xl bg-primary p-10 text-center text-primary-foreground md:p-20 shadow-2xl shadow-primary/20">
              <div className="absolute -top-1/2 -left-1/4 size-[500px] rounded-full bg-white/10"></div>
              <div className="absolute -bottom-1/2 -right-1/4 size-[500px] rounded-full bg-white/10"></div>
              <div className="relative z-10 flex flex-col items-center justify-center gap-8">
                <div className="flex flex-col gap-4">
                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Ready to Join the Hub?
                  </h1>
                  <p className="mx-auto max-w-2xl text-primary-foreground/80">
                    Sign up now and become a part of your campus's digital
                    community.
                  </p>
                </div>
                <Link
                  to="/register"
                  className="group flex h-14 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-background px-8 text-lg font-bold text-primary shadow-lg transition-transform duration-300 hover:scale-105"
                >
                  <span className="truncate">Sign Up for Free</span>
                  <span className="material-symbols-outlined ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {}
      <footer className="w-full border-t border-border bg-background py-8">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row">
          <p className="text-sm text-text/60">
            © 2025 KlubNet. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              className="text-sm text-text/60 transition-colors hover:text-primary"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-sm text-text/60 transition-colors hover:text-primary"
              href="#"
            >
              Terms of Service
            </a>
          </div>
          <div className="flex items-center gap-4 text-text/60">
            <span>Social Icons</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  desc,
  icon,
  bigIcon,
  className = "",
  bigIconClass = "",
}) {
  return (
    <div
      className={`group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/50 ${className}`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <h2 className="text-xl font-bold text-text">{title}</h2>
        <p className="text-base text-text/60">{desc}</p>
      </div>
      <span
        className={`material-symbols-outlined absolute text-primary/5 transition-transform duration-300 group-hover:scale-110 ${bigIconClass}`}
      >
        {bigIcon}
      </span>
    </div>
  );
}

export default Home;
