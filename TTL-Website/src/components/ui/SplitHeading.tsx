interface SplitHeadingProps {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}

export default function SplitHeading({
  text,
  as: Tag = "h1",
  className = "",
}: SplitHeadingProps) {
  return <Tag className={className}>{text}</Tag>;
}
