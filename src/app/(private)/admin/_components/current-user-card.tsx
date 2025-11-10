
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserRoleEnum } from "@/utils/constant";
import { Calendar } from "lucide-react";
import { CreateNewUserButton } from "./create-new-user";
import UserRoleBadge from "./user-badge";

const getUserInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
};

const getRoleBadgeVariant = (role: UserRoleEnum) => {
    switch (role.toLowerCase()) {
        case UserRoleEnum.ADMIN:
            return "default";
        case UserRoleEnum.TADMIN:
            return "default";

        case UserRoleEnum.TVENDOR:
            return "secondary";
        case UserRoleEnum.VENDOR:
            return "secondary";
        case UserRoleEnum.BOSS:
            return "outline";
        default:
            return "outline";
    }
};

const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

interface UserProfileCardProps {
    user: {
        id: string;
        name: string;
        email: string;
        image: string | null | undefined;
        createdAt: Date;
        role: string | null | undefined;
        vendorId: string | null | undefined;
    };
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
    return (
        <div className="w-full   ">
            <div className="bg-card/80 border border-border/90    p-5 sm:p-6 lg:p-8 transition-all duration-300 ">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-start gap-4 w-full">

                        <div className=" flex items-center flex-col justify-center gap-y-4">
                            <Avatar className="w-16 h-16 sm:w-20 sm:h-20 ring-2 ring-border/30">
                                <AvatarImage src={user.image!} alt={user.name} className="object-cover" />
                                <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                                    {getUserInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>

                            <div
                                className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium"

                            >
                                <UserRoleBadge role={user.role!} />

                            </div>

                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <h2 className="text-2xl sm:text-3xl font-bold text-foreground truncate flex flex-wrap gap-0 md:gap-1">
                                    <span>{getGreeting()},</span><span className="text-primary">{user.name}</span>
                                </h2>
                                <div
                                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium"
                                >
                                    <UserRoleBadge role={user.role!} />
                                </div>
                            </div>
                            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                                <p className="truncate">
                                    <span className="sr-only">Email: </span>
                                    {user.email}
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    <span>Joined {formatDate(user.createdAt)}</span>
                                </div>
                                {user.vendorId && (
                                    <span className="inline-flex items-center px-2.5 py-1 bg-muted/30 text-xs font-medium ">
                                        Vendor: {user.vendorId}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex-shrink-0 w-full lg:w-auto">
                        <CreateNewUserButton />
                    </div>
                </div>
            </div>
        </div>
    );
}