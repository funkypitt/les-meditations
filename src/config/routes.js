import Home from '#src/routes/r-home.vue';
import Category from '#src/routes/r-category.vue';
import Downloads from '#src/routes/r-downloads.vue';

export default [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/downloads',
        name: 'downloads',
        component: Downloads
    },
    {
        path: '/category/:slug',
        name: 'category',
        component: Category
    }
]