import type { Metadata } from "next";
import "../globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import Footer from "@/components/footer/footer";
import Main from "@/components/main";
import { Poppins } from "next/font/google";
import AuthGuard from "@/components/auth-guard";

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
        <AuthGuard>
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
        </AuthGuard>
      </body>
    </html>
  );
}
