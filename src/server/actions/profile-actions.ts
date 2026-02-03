"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface FamilyHistoryEntry {
  id: string;
  relation: string;
  condition: string;
  notes?: string;
  createdAt: string;
}

export type FamilyHistoryData = FamilyHistoryEntry[];

export async function getFamilyHistory(): Promise<{
  success: boolean;
  data?: FamilyHistoryData;
  error?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const profile = await db.userProfile.findFirst({
      where: { userId: session.user.id },
      select: { familyHistory: true },
    });

    // Parse the JSON data safely
    const history =
      (profile?.familyHistory as unknown as FamilyHistoryData) || [];

    return { success: true, data: history };
  } catch (error) {
    console.error("Error fetching family history:", error);
    return { success: false, error: "Failed to fetch family history" };
  }
}

export async function updateFamilyHistory(data: FamilyHistoryData): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Ensure user has a profile
    let profile = await db.userProfile.findFirst({
      where: { userId: session.user.id },
    });

    if (!profile) {
      // Create default profile if none exists
      profile = await db.userProfile.create({
        data: {
          userId: session.user.id,
          parentOneName: session.user.name || "Parent",
        },
      });
    }

    // Update the JSON field
    // Prisma handles JSON automatically, but we cast to any to satisfy TS logic if needed
    // or just pass the object directly.
    await db.userProfile.update({
      where: { id: profile.id },
      data: {
        familyHistory: data as any, // Cast to any to avoid Prisma Json type strictness issues
      },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Error updating family history:", error);
    return { success: false, error: "Failed to update family history" };
  }
}
