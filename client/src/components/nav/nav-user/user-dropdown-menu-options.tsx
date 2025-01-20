"use client";

import { clientApi } from "@/common/api/client-api";
import { useLogout } from "@/common/services/auth/useLogout";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useSession, signIn, signOut } from "next-auth/react";
import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from "lucide-react";

const UserDropdownMenuOptions = () => {
  const { data: session } = useSession();

  console.log(session);

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
      <DropdownMenuItem
        onClick={async () => {
          console.log("logout");

          await clientApi.get("/auth/logout");
        }}
      >
        <LogOut />
        Log out
      </DropdownMenuItem>
    </>
  );
};

export default UserDropdownMenuOptions;
