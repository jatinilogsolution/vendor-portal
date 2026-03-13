"use server";

import { getCustomSession } from "@/actions/auth.action";
import {
  getVpNotificationsForUser,
  getUnreadVpNotificationCount,
  markAllVpNotificationsRead,
  markVpNotificationRead as markRead,
} from "@/lib/vendor-portal/notifications";
import { revalidatePath } from "next/cache";

export async function getMyVpNotifications(limit = 20) {
  const session = await getCustomSession();
  return getVpNotificationsForUser(session.user.id, limit);
}

export async function getMyUnreadVpNotificationCount() {
  const session = await getCustomSession();
  return getUnreadVpNotificationCount(session.user.id);
}

export async function markVpNotificationReadAction(id: string) {
  const session = await getCustomSession();
  await markRead(id);
  revalidatePath("/vendor-portal");
}

export async function markAllVpNotificationsReadAction() {
  const session = await getCustomSession();
  await markAllVpNotificationsRead(session.user.id);
  revalidatePath("/vendor-portal");
}