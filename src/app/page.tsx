import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import { ModeToggle } from "@/components/ui/ModeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Chào mừng đến với{" "}
            <span className="text-primary">
              Personal Interactive Blog
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            An interactive NextJS blog using AWS services. Sharing technical knowledge, especially front-end development insights and best practices.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/blog">
              <Button
                variant="default"
                size="lg"
              >
                Xem Blog
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
            >
              Tìm hiểu thêm
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Image
                  src="/next.svg"
                  alt="Next.js"
                  width={24}
                  height={24}
                  className="dark:invert"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Next.js 15 + ISR
              </h3>
              <p className="text-muted-foreground">
                React framework với App Router, Server Components và Incremental Static Regeneration
              </p>
            </div>

            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-secondary text-secondary-foreground rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                AWS S3 + DynamoDB
              </h3>
              <p className="text-muted-foreground">
                Store markdown content in S3 và metadata trong DynamoDB
              </p>
            </div>

            <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                MDX + Remark
              </h3>
              <p className="text-muted-foreground">
                Render markdown content với syntax highlighting và custom components
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}