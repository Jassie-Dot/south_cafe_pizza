"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";

function SiteFooter({ onAboutClick }) {
  function handleFooterLink(event, link) {
    if (link.href !== "#about") {
      return;
    }

    event.preventDefault();
    onAboutClick?.();
  }

  return (
    <footer className="bg-charcoal pb-32 pt-12 text-white md:pb-12">
      <div className="section-shell grid gap-8 lg:grid-cols-[1fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-4">
            <img
              src="/south-pizza-logo-small.png"
              alt="South Pizza logo"
              className="h-20 w-20 rounded-full object-cover"
            />
            <div>
              <p className="font-display text-2xl font-bold">South Pizza</p>
              <p className="text-sm font-bold uppercase text-sand">Stone baked pizza</p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-lg leading-relaxed text-white/75">
            Warm pizza, simple ordering, and a relaxed Port Elgin cafe experience.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold">Quick Links</h3>
          <div className="mt-4 grid gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => handleFooterLink(event, link)}
                className="text-lg text-white/75 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold">Contact</h3>
          <div className="mt-4 grid gap-2 text-lg text-white/75">
            <a href={contact.phoneHref} className="hover:text-white">{contact.phoneDisplay}</a>
            <a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a>
            <a href={contact.directionsUrl} target="_blank" rel="noreferrer" className="hover:text-white">
              Get Directions
            </a>
            <a href={contact.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-white">
              Instagram
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold">Hours</h3>
          <div className="mt-4 grid gap-2 text-lg text-white/75">
            {hours.map((row) => (
              <p key={row.day}>
                <span className="font-bold text-white">{row.day}:</span> {row.time}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="section-shell mt-10 border-t border-white/15 pt-6 text-base text-white/60">
        <p>Copyright 2026 South Pizza. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default SiteFooter;
