import { Button } from "@/components/ui/button";

// Placeholder that exercises the theme; replaced by the real sections in phase 6.
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-6 px-4 py-16">
      <h1 className="text-4xl font-semibold sm:text-6xl">
        Portfolio en construcción
      </h1>
      <p className="text-muted-foreground max-w-prose">
        Desarrollo de software a medida desde Cuba para empresas en España y
        otros países.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button>Contactar</Button>
        <Button variant="outline">Descargar CV</Button>
      </div>
    </main>
  );
}
