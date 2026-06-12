export function SectionHeading({
  tag,
  title,
}: {
  tag: string;
  title?: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold tracking-[0.3em] text-phosphor">
          <span className="text-phosphor/50">{"//"}</span> {tag}
        </span>
        <span className="h-px flex-1 bg-line" aria-hidden />
      </div>
      {title && (
        <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-bone sm:text-3xl">
          {title}
        </h2>
      )}
    </div>
  );
}
