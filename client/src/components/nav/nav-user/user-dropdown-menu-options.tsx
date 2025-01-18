import { clientApi } from "@/common/api/client-api";
import { useLogout } from "@/common/services/auth/useLogout";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from "lucide-react";

const UserDropdownMenuOptions = () => {
  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <Sparkles />
          Upgrade to Pro
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <BadgeCheck />
          Account
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Bell />
          Notifications
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <LogOut onClick={async () => await clientApi.get("/auth/logout")} />
        Log out
      </DropdownMenuItem>
    </>
  );
};

export default UserDropdownMenuOptions;
