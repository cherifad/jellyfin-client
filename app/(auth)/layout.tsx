import type { Metadata } from "next";
import "../globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Poppins } from "next/font/google";
import AuthGuard from "@/components/auth-guard";

const inter = Poppins({ subsets: ["latin"], weight: ["100", "400", "700"] });

export const metadata: Metadata = {
    title: "Login - Jellyfin Next",
    description: "Login to Jellyfin Next",
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
                        {children}
                    </ThemeProvider>
                </AuthGuard>
            </body>
        </html>
    );
}
