"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";

const addStaffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["MANAGER", "STAFF"]),
});

async function requireOwner() {
  const session = await auth();
  const user = session?.user as Record<string, unknown> | undefined;
  const shopId = user?.shopId as string | undefined;
  const role = user?.role as string | undefined;
  if (!shopId) return { error: "Not authenticated" as const, shopId: null, userId: null };
  if (role !== "OWNER") return { error: "Only the owner can manage staff" as const, shopId: null, userId: null };
  return { error: null, shopId, userId: user?.id as string };
}

export async function addStaff(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  const check = await requireOwner();
  if (check.error) return { error: check.error };

  const parsed = addStaffSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { name, email, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "Email already in use" };

  const hashed = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({
      data: { name, email, password: hashed, role, shopId: check.shopId! },
    });
    revalidatePath("/settings/staff");
    return { success: true };
  } catch {
    return { error: "Failed to create staff account" };
  }
}

export async function updateStaffRole(userId: string, role: "MANAGER" | "STAFF") {
  const check = await requireOwner();
  if (check.error) return { error: check.error };

  if (userId === check.userId) return { error: "Cannot change your own role" };

  try {
    await prisma.user.updateMany({
      where: { id: userId, shopId: check.shopId! },
      data: { role },
    });
    revalidatePath("/settings/staff");
    return { success: true };
  } catch {
    return { error: "Failed to update role" };
  }
}

export async function removeStaff(userId: string) {
  const check = await requireOwner();
  if (check.error) return { error: check.error };

  if (userId === check.userId) return { error: "Cannot remove yourself" };

  try {
    await prisma.user.deleteMany({
      where: { id: userId, shopId: check.shopId! },
    });
    revalidatePath("/settings/staff");
    return { success: true };
  } catch {
    return { error: "Failed to remove staff member" };
  }
}

export async function getStaff(shopId: string) {
  return prisma.user.findMany({
    where: { shopId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
}
