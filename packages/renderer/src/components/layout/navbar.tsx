import { navItems } from "@/data/ui.data";
import { useActionMapper } from "@/shared/hooks/useActionMapper";
import type { NavItem } from "@/shared/types/ui.types";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from "@heroui/react";

export default function NavBar() {
  const actionMapper = useActionMapper();

  const handleNavItemClick = (subItem: NavItem) => {
    if (subItem.action) actionMapper[subItem.action]();
    console.log("Performed action");
  };

  return (
    <div className="flex flex-row items-center">
      <div className="text-2xl font-bold text-blue-700 p-2">Aura</div>
      {/* render nav items and dropdowns */}
      <nav className="flex flex-row items-center">
        {navItems.map((item) => (
          <Dropdown
            key={item.title}
            className="bg-black/80 rounded-none p-0"
            placement="bottom-end"
          >
            <DropdownTrigger className="px-3 py-1 hover:bg-neutral-800 cursor-pointer">
              <h2>{item.title}</h2>
            </DropdownTrigger>
            {item.dropdown && (
              <DropdownMenu className="p-0">
                {item.dropdown.map((subItem) => (
                  <DropdownItem
                    key={subItem.title}
                    className="bg-transparent text-white !hover:bg-neutral-800/80 rounded-none"
                    classNames={{
                      wrapper: "!hover:bg-transparent",
                      base: "!hover:bg-transparent",
                      description: "!hover:bg-transparent",
                    }}
                    onClick={() => handleNavItemClick(subItem)}
                  >
                    {subItem.title}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            )}
          </Dropdown>
        ))}
      </nav>
    </div>
  );
}
