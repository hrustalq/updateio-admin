import { useMemo, type ComponentProps, type FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogIn, LogOut, User, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const GuestLinks = [
  {
    label: "Войти",
    href: "/login",
    icon: <LogIn className="w-4 h-4 mr-2" />,
  },
  {
    label: "Регистрация",
    href: "/register",
    icon: <UserPlus className="w-4 h-4 mr-2" />,
  },
];

const AuthenticatedLinks = [
  {
    label: "Профиль",
    href: "/profile",
    icon: <User className="w-4 h-4 mr-2" />,
  },
  {
    label: "Выйти",
    href: "/logout",
    icon: <LogOut className="w-4 h-4 mr-2" />,
  },
];

export const UserAvatar: FC<ComponentProps<"div">> = ({
  className,
  ...props
}) => {
  const { isAuthenticated } = useAuth();

  const links = useMemo(() => {
    if (isAuthenticated) {
      return AuthenticatedLinks;
    }
    return GuestLinks;
  }, [isAuthenticated]);

  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className="cursor-pointer hover:opacity-50 focus:opacity-50 transition-opacity"
          asChild
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {links.map((link) => (
            <DropdownMenuItem key={link.href} className="cursor-pointer">
              {link.icon}
              {link.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
