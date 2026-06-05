import Image from "next/image";
import { getOptimizedCloudinaryUrl } from "@/lib/utils/cloudinary";

type PostImageGalleryProps = {
  images: string[];
};

export default function PostImageGallery({ images }: PostImageGalleryProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div
      className={`grid gap-3 ${
        images.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
      }`}
    >
      {images.map((image, index) => (
        <div
          key={image}
          className="relative w-full overflow-hidden rounded-xl border border-[#E8E0D6] bg-[#F5F0EB] aspect-[4/3]"
        >
          <Image
            src={getOptimizedCloudinaryUrl(image, { width: 900 })}
            alt={`게시글 이미지 ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
      ))}
    </div>
  );
}
