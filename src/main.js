import './assets/main.css';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css';
import 'quasar/src/css/index.sass';
import { createApp } from 'vue';
import { Quasar } from 'quasar';
import App from './App.vue'
import router from './router'

const app = createApp(App);
app.use(Quasar).use(router);
// app.use(router)

app.mount('#app')
