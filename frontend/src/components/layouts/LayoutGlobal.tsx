import { Outlet } from "react-router";
import Navbar from "../Navbar";

export default function LayoutGlobal() {
  return (
    <main className='container relative flex flex-col mx-auto min-h-fit text-light-100'>
      <Navbar />
      <main className="px-4 md:px-8 lg:px-16 xl:px-20">
        <Outlet />
      </main>
      <div className="w-[3000px] h-[3000px] fixed top-[40%] blur-[100px] rounded-full mx-auto right-[-50%] -z-10 bg-gradient-to-b from-pink-500/20 to-white/20"></div>
      {/* <img src="/images/bg-gradient.png" className="fixed top-[30%] opacity-60 -z-10 left-0" alt="" /> */}
    </main>
  )
}