import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

export const metadata = {
  title: "Todo App",
  description: "A complete Todo application built in Next.js with TypeScript and Tailwind CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col min-h-screen">
        <ClientProviders>
          <div className="flex-1">{children}</div>
          <footer className="p-4 bg-gray-300 dark:bg-gray-700 text-center border-t border-gray-400 dark:border-gray-600">
            Copyright Reserved
          </footer>
        </ClientProviders>
      </body>
    </html>
  );
}
