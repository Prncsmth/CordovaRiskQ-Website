"use client";

import { CircleCheck, LoaderCircle, MessageSquare, PenLine, Send, Star } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { buttonStyles, cn } from "@/components/ui";

/** The CORDOVA RISKQ API (same backend as the app). Override with NEXT_PUBLIC_API_URL. */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://cordova-riskq-api.onrender.com/api";

interface PublicReview {
  id: string;
  name: string | null;
  rating: number;
  title: string | null;
  comment: string;
  createdAt: string;
}

interface Summary {
  count: number;
  average: number | null;
}

type LoadState = { kind: "loading" } | { kind: "error" } | { kind: "ready"; summary: Summary; reviews: PublicReview[] };

const RATING_WORDS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5", className)} aria-label={`${value} out of 5 stars`} role="img">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden
          className={cn("size-4", n <= Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-line text-line")}
        />
      ))}
    </span>
  );
}

/** Only real, admin-approved reviews from the CORDOVA RISKQ backend are shown. */
export function Reviews() {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/reviews`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: { summary: Summary; reviews: PublicReview[] }) => {
        if (!cancelled) setState({ kind: "ready", summary: data.summary, reviews: data.reviews });
      })
      .catch(() => {
        if (!cancelled) setState({ kind: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <RatingLine state={state} />
      <ReviewWall state={state} />
      <div className="mx-auto mt-12 max-w-xl">
        <ReviewForm />
      </div>
    </div>
  );
}

function RatingLine({ state }: { state: LoadState }) {
  if (state.kind !== "ready" || !state.summary.count || state.summary.average === null) return null;
  const { average, count } = state.summary;
  return (
    <p className="-mt-4 mb-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-muted">
      <span className="font-display text-2xl font-bold text-ink tabular-nums">{average.toFixed(1)}</span>
      <Stars value={average} />
      <span>
        from {count} {count === 1 ? "review" : "reviews"}
      </span>
    </p>
  );
}

function ReviewWall({ state }: { state: LoadState }) {
  if (state.kind === "loading") {
    return (
      <p className="flex min-h-40 items-center justify-center gap-2 text-muted">
        <LoaderCircle aria-hidden className="size-4 animate-spin" /> Loading reviews…
      </p>
    );
  }
  if (state.kind === "error" || state.reviews.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-2 rounded-3xl border border-dashed border-line bg-white p-8 text-center">
        <MessageSquare aria-hidden className="size-7 text-faint" />
        <p className="font-semibold text-ink">
          {state.kind === "error" ? "Reviews are unavailable right now" : "No reviews yet"}
        </p>
        <p className="text-sm text-muted">
          {state.kind === "error" ? "Please try again later." : "Used the app? Be the first to share your experience below."}
        </p>
      </div>
    );
  }
  // Masonry: cards keep their natural height and flow down the columns.
  return (
    <ul className="columns-1 gap-5 sm:columns-2 lg:columns-3">
      {state.reviews.map((review) => (
        <li key={review.id} className="mb-5 break-inside-avoid rounded-3xl bg-white p-6 shadow-[0_1px_2px_rgba(23,24,26,0.04),0_8px_24px_-12px_rgba(23,24,26,0.12)]">
          <div className="flex items-center justify-between gap-3">
            <Stars value={review.rating} />
            <span className="text-xs font-medium text-faint">
              {new Date(review.createdAt).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })}
            </span>
          </div>
          {review.title ? <h3 className="mt-4 font-display text-lg leading-snug font-bold text-ink">{review.title}</h3> : null}
          <p className={cn("leading-relaxed whitespace-pre-wrap text-muted", review.title ? "mt-2" : "mt-4")}>
            {review.comment}
          </p>
          <p className="mt-5 text-sm font-semibold text-faint">{review.name || "Anonymous"}</p>
        </li>
      ))}
    </ul>
  );
}

function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<{ kind: "idle" | "sending" | "sent" } | { kind: "error"; message: string }>({
    kind: "idle",
  });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (rating < 1) {
      setStatus({ kind: "error", message: "Please choose a star rating." });
      return;
    }
    if (comment.trim().length < 3) {
      setStatus({ kind: "error", message: "Please write a short comment." });
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
          name: name.trim() || undefined,
          website: honeypot,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) throw new Error(data.message ?? "Couldn't send your review. Please try again.");
      setStatus({ kind: "sent" });
      setRating(0);
      setName("");
      setTitle("");
      setComment("");
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error && error.message ? error.message : "Couldn't send your review. Please try again.",
      });
    }
  };

  if (status.kind === "sent") {
    return (
      <div className="panel-in flex gap-3 rounded-3xl border border-success/30 bg-success-bg p-6 sm:p-7">
        <CircleCheck aria-hidden className="mt-0.5 size-6 shrink-0 text-success" />
        <div>
          <p className="font-display text-lg font-bold text-ink">Thank you for your feedback!</p>
          <p className="mt-1 text-sm text-muted">Your review will appear here once it has been checked.</p>
          <button
            type="button"
            onClick={() => setStatus({ kind: "idle" })}
            className="mt-3 text-sm font-semibold text-brand hover:underline"
          >
            Write another review
          </button>
        </div>
      </div>
    );
  }

  const shown = hover || rating;
  const field =
    "mt-1.5 w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-ink outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15";
  return (
    <form onSubmit={submit} className="rounded-3xl bg-white p-6 shadow-[0_8px_24px_-12px_rgba(23,24,26,0.18)] sm:p-8" noValidate>
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-brand text-white">
          <PenLine aria-hidden className="size-5" />
        </span>
        <div>
          <h3 className="font-display text-xl font-bold tracking-tight text-ink">Write a review</h3>
          <p className="text-sm text-muted">Tell others how the app works for you.</p>
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-ink">Your rating</legend>
        <div className="mt-2 flex flex-wrap items-center gap-3" onMouseLeave={() => setHover(0)}>
          <div role="radiogroup" aria-label="Rating" className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                className="rounded-md p-0.5 transition-transform duration-150 hover:scale-110 active:scale-95"
              >
                <Star aria-hidden className={cn("size-8", n <= shown ? "fill-amber-400 text-amber-400" : "text-line")} />
              </button>
            ))}
          </div>
          <span className="text-sm font-medium text-muted">{RATING_WORDS[shown]}</span>
        </div>
      </fieldset>

      <label className="mt-5 block">
        <span className="text-sm font-semibold text-ink">
          Title <span className="font-normal text-faint">(optional)</span>
        </span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
          placeholder="Sum it up in a few words"
          className={field}
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-ink">Review</span>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          rows={4}
          required
          placeholder="What do you like, or what should we improve?"
          className={cn(field, "resize-y")}
        />
        <span className="mt-1 block text-right text-xs text-faint">{comment.length}/500</span>
      </label>

      <label className="mt-1 block">
        <span className="text-sm font-semibold text-ink">
          Name <span className="font-normal text-faint">(optional)</span>
        </span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          autoComplete="name"
          placeholder="Shown as Anonymous if left empty"
          className={field}
        />
      </label>

      {/* Honeypot: hidden from people, filled in only by bots. */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute left-[-9999px] size-px opacity-0"
      />

      <div aria-live="polite">
        {status.kind === "error" ? <p className="mt-3 text-sm font-medium text-brand">{status.message}</p> : null}
      </div>

      <button
        type="submit"
        disabled={status.kind === "sending"}
        className={cn(buttonStyles.primary, "mt-5 w-full disabled:opacity-70")}
      >
        {status.kind === "sending" ? (
          <LoaderCircle aria-hidden className="size-4 animate-spin" />
        ) : (
          <Send aria-hidden className="size-4" />
        )}
        {status.kind === "sending" ? "Sending…" : "Submit review"}
      </button>
      <p className="mt-3 text-center text-xs text-faint">Reviews are checked before they appear on this page.</p>
    </form>
  );
}
