import type React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ChatHeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function ChatHeader({
  isSidebarOpen,
  onToggleSidebar,
}: ChatHeaderProps) {
  return (
    <DialogHeader className="p-6 pb-0 flex flex-row items-center">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="mr-3 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </Button>
        <DialogTitle>
          <Image src="/ess-logo.png" alt="ESS Logo" width={200} height={50} />
        </DialogTitle>
      </div>
    </DialogHeader>
  );
}
