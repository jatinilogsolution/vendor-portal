import BlurText from "@/components/ui/text-blur";
import { Quote, Star } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login - Vendor Portal",
  description: "Access your vendor dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 relative z-10 bg-background">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            {/* <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground"> */}
            {/* <GalleryVerticalEnd className="size-5" /> */}
            {/* </div> */}
            <h2 className="text-xl font-bold tracking-tight">
              <span className="text-primary">Vendor</span> Portal
            </h2>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs space-y-6">{children}</div>
        </div>
        <div className="text-center text-xs text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()}{" "}
          <Link href="https://www.awlindia.com/" className=" text-primary">
            AWL INDIA
          </Link>
          . All rights reserved.
        </div>
      </div>

      <div className="relative hidden lg:flex flex-col items-center justify-center bg-muted text-white p-10 overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-zinc-900">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-zinc-900/80 to-transparent" />
        </div>
        {/* Content */}
        <div className="relative z-20 flex flex-col items-center text-center max-w-lg space-y-8">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-linear-to-r from-red-600 to-rose-600 opacity-75 blur-lg" />
            <div className="relative p-2 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-900 backdrop-blur-2xl border-2 border-red-500 shadow-xl">
              <Image
                src="https://www.awlindia.com/assets/images/heaer-logo.webp"
                alt="Vendor Portal"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>
          </div>
          <div className="space-y-4 ">
            <BlurText
              text="Unlock Efficiency with Your Vendor Portal"
              delay={20}
              animateBy="letters"
              direction="bottom"
              className="text-4xl font-bold flex items-center text-nowrap justify-center flex-wrap tracking-tight text-white sm:text-5xl"
            />
            <p className="text-lg text-zinc-400">
              Streamline your vendor operations with our user-friendly platform.
            </p>
          </div>

          {/* Testimonial Card */}
          <div className="mt-8 relative rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 backdrop-blur-sm shadow-2xl">
            <Quote className="absolute -top-4 -left-4 h-8 w-8 text-blue-500 fill-blue-500/20" />
            <div className="flex flex-col items-center text-center gap-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-500 text-yellow-500"
                  />
                ))}
              </div>
              <p className="text-zinc-300 italic text-lg leading-relaxed">
                &quot;This portal has completely transformed how we handle our
                supply chain. The insights are invaluable and the interface is
                incredibly intuitive.&quot;
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-white">Sarah Chen</p>
                  <p className="text-xs text-zinc-500">
                    Operations Director, xyz.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
