import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/navbar/navbar";

const poppins = Poppins({ subsets: ["latin"], weight: ["300"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Navbar />
        <div className="mainContent">{children}</div>
      </body>
    </html>
  );
}
