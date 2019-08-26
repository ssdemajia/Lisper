import VueRouter from 'vue-router';
import store from './store';
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
        component: () => import('./views/Console'),
    },
    {
        path: '/console/edit',
        component: () => import('./views/ConsoleEditor')
    }
];

const router =  new VueRouter({
    routes,
    mode: 'history'
});

router.beforeEach(async (to, from, next) => {
    if (to.path == '/oauth') {
        next()
        return;
    }
    if (to.path != '/') {
        if (store.getters.isLogging) {
            next();
            return;
        }
        const data = await store.dispatch('getInfo');
        console.log(data);

        next('/');
        return;
    }
    next();
})
export default router;