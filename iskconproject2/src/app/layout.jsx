import "./globals.css";

export const metadata = {
  title: "ISKCON Sanjivini IT Cell",
  description: "Empowering devotional service through technology - ISKCON Sanjivini IT Cell",
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

