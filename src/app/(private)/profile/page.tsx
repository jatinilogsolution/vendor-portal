
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUpIcon, UsersIcon, DollarSignIcon, ActivityIcon, Edit2Icon, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getCustomSession } from "@/actions/auth.action";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VendorAddressCard } from "./_components/address-form";

export default async function Profile() {

  const { session, user } = await getCustomSession();

  if (!session) {
    await auth.api.signOut({
      headers: await headers()
    });
    redirect("/auth/login")
  }else if(!user.vendorId){
    return <div>not a trasporter</div>
  }

 

const address = await prisma.vendor.findFirst({
  where:{
    id: user.vendorId
  },
  select:{
    id: true,
    Address: true
  }
})
  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Profile</h1>
        <div className="flex gap-2">
          <Button variant="secondary"><Edit2Icon color="blue" /> Edit Profile</Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Profile Card */}
        <Card className="w-full lg:w-1/4 max-h-[300px]">
          <CardContent className="p-6">
            <div className=" relative flex flex-col items-center text-center">
              <Avatar className="size-28 mb-4">
                <AvatarImage
                  src={user.image ?? ""}
                  alt={user.name}
                />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                  }
                </AvatarFallback>
              </Avatar>
              <h2 className="text-lg font-semibold">{user.name}</h2>

              <Badge variant={"outline"}   >{user.email}</Badge>
              <Badge className=" absolute bottom-16" variant={"default"} >{user.role}</Badge>

            </div>
          </CardContent>
        </Card>
 
           <VendorAddressCard vendorId={user.vendorId}  />
        </div>
     </div>
  );
}
