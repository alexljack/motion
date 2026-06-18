import { Link, useRouter } from "@tanstack/react-router";
import { XIcon } from "lucide-react";
import { useEffect } from "react";
import { navLinks } from "../sidebar/links";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

const MobileNav = ({ open, onClose }: MobileNavProps) => {
  const router = useRouter();

  // Close on route change
  useEffect(() => {
    return router.subscribe("onBeforeLoad", onClose);
  }, [router, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`lg:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 z-50 h-dvh w-64 bg-white flex flex-col py-4 px-3 transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center justify-center bg-orange-600 text-white italic size-12 text-2xl select-none">
            <span className="font-semibold">M</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <XIcon size={22} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 [&.active]:bg-orange-50 [&.active]:text-orange-600 [&.active]:font-semibold transition-colors"
            >
              <link.icon size={20} />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default MobileNav;
