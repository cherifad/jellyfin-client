import { LoaderCircle } from "lucide-react";

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-black text-primary-foreground">
      <div className="flex justify-center items-center space-x-2 text-sm">
        <LoaderCircle className="animate-spin text-xl" />
        <div className="text-xl">{message}</div>
      </div>
    </div>
  );
}
