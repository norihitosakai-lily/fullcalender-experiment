import type { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

export type MyCalendarProps = {
  ics: string;
  today: string;
  className?: string;
};

export type MyModalProps = {
  TriggerButton: typeof Button;
  triggerButtonChildren: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  content: ReactNode;
  CloseButton: typeof Button;
  closeButtonChildren: ReactNode;
  className?: string;
};
