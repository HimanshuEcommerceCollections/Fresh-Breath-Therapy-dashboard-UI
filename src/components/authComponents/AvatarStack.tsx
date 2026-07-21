// src/components/authComponents/AvatarStack.tsx
import Image from "next/image";
import { AvatarStackItem } from "@/src/data/authData/authBrandData";

interface AvatarStackProps {
  avatars: AvatarStackItem[];
}

const AvatarStack = ({ avatars }: AvatarStackProps) => {
  return (
    <div className="flex items-center">
      {avatars.map((avatar, index) => (
        <div
          key={avatar.id}
          className="relative -ml-2 h-8 w-8 overflow-hidden rounded-full ring-2 ring-white/70 first:ml-0"
          style={{
            backgroundColor: avatar.bg,
            zIndex: avatars.length - index,
          }}
        >
          {avatar.imageUrl && (
            <Image
              src={avatar.imageUrl}
              alt=""
              fill
              sizes="32px"
              className="object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default AvatarStack;