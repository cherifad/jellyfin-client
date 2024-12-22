import Link from "next/link";

interface MenuItemProps {
  title: string;
  link: string;
}

export default function MenuItem({ title, link }: MenuItemProps) {
  return <Link href={link}>{title}</Link>;
}
