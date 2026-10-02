import { CALENDLY, track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function BookCall({
  location,
  variant = "gold",
  className,
  children = "Book a call",
}: {
  location: string;
  variant?: "gold" | "outline";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <a
      href={CALENDLY}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("book_call_click", location)}
      className={cn(btn(variant), className)}
    >
      {children}
    </a>
  );
}

export function btn(variant: "gold" | "outline" = "gold") {
  return cn(
    "btn-shine inline-flex min-h-12 items-center justify-center rounded-full px-6 text-base font-semibold transition-all",
    variant === "gold"
      ? "bg-primary text-primary-foreground hover:bg-gold-light shadow-[0_10px_24px_-10px_var(--gold-deep)]"
      : "border-2 border-foreground/80 text-foreground hover:bg-foreground/5",
  );
}
