// src/components/authComponents/AuthFooterLinks.tsx
import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
}

interface AuthFooterLinksProps {
  links: FooterLink[];
}

const AuthFooterLinks = ({ links }: AuthFooterLinksProps) => {
  return (
    <div className="flex items-center justify-center gap-6">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm text-[#5C6B69]/60 transition-colors hover:text-[#5C6B69]"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default AuthFooterLinks;