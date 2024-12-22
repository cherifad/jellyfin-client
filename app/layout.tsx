import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import Footer from "@/components/footer/footer";
import Main from "@/components/main";
import { Inter, Poppins } from "next/font/google";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const inter = Poppins({ subsets: ["latin"], weight: ["100", "400", "700"] });

export const metadata: Metadata = {
  title: "Jellyfin Next",
  description: "Next client for Jellyfin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider className="flex-col">
            <Main>{children}</Main>
            {/* <Footer /> */}
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
