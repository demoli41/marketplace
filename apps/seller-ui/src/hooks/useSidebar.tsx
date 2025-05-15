"use client";

import { useAtom } from 'jotai';
import { act } from 'react';
import { activeSidebarItem } from '../configs/constants';

const useSidebar = () => {

    const [activeSidebar, setActiveSidebar] = useAtom(activeSidebarItem);
    return {activeSidebar, setActiveSidebar};
}

export default useSidebar