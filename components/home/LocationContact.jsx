"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";

function LocationContact({ onOrderClick }) {
  const storeStatus = useStoreStatus();

  return (
    <SectionReveal id="visit" className="bg-white py-20">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="section-kicker">Location & Contact</p>
          <h2 className="section-title">Visit South Pizza in Port Elgin.</h2>
          <p className="section-copy">
            Find us at 1110 Goderich St Unit D2/3 with online ordering, phone ordering, and simple directions.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-lg border border-charcoal/10 bg-surf">
            <iframe
              title="Map to South Pizza in Port Elgin"
              src={contact.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[430px] w-full border-0"
              allowFullScreen
            />
          </div>

          <div className="grid gap-5">
            <div className="card p-6">
              <h3 className="text-[1.65rem] font-bold leading-tight text-charcoal sm:text-2xl">Contact</h3>
              <div className="mt-5 grid gap-4 text-xl sm:text-lg">
                <a href={contact.directionsUrl} target="_blank" rel="noreferrer" className="flex gap-3 rounded-md p-2 font-bold text-charcoal hover:bg-surf">
                  <Icon name="MapPin" className="mt-1 h-6 w-6 shrink-0 text-ocean" />
                  <span>{contact.address}</span>
                </a>
                <a href={contact.phoneHref} className="flex gap-3 rounded-md p-2 font-bold text-charcoal hover:bg-surf">
                  <Icon name="Phone" className="mt-1 h-6 w-6 shrink-0 text-ocean" />
                  <span>{contact.phoneDisplay}</span>
                </a>
                <a href={`mailto:${contact.email}`} className="flex gap-3 rounded-md p-2 font-bold text-charcoal hover:bg-surf">
                  <Icon name="Mail" className="mt-1 h-6 w-6 shrink-0 text-ocean" />
                  <span>{contact.email}</span>
                </a>
                <p className="flex gap-3 rounded-md p-2 font-bold text-charcoal">
                  <Icon name="Car" className="mt-1 h-6 w-6 shrink-0 text-ocean" />
                  <span>Convenient plaza parking near the restaurant.</span>
                </p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <ButtonLink href={contact.directionsUrl} external variant="dark" className="w-full">
                  <Icon name="MapPin" />
                  Directions
                </ButtonLink>
                <ButtonLink href={contact.phoneHref} variant="outline" className="w-full">
                  <Icon name="Phone" />
                  Call Now
                </ButtonLink>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3">
                <Icon name="Clock" className="h-7 w-7 text-ocean" />
                <h3 className="text-[1.65rem] font-bold leading-tight text-charcoal sm:text-2xl">Business Hours</h3>
              </div>
              {storeStatus ? (
                <div className="mt-5 rounded-md border border-charcoal/10 bg-ivory p-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-3 w-3 rounded-full ${
                        storeStatus.isOpen ? "bg-olive" : "bg-tomato"
                      }`}
                      aria-hidden="true"
                    />
                    <p className="text-[1.45rem] font-black leading-tight text-charcoal sm:text-xl">{storeStatus.label}</p>
                  </div>
                  <p className="mt-1 text-xl font-semibold text-charcoal/65 sm:text-lg">
                    {storeStatus.detail}
                  </p>
                </div>
              ) : null}
              <div className="mt-5 grid gap-3">
                {hours.map((row) => (
                  <div key={row.day} className="flex items-center justify-between gap-4 border-b border-charcoal/10 pb-3 last:border-b-0 last:pb-0">
                    <span className="font-bold text-charcoal">{row.day}</span>
                    <span className="text-right text-charcoal/75">{row.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <ReservationForm />
          <div className="rounded-lg bg-charcoal p-8 text-white">
            <p className="text-sm font-bold uppercase text-sand">Ordering</p>
            <h3 className="mt-3 font-display text-[2.45rem] font-bold leading-tight sm:text-4xl">
              Order online, call ahead, or stop in after the beach.
            </h3>
            <p className="mt-5 text-[1.3rem] leading-relaxed text-white/85 sm:text-xl">
              Use the online cart for pickup or delivery details, call ahead for a quick order, or choose DoorDash when you want South Pizza brought to you.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonAction onClick={onOrderClick}>
                <Icon name="ShoppingBag" />
                Start Order
              </ButtonAction>
              <ButtonLink href={contact.doorDashUrl} external variant="secondary">
                <Icon name="ExternalLink" />
                DoorDash
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}

export default LocationContact;
