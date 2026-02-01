"use client";

import { useState } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Testimonials", href: "#testimonials" },
  ];



  const testimonials = [
    {
      name: "Radhanath Swami Das",
      role: "Temple President, Mumbai",
      quote: "The IT Cell has transformed how we connect with devotees. Their digital solutions have helped us reach thousands more souls.",
    },
    {
      name: "Govinda Priya Devi Dasi",
      role: "Communications Head, Delhi",
      quote: "Professional, dedicated, and always available. They understand both technology and the mission of spreading Krishna consciousness.",
    },
    {
      name: "Madhava Pandit Das",
      role: "Temple Administrator, Bangalore",
      quote: "Our temple management has become so efficient with their systems. A true blessing for our seva.",
    },
  ];

  const stats = [
    { number: "50+", label: "Temples Served" },
    { number: "100K+", label: "Devotees Connected" },
    { number: "24/7", label: "Support Available" },
    { number: "15+", label: "Years Experience" },
  ];

  return (
    <div className="min-h-screen  bg-gradient-to-b from-[#fbd0b8] via-[#fcbfa0] to-[#f9aa80]">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border font-bold ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center" >
                <img src="/images/iskcon_logo.png"></img>
              </div>
              <div className="hidden sm:block">
                <p className="font-serif text-lg font-semibold text-foreground">ISKCON Sanjivini</p>
                <p className="text-xs text-muted-foreground tracking-wider">IT CELL</p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-25 ">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>


            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4  ">
              <a
                href="/login"
                className=" border border-primary px-4 py-2 text-sm font-semibold text-primary rounded-md hover:bg-primary/10 transition-colors"
              >
                Login
              </a>


            </div>


            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                ))}

              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center text-center
             bg-gradient-to-b from-[#fbd0b8] via-[#fcbfa0] to-[#f9aa80]
             overflow-hidden">




        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="flex flex-col items-center justify-center max-w-3xl mx-auto">

            {/* Text Content */}
            <div className="text-center lg:text-left">
              <p className="text-gray-900 text-sm md:text-base font-medium tracking-widest uppercase mb-4">
                Hare Krishna
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-black leading-tight mb-6">

                <span className="block">Empowering</span>
                <span className="block text-orange-600">Devotion</span>

                <span className="block">Through Technology</span>
              </h1>
              <p className="text-lg md:text-xl text-black max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">

                Serving ISKCON temples worldwide with innovative IT solutions to spread the message of Lord Krishna.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">


                <a
                  href="#about"
                  className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-black text-black text-base font-semibold rounded-md hover:bg-black/5 transition-colors"
                >
                  Learn More
                </a>

              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/20 justify-items-center">

                {stats.map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <p className="text-2xl md:text-3xl font-serif font-bold text-black">
                      {stat.number}
                    </p>
                    <p className="text-sm text-gray-700">
                      {stat.label}
                    </p>
                  </div>
                ))}

              </div>
            </div>

            {/* Temple Image */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-amber-400/20 rounded-3xl blur-2xl" />

              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white/50">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 rounded-3xl" />
                <img
                  src="/images/iskcon-temple.jpg"
                  alt="ISKCON Temple with Lord Krishna and Radha"
                  className="relative rounded-2xl shadow-lg w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">About Us</p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
                Technology in Service of the Divine
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                ISKCON Sanjivini IT Cell is dedicated to leveraging modern technology to support the mission of His Divine Grace A.C. Bhaktivedanta Swami Prabhupada - spreading Krishna consciousness worldwide.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Our team of dedicated devotee-technologists works tirelessly to provide world-class IT infrastructure, digital marketing, and technical support to ISKCON temples and projects across the globe.
              </p>

              {/* Quote */}
              <blockquote className="border-l-4 border-primary pl-6 py-4 bg-muted/50 rounded-r-lg">
                <p className="text-foreground italic font-serif text-lg mb-2">
                  "There is no difference between Krishna's form, qualities, name, and everything else."
                </p>
                <cite className="text-sm text-muted-foreground">- Srila Prabhupada</cite>
              </blockquote>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  "Dedicated Devotee Team",
                  "Global Temple Network",
                  "24/7 Technical Support",
                  "Secure Infrastructure"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 md:py-28
             bg-gradient-to-b from-[#fbd0b8] via-[#fcbfa0] to-[#f9aa80]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-black text-sm font-medium tracking-widest uppercase mb-4">Testimonials</p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6 text-balance">
              Words from Our Devotee Family
            </h2>
            <p className="text-lg text-gray-800">
              Hear what temple leaders and devotees say about our services.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-white border border-orange-300 rounded-xl p-6 md:p-8"

              >
                {/* Quote Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-10 h-10 text-orange-400 mb-4">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-900 text-base leading-relaxed mb-6 italic">

                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-black">{testimonial.name}</p>
                  <p className="text-sm text-gray-700">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-white text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-serif text-xl font-bold">IS</span>
                </div>
                <div>
                  <p className="font-serif text-lg font-semibold">ISKCON Sanjivini</p>
                  <p className="text-xs text-black tracking-wider">IT CELL</p>
                </div>
              </div>
              <p className="text-black text-sm leading-relaxed mb-6">
                Empowering devotional service through innovative technology solutions for ISKCON temples worldwide.
              </p>
              <p className="text-black font-serif italic">Hare Krishna Hare Krishna<br />Krishna Krishna Hare Hare</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-black mb-5">Quick Links</h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-black hover:text-black text-sm transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>



            {/* Contact */}
            <div>
              <h4 className="font-semibold text-black mb-5">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary flex-shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <span className="text-black text-sm">ISKCON Sanjivini Temple,<br />Vrindavan, India</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <a href="mailto:itcell@iskconsanjivini.org" className="text-black hover:text-black text-sm transition-colors">
                    itcell@iskconsanjivini.org
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  <a href="tel:+919876543210" className="text-black hover:text-black text-sm transition-colors">
                    +91 98765 43210
                  </a>
                </li>
              </ul>

              {/* Social Links */}
              <div className="flex gap-4 mt-6">
                <a href="https://www.facebook.com/ISKCONNVCC/" className="w-10 h-10 rounded-full bg-orange-300 flex items-center justify-center hover:bg-orange-400 transition-colors" aria-label="Facebook" target="_blank">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a href="https://www.instagram.com/iskconnvccpune/?hl=en" className="w-10 h-10 rounded-full bg-orange-300 flex items-center justify-center hover:bg-orange-400 transition-colors" aria-label="Instagram" target="_blank">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                </a>
                <a href="https://www.youtube.com/channel/UC4HsD5v-9ib6FBFoIX9vE_w" className="w-10 h-10 rounded-full bg-orange-300 flex items-center justify-center hover:bg-orange-400  transition-colors" aria-label="YouTube" target="_blank">
                  <svg className="w-5 h-5" fill="current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}