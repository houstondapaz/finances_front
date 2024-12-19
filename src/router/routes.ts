import { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] =
    [
        {
            path: '/',
            redirect: 'Transactions',
            component: () => import('@/layouts/MainLayout.vue'),
            children: [
                {
                    name: 'Transactions',
                    path: '/transactions',
                    component: () => import('@/views/TransactionsView.vue')
                }
            ]
        }
    ];
