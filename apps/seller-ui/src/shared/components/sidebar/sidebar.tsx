'use client';

import useSeller from 'apps/seller-ui/src/hooks/useSeller';
import useSidebar from 'apps/seller-ui/src/hooks/useSidebar'
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react'
import Box from '../box';
import { Sidebar } from './sidebar.styles';
import Link from 'next/link';
import SidebarItem from './sidebar.item';
import { BellPlus, BellRing, CalendarPlus, Home, ListOrdered, LogOut, LogsIcon, Mail, PackageSearch, Settings, SquarePlus, Store, TicketPercent, Wallet2Icon } from 'lucide-react';
import SidebarMenu from './sidebar.menu';


const SideBarWrapper = () => {

    const { activeSidebar, setActiveSidebar } = useSidebar();
    const pathName = usePathname();
    const { seller } = useSeller();

    useEffect(() => {
        setActiveSidebar(pathName);
    }, [pathName, setActiveSidebar])

    const getIconColor = (route: string) => {
        return activeSidebar === route ? '#0085ff' : '#969696'
    }

    return (
        <Box css={{
            height: '100vh',
            zIndex: 202,
            position: 'sticky',
            padding: "8px",
            top: "0",
            overflowY: 'scroll',
            scrollbarWidth: 'none',
        }}
            className='sidebar-wrapper'
        >
            <Sidebar.Header>
                <Box>
                    <Link href={'/'} className='flex justify-center text-center gap-2'>
                        <LogsIcon />
                        <Box className='text-xl font-medium text-[#ecedee]'>
                            <h3>{seller?.shop?.name}</h3>
                            <h5 className='font-medium pl-2 text-xs text-[#ecedeecf] whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px]'>
                                {seller?.shop?.address}
                            </h5>
                        </Box>
                    </Link>
                </Box>
            </Sidebar.Header>
            <div className='block my-3 h-full'>
                <Sidebar.Body className='body sidebar'>
                    <SidebarItem
                        title='Dashboard'
                        icon={<Store fill={getIconColor("/dashboard")} />}
                        isActive={activeSidebar === '/dashboard'}
                        href='/dashboard'
                    />
                    <div className='mt-2 block'>
                        <SidebarMenu title='Головне меню'>
                            <SidebarItem
                                isActive={activeSidebar === '/dashboard/orders'}
                                title='Замовлення'
                                href="/dashboard/orders"
                                icon={
                                    <ListOrdered size={26} color={getIconColor("/dashboard/orders")} />
                                }
                            />
                            <SidebarItem
                                isActive={activeSidebar === '/dashboard/payments'}
                                title='Платежі'
                                href="/dashboard/payments"
                                icon={
                                    <Wallet2Icon size={26} color={getIconColor("/dashboard/payments")} />
                                }
                            />
                        </SidebarMenu>
                        <SidebarMenu title='Товари'>
                            <SidebarItem
                                isActive={activeSidebar === '/dashboard/create-product'}
                                title='Створити товар'
                                href="/dashboard/create-product"
                                icon={
                                    <SquarePlus size={26} color={getIconColor("/dashboard/create-product")} />
                                }
                            />
                            <SidebarItem
                                isActive={activeSidebar === '/dashboard/all-products'}
                                title='Усі товари'
                                href="/dashboard/all-products"
                                icon={
                                    <PackageSearch size={26} color={getIconColor("/dashboard/all-products")} />
                                }
                            />
                        </SidebarMenu>
                        <SidebarMenu title='Події'>
                            <SidebarItem
                                isActive={activeSidebar === '/dashboard/create-event'}
                                title='Створити подію'
                                href="/dashboard/create-event"
                                icon={
                                    <CalendarPlus size={26} color={getIconColor("/dashboard/create-event")} />
                                }
                            />
                            <SidebarItem
                                isActive={activeSidebar === '/dashboard/all-events'}
                                title='Усі події'
                                href="/dashboard/all-events"
                                icon={
                                    <BellPlus size={26} color={getIconColor("/dashboard/all-events")} />
                                }
                            />
                        </SidebarMenu>
                        <SidebarMenu title='Управління'>
                            <SidebarItem
                                isActive={activeSidebar === '/dashboard/inbox'}
                                title='Вхідні'
                                href="/dashboard/inbox"
                                icon={
                                    <Mail size={26} color={getIconColor("/dashboard/inbox")} />
                                }
                            />
                            <SidebarItem
                                isActive={activeSidebar === '/dashboard/settings'}
                                title='Налаштування'
                                href="/dashboard/settings"
                                icon={
                                    <Settings size={26} color={getIconColor("/dashboard/settings")} />
                                }
                            />
                            <SidebarItem
                                isActive={activeSidebar === '/dashboard/notifications'}
                                title='Повідомлення'
                                href="/dashboard/notifications"
                                icon={
                                    <BellRing size={26} color={getIconColor("/dashboard/notifications")} />
                                }
                            />
                        </SidebarMenu>
                        <SidebarMenu title='Додаткові послуги'>
                            <SidebarItem
                                isActive={activeSidebar === '/dashboard/discount-codes'}
                                title='Коди знижок'
                                href="/dashboard/discount-codes"
                                icon={
                                    <TicketPercent size={26} color={getIconColor("/dashboard/discount-codes")} />
                                }
                            />
                            <SidebarItem
                                isActive={activeSidebar === '/logout'}
                                title='Вихід'
                                href="/logout"
                                icon={
                                    <LogOut size={26} color={getIconColor("/logout")} />
                                }
                            />
                        </SidebarMenu>
                    </div>
                </Sidebar.Body>
            </div>
        </Box>
    )
}

export default SideBarWrapper