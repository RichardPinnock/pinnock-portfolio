interface SiteFooterProps {
  name: string;
  rights: string;
  builtWith: string;
  repoUrl: string;
}

export function SiteFooter({
  name,
  rights,
  builtWith,
  repoUrl,
}: SiteFooterProps) {
  return (
    <footer className="border-border border-t py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 text-muted-foreground text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {name}. {rights}
        </p>
        <p>
          {builtWith}{" "}
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
