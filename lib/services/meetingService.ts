import { prisma } from "@/lib/prisma";
import type { CreateMeetingRequest } from "@/lib/types/MeetingData";

export async function createMeeting(
  data: CreateMeetingRequest,
  hostId: string,
) {
  return prisma.meeting.create({
    data: {
      title: data.title,
      description: data.description ?? "",
      image: data.image ?? "",
      category: data.category,
      location: data.location ?? "",
      date: data.date,
      time: data.time,
      duration: data.duration ?? null,
      price: data.price ?? "무료",
      maxParticipants: data.maxParticipants ?? 8,
      isOnline: data.isOnline ?? false,
      tags: data.tags ?? [],
      filter: data.filter ?? [],
      hostId,
    },
  });
}

export async function getMeetings() {
  return prisma.meeting.findMany({
    orderBy: { createdAt: "desc" },
    include: { host: { select: { id: true, name: true, image: true } } },
  });
}

export async function getMeetingById(id: string) {
  return prisma.meeting.findUnique({
    where: { id },
    include: { host: { select: { id: true, name: true, image: true } } },
  });
}
