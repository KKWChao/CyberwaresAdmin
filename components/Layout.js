import Nav from "@/components/Nav";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import Logo from "./Logo";
import { redirect } from "next/dist/server/api-utils";

export default function Layout({ children }) {
  const { data: session } = useSession();
  const [showNav, setShowNav] = useState(false);

  // Auth for access
  if (!session) {
    return (
      <div className="bg-bgGray w-screen h-screen flex items-center">
        <div className="w-full h-full flex justify-center items-center">
          <div className="flex flex-col p-10 bg-gray-200  rounded-md shadow-md">
            <h1 className=" font-semibold">Ecommerce Admin</h1>
            <button className="btn-primary " onClick={() => signIn("google")}>
              Login with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bgGray min-h-screen contain">
      <div className="md:hidden flex items-center p-4">
        <button onClick={() => setShowNav(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>

      <div className="flex">
        <Nav show={showNav} />
        <div className="flex-grow p-4 transition">{children}</div>
      </div>
    </div>
  );
}
