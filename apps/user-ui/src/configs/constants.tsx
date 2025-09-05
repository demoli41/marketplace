export const navItems:NavItemsTypes[]=[
    {
        title: 'Головна',
        href: '/'
    },
    {
        title: 'Товари',
        href: '/products'
    },
    {
        title: 'Магазини',
        href: '/shops'
    },
    {
        title: 'Пропозиції',
        href: '/offers'
    },
    {
        title: 'Стати продавцем',
        href: `${process.env.NEXT_PUBLIC_SELLER_SERVER_URL}/signup`
    },
]