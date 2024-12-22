import Image from "next/image";
import Link from "next/link";
import { NavUser } from "./user";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import MenuItem from "./menu-item";
import { forwardRef } from "react";

const menuItems = [
  { title: "Home", link: "/" },
  { title: "Movies", link: "/movies" },
  { title: "Shows", link: "/shows" },
  //   { title: "Music", link: "/music" },
  //   { title: "Settings", link: "/settings" },
];

const Header = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <header ref={ref} className="flex justify-between items-center py-4 fixed top-0 left-0 w-screen z-50">
      <div className="flex items-center">
        {/* <Image src="/logo.svg" alt="Jellyfin Logo" width={40} height={40} /> */}
        <h1 className="text-2xl font-bold ml-2">Jellyfin</h1>
        <nav className="ml-4 space-x-4">
          {menuItems.map((item) => (
            <MenuItem key={item.title} title={item.title} link={item.link} />
          ))}
        </nav>
      </div>
      <div className="flex flex-1 justify-end items-center gap-2">
        <Button size="icon" variant="blurred" className="rounded-full h-10 w-10">
          <Bell className="" />
        </Button>
        <NavUser
          user={{
            name: "John Doe",
            email: "test@mail.com",
            avatar: "https://avatars.dicebear.com/api/avataaars/john-doe.svg",
          }}
        />
      </div>
    </header>
  );
});

export default Header;
