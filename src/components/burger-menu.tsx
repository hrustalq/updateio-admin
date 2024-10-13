import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import {
  Menu,
  PlusCircle,
  Gamepad,
  Users,
  BarChart2,
  ChevronRight,
  ChevronDown,
  Bot,
  ListIcon,
  RefreshCw,
  Server,
  UserPlus,
  FileText,
  Download,
  AlertTriangle,
  Activity,
  Moon,
  Sun,
  ToggleLeftIcon,
  ToggleRight,
  Settings,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";
import { useTheme } from "@/hooks/use-theme";

// Добавляем иконки для Discord и Telegram
const DiscordIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"
    />
  </svg>
);

const TelegramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627c-.168.9-.499 1.201-.82 1.23c-.696.065-1.225-.46-1.9-.902c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.78-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345c-.48.33-.913.49-1.302.48c-.428-.008-1.252-.241-1.865-.44c-.752-.245-1.349-.374-1.297-.789c.027-.216.325-.437.893-.663c3.498-1.524 5.83-2.529 6.998-3.014c3.332-1.386 4.025-1.627 4.476-1.635z"
    />
  </svg>
);

// Update the menuItems structure
const menuItems = [
  {
    label: "Игры",
    icon: Gamepad,
    description: "Управление играми, приложениями и обновлениями.",
    quickActions: [
      {
        label: "Добавить приложеие",
        to: "/games/apps?action=add",
        icon: Server,
      },
      { label: "Добавить игру", to: "/games?action=add", icon: PlusCircle },
    ],
    subItems: [
      { to: "/games", label: "Список игр", icon: ListIcon },
      { to: "/games/updates", label: "Обновления", icon: RefreshCw },
      { to: "/games/apps", label: "Приложения", icon: Server },
    ],
  },
  {
    label: "Пользователи",
    icon: Users,
    description: "Управление пользователями, группами и правами доступа.",
    quickActions: [
      {
        label: "Добавить пользователя",
        to: "/users/list?action=add",
        icon: UserPlus,
      },
      {
        label: "Создать группу",
        to: "/users/groups?action=add",
        icon: Users,
      },
    ],
    subItems: [
      { to: "/users/list", label: "Список пользователей", icon: ListIcon },
      { to: "/users/groups", label: "Группы пользователей", icon: Users },
      { to: "/users/permissions", label: "Права доступа", icon: FileText },
    ],
  },
  {
    label: "Статистика",
    icon: BarChart2,
    description: "Просмотр логов ошибок и игровых сессий.",
    quickActions: [
      {
        label: "Экспорт логов",
        to: "/statistics?action=export",
        icon: Download,
      },
    ],
    subItems: [
      {
        to: "/statistics/error-logs",
        label: "Логи ошибок",
        icon: AlertTriangle,
      },
      { to: "/statistics/game-logs", label: "Логи игр", icon: Activity },
    ],
  },
  {
    label: "Управление ботами",
    icon: Bot,
    description: "Управление ботами, настройка и мониторинг.",
    quickActions: [
      {
        label: "Discord бот",
        to: "/bots/discord",
        icon: DiscordIcon,
      },
      {
        label: "Telegram бот",
        to: "/bots/telegram",
        icon: TelegramIcon,
      },
    ],
    subItems: [
      { to: "/bots", label: "Список ботов", icon: ListIcon },
      { to: "/bots/settings", label: "Общие настройки", icon: Settings },
    ],
  },
];

export const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const [focusedItemIndex, setFocusedItemIndex] = useState(-1);
  const [isMouseInteraction, setIsMouseInteraction] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const submenuItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenDesktopMenu(null);
        setFocusedItemIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (openDesktopMenu && focusedItemIndex === -1 && !isMouseInteraction) {
      setFocusedItemIndex(0);
    }
  }, [focusedItemIndex, openDesktopMenu, isMouseInteraction]);

  useEffect(() => {
    if (focusedItemIndex !== -1 && submenuItemsRef.current[focusedItemIndex]) {
      submenuItemsRef.current[focusedItemIndex]?.focus();
    }
  }, [focusedItemIndex]);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenDesktopMenu(label);
    setFocusedItemIndex(-1);
    setIsMouseInteraction(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDesktopMenu(null);
      setFocusedItemIndex(-1);
      setIsMouseInteraction(false);
    }, 300);
  };

  const handleKeyDown = (event: React.KeyboardEvent, label: string) => {
    setIsMouseInteraction(false);
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpenDesktopMenu(openDesktopMenu === label ? null : label);
      setFocusedItemIndex(-1);
    } else if (openDesktopMenu === label) {
      const currentItem = menuItems.find((item) => item.label === label);
      const totalItems =
        (currentItem?.quickActions?.length || 0) +
        (currentItem?.subItems?.length || 0);

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setFocusedItemIndex((prevIndex) => (prevIndex + 1) % totalItems);
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedItemIndex(
            (prevIndex) => (prevIndex - 1 + totalItems) % totalItems,
          );
          break;
        case "Tab":
          if (!event.shiftKey) {
            event.preventDefault();
            setFocusedItemIndex((prevIndex) => (prevIndex + 1) % totalItems);
          } else {
            event.preventDefault();
            setFocusedItemIndex(
              (prevIndex) => (prevIndex - 1 + totalItems) % totalItems,
            );
          }
          break;
        case "Escape":
          event.preventDefault();
          setOpenDesktopMenu(null);
          setFocusedItemIndex(-1);
          break;
      }
    }
  };

  return (
    <div
      className="relative lg:flex items-center flex-1 lg:flex-grow-[3]"
      ref={menuRef}
    >
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTitle hidden>Навигация</SheetTitle>
        <SheetDescription hidden>Навигация</SheetDescription>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-full size-10"
          >
            <Menu className="size-8" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-full sm:max-w-none p-0 flex flex-col"
        >
          <nav className="flex-1 flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Меню</h2>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence initial={false} mode="wait">
                {activeSubmenu ? (
                  <motion.div
                    key="submenu"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "tween", duration: 0.2 }}
                    className="absolute inset-0 bg-background overflow-y-auto"
                  >
                    <div className="p-4 border-b flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setActiveSubmenu(null)}
                        className="mr-2"
                      >
                        <ChevronRight className="rotate-180" />
                      </Button>
                      <h2 className="text-lg font-semibold">{activeSubmenu}</h2>
                    </div>
                    <ul className="p-4">
                      {menuItems
                        .find((item) => item.label === activeSubmenu)
                        ?.subItems?.map((subItem) => (
                          <li key={subItem.label} className="mb-2">
                            <Link
                              to={subItem.to}
                              className="flex items-center p-2 rounded-md hover:bg-accent"
                              onClick={() => {
                                setActiveSubmenu(null);
                                setIsOpen(false);
                              }}
                            >
                              <subItem.icon className="mr-3 h-5 w-5" />
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </motion.div>
                ) : (
                  <motion.div
                    key="mainmenu"
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "tween", duration: 0.2 }}
                    className="absolute inset-0 bg-background overflow-y-auto"
                  >
                    <ul>
                      {menuItems.map((item) => (
                        <li
                          key={item.label}
                          className="border-b last:border-b-0"
                        >
                          <button
                            className="w-full p-4 flex items-center justify-between hover:bg-accent"
                            onClick={() => setActiveSubmenu(item.label)}
                          >
                            <span className="flex items-center">
                              <item.icon className="mr-3 h-5 w-5" />
                              {item.label}
                            </span>
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="p-4 border-t absolute inset-x-0 bottom-10">
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-between px-4"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <span className="flex items-center">
                  {theme === "dark" ? (
                    <Moon className="mr-2 h-4 w-4" />
                  ) : (
                    <Sun className="mr-2 h-4 w-4" />
                  )}
                  {theme === "dark" ? "Темная тема" : "Светлая тема"}
                </span>
                {theme === "dark" ? (
                  <ToggleLeftIcon className="size-5" />
                ) : (
                  <ToggleRight className="size-5" />
                )}
              </Button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop menu */}
      <nav
        className="hidden lg:flex lg:flex-1 max-w-full"
        aria-label="Главное меню"
      >
        <ul className="w-full flex justify-around" role="menubar">
          {menuItems.map((item) => (
            <li
              key={item.label}
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.label)}
              onMouseLeave={handleMouseLeave}
              role="none"
            >
              <button
                className="text-base font-medium px-4 py-2 hover:bg-accent rounded-md transition-colors flex items-center"
                onClick={() =>
                  setOpenDesktopMenu(
                    openDesktopMenu === item.label ? null : item.label,
                  )
                }
                onKeyDown={(e) => handleKeyDown(e, item.label)}
                aria-haspopup="true"
                aria-expanded={openDesktopMenu === item.label}
                role="menuitem"
              >
                <item.icon className="mr-2 h-4 w-4" aria-hidden="true" />
                {item.label}
                <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
              </button>
              <AnimatePresence>
                {openDesktopMenu === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute left-0 w-[500px] mt-2"
                    style={{ transform: "translateX(-25%)" }}
                    role="menu"
                    aria-label={`Подменю ${item.label}`}
                  >
                    <div className="grid gap-3 p-5 bg-popover rounded-md shadow-md lg:grid-cols-[.75fr_1fr] border border-border">
                      <div className="row-span-3">
                        <h3
                          className="font-medium leading-none mb-2 flex items-center"
                          id={`${item.label}-heading`}
                        >
                          <item.icon
                            className="mr-2 h-5 w-5"
                            aria-hidden="true"
                          />
                          {item.label}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {item.description}
                        </p>
                        {item.quickActions?.map((action, actionIndex) => (
                          <Button
                            key={actionIndex}
                            variant="outline"
                            className={cn(
                              "w-full justify-start mb-2",
                              focusedItemIndex === actionIndex &&
                                !isMouseInteraction &&
                                "ring-2 ring-ring ring-offset-2 ring-offset-background",
                            )}
                            asChild
                          >
                            <Link
                              to={action.to}
                              role="menuitem"
                              ref={(el) =>
                                (submenuItemsRef.current[actionIndex] = el)
                              }
                              tabIndex={
                                focusedItemIndex === actionIndex ? 0 : -1
                              }
                              onKeyDown={(e) => handleKeyDown(e, item.label)}
                            >
                              <action.icon
                                className="mr-2 h-4 w-4"
                                aria-hidden="true"
                              />
                              {action.label}
                            </Link>
                          </Button>
                        ))}
                      </div>
                      <ul
                        className="col-span-1"
                        role="menu"
                        aria-labelledby={`${item.label}-heading`}
                      >
                        {item.subItems?.map((subItem, subIndex) => (
                          <ListItem
                            key={subItem.label}
                            title={subItem.label}
                            href={subItem.to}
                            icon={subItem.icon}
                            role="menuitem"
                            ref={(el) =>
                              (submenuItemsRef.current[
                                (item.quickActions?.length || 0) + subIndex
                              ] = el)
                            }
                            tabIndex={
                              focusedItemIndex ===
                              (item.quickActions?.length || 0) + subIndex
                                ? 0
                                : -1
                            }
                            onKeyDown={(e) => handleKeyDown(e, item.label)}
                            className={cn(
                              focusedItemIndex ===
                                (item.quickActions?.length || 0) + subIndex &&
                                !isMouseInteraction &&
                                "ring-2 ring-ring ring-offset-2 ring-offset-background",
                            )}
                          />
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string;
  href: string;
  icon?: React.ElementType;
}

const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
  ({ className, title, href, icon: Icon, ...props }, ref) => {
    return (
      <li role="none">
        <Link
          ref={ref}
          to={href}
          className={cn(
            "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          role="menuitem"
          {...props}
        >
          <div className="text-sm font-medium leading-none flex items-center">
            {Icon && <Icon className="mr-2 h-4 w-4" aria-hidden="true" />}
            {title}
          </div>
        </Link>
      </li>
    );
  },
);
ListItem.displayName = "ListItem";
