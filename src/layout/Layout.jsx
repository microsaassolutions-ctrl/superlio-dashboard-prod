import React from "react";
import { Outlet } from "react-router-dom";
import { Footer, Header, ScrollTop, SideBar } from "../components/commons";
import { ToastContainer } from "react-toastify";

const Layout = () => { 
  return (
    <div>
      <ScrollTop />
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />
      <SideBar />
      <main className="min-h-[calc(100vh-144px)] ml-0 sm:ml-[70px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
