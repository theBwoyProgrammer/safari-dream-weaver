import { readPublicRecords } from "@/integrations/firebase/data";

export type MealPlan = "full_board" | "half_board" | "bed_breakfast";

export const mealPlanLabels: Record<MealPlan, string> = {
  full_board: "Full board",
  half_board: "Half board",
  bed_breakfast: "Bed & breakfast",
};

export interface RoomType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  total_rooms: number;
  price_full_board: number;
  price_half_board: number;
  price_bed_breakfast: number;
  max_guests: number;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface AvailabilityRow {
  day: string;
  room_type_id: string;
  total_rooms: number;
  booked_rooms: number;
  is_blocked: boolean;
}

export const priceFor = (room: RoomType, plan: MealPlan) =>
  plan === "full_board"
    ? Number(room.price_full_board)
    : plan === "half_board"
      ? Number(room.price_half_board)
      : Number(room.price_bed_breakfast);

export const toDateKey = (date: Date) => {
  const offset = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offset.toISOString().slice(0, 10);
};

export const nightsBetween = (from: Date, to: Date) =>
  Math.max(0, Math.round((to.getTime() - from.getTime()) / 86400000));

export const fetchRoomTypes = () => readPublicRecords<RoomType>("rooms");

export const fetchAvailability = async (_start: Date, _end: Date) => [] as AvailabilityRow[];

/** Map of `${roomTypeId}|${dateKey}` -> rooms still open that night. */
export const buildAvailabilityMap = (rows: AvailabilityRow[]) => {
  const map = new Map<string, number>();
  rows.forEach((row) => {
    const open = row.is_blocked ? 0 : Math.max(0, row.total_rooms - row.booked_rooms);
    map.set(`${row.room_type_id}|${row.day.slice(0, 10)}`, open);
  });
  return map;
};

export const roomsOpenOn = (
  map: Map<string, number>,
  roomTypeId: string,
  date: Date,
  fallback: number,
) => {
  const value = map.get(`${roomTypeId}|${toDateKey(date)}`);
  return value === undefined ? fallback : value;
};
