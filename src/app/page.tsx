import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import { ModeToggle } from "@/components/ui/ModeToggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-border-medium bg-gradient-to-b from-background-secondary pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-background-secondary lg:p-4">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-background-primary via-background-primary lg:static lg:size-auto lg:bg-none">
          <ModeToggle />
        </div>
      </div>
    </main>
  );
}