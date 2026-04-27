/**
 * Featurable Google Reviews widget API.
 * Widget ID: e71cc001-05ca-4b0b-aa8a-a89b8a618174
 * @see https://featurable.com/api/v1/widgets/e71cc001-05ca-4b0b-aa8a-a89b8a618174
 */

const FEATURABLE_WIDGET_URL =
  "https://featurable.com/api/v1/widgets/e71cc001-05ca-4b0b-aa8a-a89b8a618174";

export interface FeaturableReviewer {
  profilePhotoUrl?: string;
  displayName: string;
}

export interface FeaturableReview {
  reviewId: string;
  reviewer: FeaturableReviewer;
  starRating: number;
  comment: string;
  createTime: string;
  updateTime: string;
}

export interface FeaturableWidgetResponse {
  success: boolean;
  widget: string;
  layout: string;
  published: boolean;
  totalReviewCount: number;
  averageRating: number;
  profileUrl?: string;
  reviews: FeaturableReview[];
}

/**
 * Converts Featurable's profileUrl (write-review link) to a Google Maps place URL
 * so users can view the business and its reviews instead of the "add review" form.
 * Example: .../writereview?placeid=ChIJ... → https://www.google.com/maps/place?q=place_id:ChIJ...
 */
export function getGoogleMapsReviewsUrl(profileUrl: string | undefined): string | undefined {
  if (!profileUrl) return undefined;
  try {
    const url = new URL(profileUrl);
    const placeId = url.searchParams.get("placeid");
    if (!placeId) return undefined;
    return `https://www.google.com/maps/place?q=place_id:${encodeURIComponent(placeId)}`;
  } catch {
    return undefined;
  }
}

export async function getFeaturableReviews(): Promise<FeaturableWidgetResponse | null> {
  try {
    const res = await fetch(FEATURABLE_WIDGET_URL);
    if (!res.ok) return null;
    const data = (await res.json()) as FeaturableWidgetResponse;
    return data.success && data.reviews ? data : null;
  } catch {
    return null;
  }
}
