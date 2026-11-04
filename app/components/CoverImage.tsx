import Image from "next/image";

// Full-bleed decorative photo for cards and slides. Going through next/image means each
// device gets a resized AVIF/WebP instead of the 2400px source JPEG, and offscreen photos
// load lazily (pass `preload` only for the first hero slide).
type Props = {
  src: string;
  sizes: string;
  className?: string;
  brightness?: number;
  position?: string;
  preload?: boolean;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
};

export default function CoverImage({ src, sizes, className = "", brightness, position, preload, loading, fetchPriority }: Props) {
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      preload={preload}
      loading={preload ? undefined : loading}
      fetchPriority={fetchPriority}
      className={`object-cover ${className}`}
      style={{
        objectPosition: position,
        filter: brightness ? `brightness(${brightness})` : undefined,
      }}
    />
  );
}
