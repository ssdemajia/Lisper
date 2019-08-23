import VueRouter from 'vue-router';

const routes = [
    {
        path: '/', 
        component: () => import('./views/HomePage'),
    },
    {
        path: '/oauth',
        component: () => import('./views/OAuthPage')
    },
    {
        path: '/console',
        component: () => import('./views/Console')
    }
];

export default new VueRouter({
    routes,
    mode: 'history'
});