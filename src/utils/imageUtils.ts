import FaviconSvg from "/favicon.svg";

export const getSecureImageUrl = (
  originalImageUrl: string | undefined,
  fallbackImage: string = FaviconSvg
): string => {
  if (!originalImageUrl) return fallbackImage;

  if (
    originalImageUrl.startsWith("https://") ||
    originalImageUrl.startsWith("/")
  ) {
    return originalImageUrl;
  }

  if (originalImageUrl.startsWith("http://")) {
    return originalImageUrl.replace("http://", "https://");
  }

  if (!originalImageUrl.startsWith("https://")) {
    return `https://${originalImageUrl}`;
  }

  return originalImageUrl;
};
