import { useState } from "react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import Product from "../pages/Product";



const MainContent = (props) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(true);

  return (<div className="min-h-screen flex bg-neutral-900 text-neutral-100">
    <Sidebar
      open={sidebarOpen}
      onClose={() => setSidebarOpen(false)}
      current={"overview"}
      setCurrent={() => { }}
    />

    <div className="flex flex-col min-h-screen w-full lg:pl-72">
      <Navbar
        onMenu={() => setSidebarOpen(true)}
        dark={dark}
        setDark={setDark}
      />
      {props.children}

      <Footer />
    </div>
  </div>)
}

export default MainContent;
