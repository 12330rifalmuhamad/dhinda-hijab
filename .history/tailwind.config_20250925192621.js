export default function RootLayout({ children }) {
    return (
      <html lang="id">
        {/* Ganti bg-white menjadi bg-cream dan text-gray-900 menjadi text-brand-text */}
        <body className={`${inter.className} bg-cream text-brand-text`}>
          {children}
        </body>
      </html>
    );
  }