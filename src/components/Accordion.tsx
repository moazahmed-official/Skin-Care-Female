"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export interface AccordionItem {
  id: string;
  title: string;
  body: React.ReactNode;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="border-t border-ink/12">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id} className="border-b border-ink/12">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                aria-controls={`panel-${item.id}`}
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm transition-colors hover:text-copper"
              >
                <span>{item.title}</span>
                <span
                  aria-hidden="true"
                  className="relative grid h-4 w-4 shrink-0 place-items-center"
                >
                  <span className="absolute h-px w-3.5 bg-current" />
                  <span
                    className={`absolute h-3.5 w-px bg-current transition-transform duration-300 ${
                      isOpen ? "scale-y-0" : "scale-y-100"
                    }`}
                  />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`panel-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-5">{item.body}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
