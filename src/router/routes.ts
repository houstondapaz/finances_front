import { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] =
    [
        {
            path: '/',
            component: () => import('@/layouts/MainLayout.vue'),
            children: [
                {
                    name: 'Home',
                    path: '',
                    component: () => import('@/views/HomeView.vue')
                },

                {
                    name: 'Transactions',
                    path: '/transactions',
                    component: () => import('@/views/TransactionsView.vue')
                }
            ]
        }
    ];
