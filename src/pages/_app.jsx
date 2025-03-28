import '@/styles/globals.css';
import Header from '@/components/Header';
import AdminHeader from '@/components/Admin/Header';
import Footer from '@/components/Footer';

import { useState, useEffect } from 'react';
import cookieParser from "cookie-parser";
import Script from "next/script";
import "animate.css"
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {

  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.cookie = document.cookie;
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {router.pathname.startsWith("/Admin") ?
        !(router.pathname.includes("/Login") || router.pathname.includes("/Forgot")) && <AdminHeader />
      : <Header />}
      <main className={`flex-grow ${!(router.pathname.includes("/Admin/Login") || router.pathname.includes("/Admin/Forgot")) && "mt-[60px]"} mx-0`}>
        <Component {...pageProps} />
      </main>
      <Footer className="mt-auto" />
      
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="beforeInteractive"
        onLoad={() => console.log("Google Sign-In script loaded")}
      />
    </div>
  );  
}

export const config = {
  api: {
    bodyParser: false,
  },
};