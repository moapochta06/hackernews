import {createRouter, createWebHistory} from 'vue-router'; 

export default createRouter({
    history: createWebHistory(),
    routes:[
        {
            path: '/', 
            name: 'home',
            component: ()=> import('@/pages/news-list/news-list-page.vue')
        },
        {
            path: '/news/:id',
            name: 'news',
            component: ()=> import('@/pages/news-pages/news-page.vue'),
            params: true
        }
    ]
})
