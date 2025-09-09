// components/ui/CustomToast.tsx
import React from "react";
import { Toast, ToastTitle } from "@/components/ui/toast";
import { Icon } from "@/components/ui/icon";
import { Divider } from "@/components/ui/divider";
import { Send } from "lucide-react-native";

type CustomToastProps = {
  id: string;
  message: string;
  icon?: any; // default is Send
};

export function CustomToast({ id, message, icon = Send }: CustomToastProps) {
  const toastId = "toast-" + id;

  return (
    <Toast
      nativeID={toastId}
      className="px-5 py-3 gap-4 shadow-soft-1 items-center flex-row mb-16"
    >
      <Icon as={icon} size="xl" className="fill-typography-100 stroke-none" />
      <Divider orientation="vertical" className="h-[30px] bg-outline-200" />
      <ToastTitle size="sm">{message}</ToastTitle>
    </Toast>
  );
}
