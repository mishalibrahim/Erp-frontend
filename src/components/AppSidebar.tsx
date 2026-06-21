import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { TenantSwitcher } from "@/features/auth/components/TenantSwitcher";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type NavSubItem = {
  title: string;
  url: string;
};

type NavItem = {
  title: string;
  url: string;
  icon: any;
  isActive?: boolean;
  items?: NavSubItem[];
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "Home",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Accounting",
    items: [
      {
        title: "General Ledger",
        url: "#",
        icon: BookOpen,
        isActive: false,
        items: [
          {
            title: "Chart of Accounts",
            url: "/accounting/coa",
          },
          {
            title: "General Ledger",
            url: "/accounting/gl",
          },
          {
            title: "Journal Voucher",
            url: "/accounting/jv",
          },
        ],
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        title: "Company Setup",
        url: "/settings/company-setup",
        icon: Settings,
      },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center px-2 py-2 group-data-[collapsible=icon]:justify-center">
          <h3 className="text-lg font-semibold tracking-tight truncate group-data-[collapsible=icon]:hidden">
            Aegis ERP
          </h3>
          <div className="hidden group-data-[collapsible=icon]:flex font-bold">
            AE
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  if (item.items) {
                    const isAnySubActive = item.items.some(
                      (sub) =>
                        pathname === sub.url ||
                        pathname.startsWith(sub.url + "/"),
                    );

                    return (
                      <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.isActive || isAnySubActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              tooltip={item.title}
                              isActive={isAnySubActive}
                            >
                              <item.icon />
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={
                                      pathname === subItem.url ||
                                      pathname.startsWith(subItem.url + "/")
                                    }
                                  >
                                    <Link to={subItem.url}>
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={
                          pathname === item.url ||
                          (item.url !== "/" &&
                            pathname.startsWith(item.url + "/"))
                        }
                      >
                        <Link to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <TenantSwitcher />
      </SidebarFooter>
    </Sidebar>
  );
}
