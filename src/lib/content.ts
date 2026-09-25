import { getSiteImage, readPublicRecords } from "@/integrations/firebase/data";

export type PublicGalleryImage = { id: string; title: string; category: string; image_url: string; sort_order: number };
export type PublicActivity = { id: string; title: string; summary?: string; details?: string; duration?: string; price?: string; image_url?: string; sort_order: number };

export const fetchPublicGallery = () => readPublicRecords<PublicGalleryImage>("gallery");

export const fetchPublicActivities = () => readPublicRecords<PublicActivity>("activities");

export const fetchSiteImage = getSiteImage;
