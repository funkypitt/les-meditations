import categories from '#src/config/categories.js'
import Home from '#src/routes/home.vue';
import Category from '#src/routes/category.vue';

export default [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            title: 'Méditations guidées',
            note: 'd\'enpleineconscience.ch'
        }
    },
    {
        path: '/category/:slug',
        name: 'category',
        component: Category,
        meta (route) {
            console.log(route, '!!')
            const { name, recordings } = categories.find(category => category.slug === route.params.slug)
            return {
                back: true,
                title: name,
                note: `${recordings.length} enregistrements`
            }
        }
    }
]