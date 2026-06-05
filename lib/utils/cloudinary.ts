const CLOUDINARY_HOST = "res.cloudinary.com";

export function getCloudinaryCloudName(): string | undefined {
  return process.env.CLOUDINARY_CLOUD_NAME;
}

export function isCloudinaryImageUrl(url: string): boolean {
  const cloudName = getCloudinaryCloudName();
  if (!cloudName) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname === CLOUDINARY_HOST &&
      parsed.pathname.startsWith(`/${cloudName}/image/upload/`)
    );
  } catch {
    return false;
  }
}

export function getOptimizedCloudinaryUrl(
  url: string,
  options: { width?: number; height?: number } = {},
): string {
  if (!url.includes(`${CLOUDINARY_HOST}/`) || !url.includes("/upload/")) {
    return url;
  }

  const transforms = ["f_auto", "q_auto"];
  if (options.width) {
    transforms.unshift(`w_${options.width}`);
  }
  if (options.height) {
    transforms.unshift(`h_${options.height}`);
  }

  return url.replace("/upload/", `/upload/${transforms.join(",")}/`);
}
