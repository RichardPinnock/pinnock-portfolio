import { notFound } from "next/navigation";

// Any unknown path under a locale ends here so it renders the localized 404 inside the root layout.
export default function CatchAll() {
  notFound();
}
