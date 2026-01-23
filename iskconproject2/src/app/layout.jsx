import "./globals.css";

export const metadata = {
  title: "ISKCON Sanjivani | Room & Resource Allocation",
  description:
    "Divine, calm and professional room & resource allocation system UI for ISKCON Sanjivani IT Cell",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAF7] text-[#2B2B2B] antialiased">
        {children}
      </body>
    </html>
  );
}
