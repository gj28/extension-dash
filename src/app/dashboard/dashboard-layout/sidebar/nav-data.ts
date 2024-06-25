import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [
    {
        routeLink: 'overview',
        icon: 'home',
        label: 'Post Job',
        UserType:'Admin',
    },
    {
        routeLink: 'analysis',
        icon: 'analytics',
        label: 'Applications',
        UserType:'Admin',
    },
    {
        routeLink: 'profile',
        icon: 'account_circle',
        label: 'Profile',
        UserType:'Admin',
    },
    {
        routeLink: 'settings',
        icon: 'dashboard',
        label: 'Activity',
        UserType:'Standard',
    },
    {
        routeLink: 'report',
        icon: 'cloud',
        label: 'Report',
        UserType:'Admin',
    },
    {
        routeLink: 'email',
        icon: 'flip_to_front',
        label: 'Email',
        UserType:'Admin',
    },
];