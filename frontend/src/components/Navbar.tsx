import { Link, NavLink } from "react-router";

export default function Navbar() {
  return (
    <nav className="bg-dark-100/60 backdrop-blur-md py-4 px-24 border-b border-gradient flex items-center justify-between">
      <figure className="flex gap-4 items-center">
        <Link to="/" className="uppercase text-lg font-semibold">Fonta~Manager</Link>
        <div className="bg-light-200 font-semibold w-fit rounded-full px-4 py-1 text-pink-700">
          v1.0
        </div>
      </figure>
      <ul className="flex gap-8">
        <NavLink to="/" className={({ isActive }) => (isActive ? __navstyleactive : __navstyle)}>Installer</NavLink>
        <NavLink to="/font-manager" className={({ isActive }) => (isActive ? __navstyleactive : __navstyle)} >Font Scanner</NavLink>
      </ul>
    </nav>
  );
}

const __navstyleactive = `text-pink-400 hover:text-pink-200  transition-all`;
const __navstyle = `text-light-100 hover:text-light-200 transition-all`;