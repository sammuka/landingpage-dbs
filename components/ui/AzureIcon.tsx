import Image from "next/image";

interface AzureIconProps {
  name: string;
  size?: number;
  className?: string;
  alt?: string;
}

export function AzureIcon({ name, size = 24, className = "", alt }: AzureIconProps) {
  return (
    <Image
      src={`/icons/azure/${name}`}
      alt={alt ?? name.replace(".svg", "").replace(/-/g, " ")}
      width={size}
      height={size}
      className={className}
      unoptimized
    />
  );
}
