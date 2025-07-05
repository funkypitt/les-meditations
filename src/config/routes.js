import Index from '#src/routes/index.vue';
import Category from '#src/routes/category.vue';

export default [
    {
        path: '/',
        name: 'home',
        component: Index
    },
    {
        path: '/category/:category',
        name: 'category',
        component: Category
    }
]