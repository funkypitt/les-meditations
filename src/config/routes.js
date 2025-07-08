import RouteHome from '#src/routes/r-home.vue';
import RouteCategory from '#src/routes/r-category.vue';
import RouteDownloads from '#src/routes/r-downloads.vue';
import Route404 from '#src/routes/r-404.vue';

export default [
  {
    path: '/',
    name: 'home',
    component: RouteHome
  },
  {
    path: '/downloads',
    name: 'downloads',
    component: RouteDownloads
  },
  {
    path: '/category/:slug',
    name: 'category',
    component: RouteCategory
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: Route404
  },
]