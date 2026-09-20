"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCart, formatPrice } from "@/lib/cart";
import { Vessel } from "@/components/Vessel";
import { Field } from "@/components/Field";

type StepId = "contact" | "delivery" | "payment" | "done";

const order: StepId[] = ["contact", "delivery", "payment"];

const stepLabels: Record<StepId, string> = {
  contact: "Contact",
  delivery: "Delivery",
  payment: "Payment",
  done: "Confirmed",
};

interface FormState {
  email: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  postcode: string;
  card: string;
  expiry: string;
  cvc: string;
  nameOnCard: string;
}

const empty: FormState = {
  email: "",
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  postcode: "",
  card: "",
  expiry: "",
  cvc: "",
  nameOnCard: "",
};

type Errors = Partial<Record<keyof FormState, string>>;

function validate(step: StepId, form: FormState): Errors {
  const e: Errors = {};
  if (step === "contact") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      e.email = "We need a working email to send the batch record to.";
  }
  if (step === "delivery") {
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.address1.trim()) e.address1 = "Required";
    if (!form.city.trim()) e.city = "Required";
    // Loose UK postcode shape — enough to catch a typo, not to reject a valid one.
    if (!/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(form.postcode.trim()))
      e.postcode = "That does not look like a UK postcode.";
  }
  if (step === "payment") {
    const digits = form.card.replace(/\s+/g, "");
    if (!/^\d{16}$/.test(digits)) e.card = "Sixteen digits.";
    if (!/^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(form.expiry.trim()))
      e.expiry = "MM / YY";
    if (!/^\d{3,4}$/.test(form.cvc.trim())) e.cvc = "3 or 4 digits";
    if (!form.nameOnCard.trim()) e.nameOnCard = "Required";
  }
  return e;
}

export function CheckoutFlow() {
  const { resolved, subtotal, shipping, total, hydrated, clear } = useCart();
  const [step, setStep] = useState<StepId>("contact");
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Errors>({});

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));
  };

  const advance = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(step, form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const i = order.indexOf(step);
    if (i < order.length - 1) {
      setStep(order[i + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStep("done");
      clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ---- Confirmation ------------------------------------------------
  if (step === "done") {
    return (
      <div className="shell-narrow py-24 text-center md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <svg viewBox="0 0 140 90" className="mx-auto h-24 w-36 text-brine" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <path
                key={i}
                d={`M6 ${30 + i * 12} C 40 ${24 + i * 12}, 74 ${40 + i * 12}, 108 ${30 + i * 12} S 132 ${24 + i * 12}, 136 ${28 + i * 12}`}
                stroke="currentColor"
                strokeWidth="1.3"
                fill="none"
                opacity={0.8 - i * 0.13}
              />
            ))}
          </svg>
          <h1 className="display-lg mt-8">That is done.</h1>
          <p className="prose-body mx-auto mt-6 max-w-md">
            A confirmation is on its way to{" "}
            <span className="text-ink">{form.email || "your inbox"}</span>, with the
            batch numbers for everything in the order. Dispatch from Kirkwall within
            two working days.
          </p>
          <p className="prose-body mx-auto mt-4 max-w-md text-sm">
            This is a fictional storefront built as a design exercise — no payment
            was taken and nothing will arrive.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/routines"
              className="bg-ink px-8 py-4 text-sm text-salt transition-colors hover:bg-brine"
            >
              How to use what you bought
            </Link>
            <Link
              href="/shop"
              className="border border-ink px-8 py-4 text-sm transition-colors hover:bg-ink hover:text-salt"
            >
              Back to the shop
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (hydrated && resolved.length === 0) {
    return (
      <div className="shell-narrow py-24 text-center md:py-32">
        <h1 className="display-md">There is nothing to check out.</h1>
        <p className="prose-body mx-auto mt-5 max-w-sm">
          Your bag is empty. The routine finder is the quickest way to fill it
          sensibly.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/shop"
            className="bg-ink px-8 py-4 text-sm text-salt transition-colors hover:bg-brine"
          >
            Browse the catalogue
          </Link>
          <Link
            href="/routines"
            className="border border-ink px-8 py-4 text-sm transition-colors hover:bg-ink hover:text-salt"
          >
            Find my sequence
          </Link>
        </div>
      </div>
    );
  }

  const stepIndex = order.indexOf(step);

  return (
    <div className="shell py-12 md:py-16">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* ---- Form ----------------------------------------------- */}
        <div className="lg:col-span-7">
          {/* Progress — numbered, with completed steps clickable. */}
          <ol className="flex items-center gap-2 text-sm" aria-label="Checkout progress">
            {order.map((s, i) => {
              const done = i < stepIndex;
              const current = s === step;
              return (
                <li key={s} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true" className="h-px w-6 bg-ink/20" />}
                  <button
                    type="button"
                    disabled={!done}
                    onClick={() => done && setStep(s)}
                    aria-current={current ? "step" : undefined}
                    className={`flex items-center gap-2 transition-colors ${
                      current
                        ? "text-ink"
                        : done
                          ? "text-ink/55 hover:text-copper"
                          : "text-ink/30"
                    }`}
                  >
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[0.7rem] tabular-nums ${
                        current
                          ? "border-ink bg-ink text-salt"
                          : done
                            ? "border-brine text-brine"
                            : "border-ink/25"
                      }`}
                    >
                      {done ? "✓" : i + 1}
                    </span>
                    <span className="hidden sm:inline">{stepLabels[s]}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <form onSubmit={advance} noValidate className="mt-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
              >
                {step === "contact" && (
                  <fieldset>
                    <legend className="display-md">Where do we send the receipt?</legend>
                    <p className="prose-body mt-3 max-w-md">
                      One email per order, plus the batch record. We do not add you
                      to anything.
                    </p>
                    <div className="mt-8 max-w-md">
                      <Field
                        id="email"
                        label="Email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={set("email")}
                        error={errors.email}
                      />
                    </div>
                  </fieldset>
                )}

                {step === "delivery" && (
                  <fieldset>
                    <legend className="display-md">Where is it going?</legend>
                    <p className="prose-body mt-3 max-w-md">
                      Dispatched from Kirkwall. Two to four working days to UK
                      mainland addresses.
                    </p>
                    <div className="mt-8 grid max-w-xl gap-6 sm:grid-cols-2">
                      <Field
                        id="firstName"
                        label="First name"
                        autoComplete="given-name"
                        value={form.firstName}
                        onChange={set("firstName")}
                        error={errors.firstName}
                      />
                      <Field
                        id="lastName"
                        label="Last name"
                        autoComplete="family-name"
                        value={form.lastName}
                        onChange={set("lastName")}
                        error={errors.lastName}
                      />
                      <Field
                        id="address1"
                        label="Address"
                        autoComplete="address-line1"
                        className="sm:col-span-2"
                        value={form.address1}
                        onChange={set("address1")}
                        error={errors.address1}
                      />
                      <Field
                        id="address2"
                        label="Address line 2 (optional)"
                        autoComplete="address-line2"
                        className="sm:col-span-2"
                        value={form.address2}
                        onChange={set("address2")}
                      />
                      <Field
                        id="city"
                        label="Town or city"
                        autoComplete="address-level2"
                        value={form.city}
                        onChange={set("city")}
                        error={errors.city}
                      />
                      <Field
                        id="postcode"
                        label="Postcode"
                        autoComplete="postal-code"
                        placeholder="KW15 1AA"
                        value={form.postcode}
                        onChange={set("postcode")}
                        error={errors.postcode}
                      />
                    </div>
                  </fieldset>
                )}

                {step === "payment" && (
                  <fieldset>
                    <legend className="display-md">Payment</legend>
                    <p className="prose-body mt-3 max-w-md">
                      A demonstration form on a fictional storefront. Do not enter a
                      real card number — nothing here is processed or stored.
                    </p>
                    <div className="mt-8 grid max-w-xl gap-6 sm:grid-cols-2">
                      <Field
                        id="nameOnCard"
                        label="Name on card"
                        autoComplete="cc-name"
                        className="sm:col-span-2"
                        value={form.nameOnCard}
                        onChange={set("nameOnCard")}
                        error={errors.nameOnCard}
                      />
                      <Field
                        id="card"
                        label="Card number"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="4242 4242 4242 4242"
                        className="sm:col-span-2"
                        value={form.card}
                        onChange={set("card")}
                        error={errors.card}
                        hint="Use any sixteen digits."
                      />
                      <Field
                        id="expiry"
                        label="Expiry"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="04 / 29"
                        value={form.expiry}
                        onChange={set("expiry")}
                        error={errors.expiry}
                      />
                      <Field
                        id="cvc"
                        label="Security code"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="123"
                        value={form.cvc}
                        onChange={set("cvc")}
                        error={errors.cvc}
                      />
                    </div>
                  </fieldset>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex flex-wrap items-center gap-5 border-t border-ink/15 pt-7">
              <button
                type="submit"
                className="bg-ink px-9 py-4 text-sm text-salt transition-colors hover:bg-brine"
              >
                {step === "payment" ? `Pay ${formatPrice(total)}` : "Continue"}
              </button>
              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(order[stepIndex - 1])}
                  className="text-sm text-ink/55 underline underline-offset-4 hover:text-ink"
                >
                  Back
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ---- Order summary ---------------------------------------- */}
        <aside aria-labelledby="summary-heading" className="lg:col-span-4 lg:col-start-9">
          <div className="lg:sticky lg:top-28">
            <h2 id="summary-heading" className="eyebrow border-b border-ink/15 pb-4 text-ink/45">
              Your order
            </h2>
            <ul className="divide-y divide-ink/10">
              {resolved.map(({ product, qty, lineTotal }) => (
                <li key={product.slug} className="flex items-center gap-4 py-4">
                  <span className="relative grid h-16 w-14 shrink-0 place-items-center bg-haze/45">
                    <Vessel
                      vessel={product.vessel}
                      uid={`co-${product.slug}`}
                      className="h-14 w-11"
                    />
                    <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-ink text-[0.65rem] tabular-nums text-salt">
                      {qty}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-base">
                      {product.name}
                    </span>
                    <span className="block text-xs text-ink/50">{product.size}</span>
                  </span>
                  <span className="shrink-0 text-sm tabular-nums">
                    {formatPrice(lineTotal)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2.5 border-t border-ink/15 pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/55">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/55">Delivery</dt>
                <dd className="tabular-nums">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-ink/15 pt-3 text-base">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatPrice(total)}</dd>
              </div>
            </dl>

            <p className="mt-6 text-xs leading-relaxed text-ink/45">
              90 days to change your mind, opened or not. Batch certificate on the
              base of every bottle.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
