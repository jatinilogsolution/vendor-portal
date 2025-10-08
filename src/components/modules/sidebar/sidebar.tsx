"use client"
import React, { useState } from 'react'

import {
    Dropdown,
    DropdownButton,
    DropdownDivider,
    DropdownItem,
    DropdownLabel,
    DropdownMenu,
} from '@/components/dropdown'
import {
    Sidebar,
    SidebarBody,
    SidebarFooter,
    SidebarHeader,
    SidebarItem,
    SidebarLabel,
    SidebarSection,
    SidebarSpacer,
} from '@/components/sidebar'
import {
    ArrowRightStartOnRectangleIcon,
    ChevronUpIcon,
    Cog8ToothIcon,

    ShieldCheckIcon,
    StarIcon,
    UserIcon,
} from '@heroicons/react/16/solid'
import {
    Cog6ToothIcon,
    HomeIcon,
    Square2StackIcon,
    TicketIcon,
    DocumentCurrencyRupeeIcon
} from '@heroicons/react/20/solid'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from '@/lib/auth-client'
import { toast } from 'sonner'
import { UserRoleEnum } from '@/utils/constant'
import { Avatar, } from '@/components/avatar'

const SidebarComponent = () => {

    const { data } = useSession()
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();
    const pathname = usePathname()


    async function handleClick() {
        await signOut({
            fetchOptions: {
                onRequest: () => {
                    setIsPending(true);
                },
                onResponse: () => {
                    setIsPending(false);
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
                onSuccess: () => {
                    toast.success("You’ve logged out. See you soon!");
                    router.push("/auth/login");
                },
            },
        });
    }
    return (
        <Sidebar>
            <SidebarHeader>
                <div className='rounded-md bg-foreground/40'>
                    <p className=' text-center text-white bg-background/80 font-bold  text-base/10 ' >
                        <SidebarLabel>  Vendor Portal</SidebarLabel>
                    </p>
                </div>
            </SidebarHeader>
            <SidebarBody>
                <SidebarSection>

                    <SidebarItem href="/dashboard" current={pathname === '/dashboard'}>
                        <HomeIcon />
                        <SidebarLabel>Dashboard</SidebarLabel>
                    </SidebarItem>
                    <SidebarItem href="/lorry" current={pathname === '/lorry'}>
                        <Square2StackIcon />
                        <SidebarLabel>Lorry Receipt</SidebarLabel>
                    </SidebarItem>
                    <SidebarItem href="/orders" current={pathname === '/orders'}>
                        <TicketIcon />
                        <SidebarLabel>Orders</SidebarLabel>
                    </SidebarItem>
                    <SidebarItem href="/invoices" current={pathname === '/invoices'}>
                        <DocumentCurrencyRupeeIcon />
                        <SidebarLabel>Invoices</SidebarLabel>
                    </SidebarItem>
                    <SidebarItem href="/settings" current={pathname === '/settings'}>
                        <Cog6ToothIcon />
                        <SidebarLabel>Settings</SidebarLabel>
                    </SidebarItem>
                    {/* <SidebarSection>
              <SidebarItem href="/" current={pathname === '/'}>
                <HomeIcon />
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/events" current={pathname.startsWith('/events')}>
                <Square2StackIcon />
                <SidebarLabel>Events</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/orders" current={pathname.startsWith('/orders')}>
                <TicketIcon />
                <SidebarLabel>Orders</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/settings" current={pathname.startsWith('/settings')}>
                <Cog6ToothIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
            </SidebarSection> */}

                </SidebarSection>
                {/* <SidebarSection className="max-lg:hidden">
                    <SidebarHeading>Upcoming Events</SidebarHeading>
                    <SidebarItem href="/events/1">Bear Hug: Live in Concert</SidebarItem>
                    <SidebarItem href="/events/2">Viking People</SidebarItem>
                    <SidebarItem href="/events/3">Six Fingers — DJ Set</SidebarItem>
                    <SidebarItem href="/events/4">We All Look The Same</SidebarItem>
                </SidebarSection> */}
                <SidebarSpacer />
                <SidebarSection>
                    {/* <SidebarItem href="/support">
                        <QuestionMarkCircleIcon />
                        <SidebarLabel>Support</SidebarLabel>
                    </SidebarItem>
                    <SidebarItem href="/changelog">
                        <SparklesIcon />
                        <SidebarLabel>Changelog</SidebarLabel>
                    </SidebarItem> */}
                    {[UserRoleEnum.BOSS, UserRoleEnum.ADMIN, UserRoleEnum.TADMIN].includes(data?.user?.role as UserRoleEnum) && <SidebarItem href="/admin" current={pathname === '/admin'}>
                        <StarIcon />
                        <SidebarLabel>Admin</SidebarLabel>
                    </SidebarItem>}
                </SidebarSection>
            </SidebarBody>
            <SidebarFooter className="max-lg:hidden">
                <Dropdown>
                    <DropdownButton as={SidebarItem}>
                        <span className="flex min-w-0 items-center gap-3">

                                       <Avatar src="/profile-photo.jpg" square alt='logo' />
                           
                            <span className="min-w-0">
                                <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">{data?.user.name}</span>
                                <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                                    {data?.user.email}
                                </span>
                            </span>
                        </span>
                        <ChevronUpIcon />
                    </DropdownButton>
                    <DropdownMenu className="min-w-64" anchor="top start">
                        <DropdownItem href="/profile">
                            <UserIcon />
                            <DropdownLabel>My profile</DropdownLabel>
                        </DropdownItem>
                        <DropdownItem href="/settings">
                            <Cog8ToothIcon />
                            <DropdownLabel>Settings</DropdownLabel>
                        </DropdownItem>
                        <DropdownDivider />
                        <DropdownItem href="/privacy-policy">
                            <ShieldCheckIcon />
                            <DropdownLabel>Privacy policy</DropdownLabel>
                        </DropdownItem>
                        {/* <DropdownItem href="/share-feedback">
                            <LightBulbIcon />
                            <DropdownLabel>Share feedback</DropdownLabel>
                        </DropdownItem> */}
                        <DropdownDivider />


                        <DropdownItem onClick={handleClick} disabled={isPending} className={isPending ? "opacity-50 pointer-events-none" : ""}>
                            <ArrowRightStartOnRectangleIcon />
                            <DropdownLabel>Sign out</DropdownLabel>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </SidebarFooter>
        </Sidebar>
    )
}

export default SidebarComponent