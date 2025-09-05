"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MyModalProps } from "@/types/types";
import { type FunctionComponent, useState } from "react";

export const MyModal: FunctionComponent<MyModalProps> = ({
  TriggerButton,
  triggerButtonChildren,
  title,
  description,
  content,
  CloseButton,
  closeButtonChildren,
  className,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile: boolean = window.innerWidth < 1024;

  return (
    <div className={className}>
      {isMobile ? (
        <Drawer open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DrawerTrigger asChild>
            <TriggerButton asChild>{triggerButtonChildren}</TriggerButton>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            {content}
            <DrawerFooter>
              <DrawerClose asChild>
                <CloseButton asChild>{closeButtonChildren}</CloseButton>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <TriggerButton asChild>{triggerButtonChildren}</TriggerButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            {content}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
