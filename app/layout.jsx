import './globals.css';

export const metadata = {
  title: 'LIM Factory | High-End Terrazzo',
  description: 'Discover premium terrazzo tiles by LIM Factory. Handcrafted using 100% recycled marble for high-end residential and commercial designs.',
  keywords: 'Terrazzo tiles, custom terrazzo, LIM Factory, luxury flooring, recycled marble tiles',
  openGraph: {
    title: 'LIM Factory | High-End Terrazzo',
    description: 'Discover premium terrazzo tiles by LIM Factory. Handcrafted using 100% recycled marble for high-end residential and commercial designs.',
    type: 'website',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link href="https://fonts.cdnfonts.com/css/blanka" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
