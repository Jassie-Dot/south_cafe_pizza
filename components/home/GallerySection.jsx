"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";

function GallerySection({ selectedImage, setSelectedImage }) {
  const reduceMotion = useReducedMotion();

  return (
    <SectionReveal id="gallery" className="bg-white py-20">
      <div className="section-shell">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="section-kicker">Gallery</p>
            <h2 className="section-title">Pizza, coffee, beach views, and warm cafe moments.</h2>
          </div>
          <ButtonLink href={contact.instagramUrl} external variant="outline">
            <Icon name="Instagram" />
            Instagram Gallery
          </ButtonLink>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryImages.map((image, index) => (
            <motion.button
              key={image.src}
              type="button"
              onClick={() => setSelectedImage(index)}
              whileHover={reduceMotion ? undefined : { y: -6 }}
              transition={{ duration: 0.35, ease: smoothEase }}
              className={`group overflow-hidden rounded-lg bg-surf text-left shadow-soft ${
                index === 1 || index === 4 ? "sm:row-span-2" : ""
              }`}
              aria-label={`Open gallery image: ${image.title}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className={`w-full object-cover transition duration-700 group-hover:scale-105 ${
                  index === 1 || index === 4 ? "h-full min-h-80" : "aspect-[4/3]"
                }`}
              />
              <span className="block bg-white px-5 py-5 text-[1.35rem] font-bold leading-tight text-charcoal sm:py-4 sm:text-xl">
                {image.title}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage !== null ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-charcoal/90 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Gallery image preview"
            onClick={() => setSelectedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-lg bg-white"
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.35, ease: smoothEase }}
            >
              <div className="flex items-center justify-between gap-4 border-b border-charcoal/10 p-4">
                <h3 className="text-[1.6rem] font-bold leading-tight text-charcoal sm:text-2xl">
                  {galleryImages[selectedImage].title}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="tap-target inline-flex items-center justify-center rounded-md border border-charcoal/20 text-charcoal"
                  aria-label="Close gallery image"
                >
                  <Icon name="X" className="h-7 w-7" />
                </button>
              </div>
              <img
                src={galleryImages[selectedImage].src}
                alt={galleryImages[selectedImage].alt}
                className="max-h-[76vh] w-full object-contain"
              />
              <div className="flex items-center justify-between gap-3 border-t border-charcoal/10 p-4">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImage(
                      (selectedImage - 1 + galleryImages.length) % galleryImages.length
                    )
                  }
                  className="tap-target inline-flex items-center justify-center rounded-md border border-charcoal/20 bg-white px-3 text-charcoal hover:bg-surf"
                  aria-label="Show previous gallery image"
                >
                  <Icon name="ChevronLeft" className="h-7 w-7" />
                </button>
                <p className="text-lg font-bold text-charcoal/60 sm:text-base">
                  {selectedImage + 1} of {galleryImages.length}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedImage((selectedImage + 1) % galleryImages.length)}
                  className="tap-target inline-flex items-center justify-center rounded-md border border-charcoal/20 bg-white px-3 text-charcoal hover:bg-surf"
                  aria-label="Show next gallery image"
                >
                  <Icon name="ChevronRight" className="h-7 w-7" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SectionReveal>
  );
}

export default GallerySection;
