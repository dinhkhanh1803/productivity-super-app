import { NextResponse } from "next/server";

const PIXABAY_IMAGE_API = "https://pixabay.com/api/";
const PIXABAY_VIDEO_API = "https://pixabay.com/api/videos/";
const ONE_DAY_SECONDS = 60 * 60 * 24;

type BackgroundItem = {
  id: string;
  label: string;
  type: "image" | "video";
  url: string;
  thumb: string;
};

type PixabayImageHit = {
  id: number;
  tags: string;
  largeImageURL: string;
  webformatURL: string;
};

type PixabayVideoVariant = {
  url: string;
  thumbnail: string;
};

type PixabayVideoHit = {
  id: number;
  tags: string;
  videos: {
    large?: PixabayVideoVariant;
    medium?: PixabayVideoVariant;
    small?: PixabayVideoVariant;
    tiny?: PixabayVideoVariant;
  };
};

const CURATED_IMAGE_QUERIES = ["forest", "lofi room"];
const CURATED_VIDEO_QUERIES = ["beach", "abstract background"];

async function fetchPixabay<T>(baseUrl: string, params: Record<string, string>) {
  const apiKey = process.env.PIXABAY_API_KEY;

  if (!apiKey) {
    throw new Error("Missing PIXABAY_API_KEY");
  }

  const url = new URL(baseUrl);
  url.search = new URLSearchParams({
    key: apiKey,
    safesearch: "true",
    ...params,
  }).toString();

  const response = await fetch(url.toString(), {
    next: { revalidate: ONE_DAY_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Pixabay request failed with status ${response.status}`);
  }

  return response.json() as Promise<{ hits: T[] }>;
}

function toTitle(input: string) {
  return input
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

async function fetchCuratedImages() {
  const responses = await Promise.all(
    CURATED_IMAGE_QUERIES.map((query) =>
      fetchPixabay<PixabayImageHit>(PIXABAY_IMAGE_API, {
        q: query,
        image_type: "photo",
        orientation: "horizontal",
        per_page: "3",
        order: "popular",
        editors_choice: "true",
      })
    )
  );

  return responses.flatMap((response, index) => {
    const hit = response.hits[0];
    if (!hit) return [];

    return [
      {
        id: `pixabay-image-${hit.id}`,
        label: toTitle(CURATED_IMAGE_QUERIES[index]),
        type: "image" as const,
        url: hit.largeImageURL,
        thumb: hit.webformatURL,
      },
    ];
  });
}

async function fetchCuratedVideos() {
  const responses = await Promise.all(
    CURATED_VIDEO_QUERIES.map((query) =>
      fetchPixabay<PixabayVideoHit>(PIXABAY_VIDEO_API, {
        q: query,
        per_page: "3",
        order: "popular",
      })
    )
  );

  return responses.flatMap((response, index) => {
    const hit = response.hits[0];
    const variant =
      hit?.videos.large ??
      hit?.videos.medium ??
      hit?.videos.small ??
      hit?.videos.tiny;

    if (!hit || !variant) return [];

    return [
      {
        id: `pixabay-video-${hit.id}`,
        label: toTitle(CURATED_VIDEO_QUERIES[index]),
        type: "video" as const,
        url: variant.url,
        thumb: variant.thumbnail,
      },
    ];
  });
}

export async function GET() {
  try {
    const [images, videos] = await Promise.all([
      fetchCuratedImages(),
      fetchCuratedVideos(),
    ]);

    const backgrounds: BackgroundItem[] = [...images, ...videos];

    return NextResponse.json({ backgrounds });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load Pixabay backgrounds";

    return NextResponse.json(
      { error: message, backgrounds: [] satisfies BackgroundItem[] },
      { status: 500 }
    );
  }
}
