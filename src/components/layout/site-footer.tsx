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
    <footer className="flex flex-col gap-1 border-border border-t pt-8 text-muted-foreground text-sm">
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
    </footer>
  );
}
