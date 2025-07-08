import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-background">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <span className="absolute w-full h-full rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <Image src="/logo.png" alt="ApuestaTotal Logo" width={64} height={64} className="z-10 dark:invert dark:grayscale" />
      </div>
    </div>
  );
}
