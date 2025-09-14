// components/ui/CustomToast.tsx
import React from "react";
import { Toast, ToastTitle } from "@/components/ui/toast";
import { Icon } from "@/components/ui/icon";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Send, Check, AlertTriangle, Info, X } from "lucide-react-native";

type ToastType = "success" | "error" | "warning" | "info" | "default";

type CustomToastProps = {
  id: string;
  message: string;
  type?: ToastType;
  icon?: any;
  actionText?: string;
  onAction?: () => void;
  showCloseButton?: boolean;
  onClose?: () => void;
};

export function CustomToast({ 
  id, 
  message, 
  type = "default",
  icon,
  actionText,
  onAction,
  showCloseButton = false,
  onClose
}: CustomToastProps) {
  const toastId = "toast-" + id;

  // Auto-select icon and colors based on type
  const getToastConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: icon || Check,
          bgColor: "bg-success-50",
          borderColor: "border-success-200",
          iconColor: "text-success-600",
          textColor: "text-success-800"
        };
      case "error":
        return {
          icon: icon || X,
          bgColor: "bg-error-50",
          borderColor: "border-error-200", 
          iconColor: "text-error-600",
          textColor: "text-error-800"
        };
      case "warning":
        return {
          icon: icon || AlertTriangle,
          bgColor: "bg-warning-50",
          borderColor: "border-warning-200",
          iconColor: "text-warning-600", 
          textColor: "text-warning-800"
        };
      case "info":
        return {
          icon: icon || Info,
          bgColor: "bg-info-50",
          borderColor: "border-info-200",
          iconColor: "text-info-600",
          textColor: "text-info-800"
        };
      default:
        return {
          icon: icon || Send,
          bgColor: "bg-background-0",
          borderColor: "border-outline-200",
          iconColor: "text-typography-600",
          textColor: "text-typography-800"
        };
    }
  };

  const config = getToastConfig();

  return (
    <Toast
      nativeID={toastId}
      className={`px-4 py-3 gap-3 shadow-soft-2 items-center flex-row mb-16 rounded-xl border ${config.bgColor} ${config.borderColor}`}
    >
      {/* Icon */}
      <Icon 
        as={config.icon} 
        size="lg" 
        className={`${config.iconColor} ${type === "success" ? "fill-current" : ""}`} 
      />
      
      {/* Divider */}
      <Divider 
        orientation="vertical" 
        className="h-[32px] bg-outline-200" 
      />
      
      {/* Content */}
      <HStack className="flex-1 items-center justify-between">
        <ToastTitle 
          size="sm" 
          className={`flex-1 ${config.textColor} font-medium`}
          numberOfLines={2}
        >
          {message}
        </ToastTitle>
        
        {/* Action Button */}
        {actionText && onAction && (
          <Text
            className="text-sm font-semibold text-primary-600 ml-3"
            onPress={onAction}
          >
            {actionText}
          </Text>
        )}
        
        {/* Close Button */}
        {showCloseButton && onClose && (
          <Icon
            as={X}
            size="sm"
            className="text-typography-400 ml-2"
            onPress={onClose}
          />
        )}
      </HStack>
    </Toast>
  );
}