# SSR support

SSR support is currently in beta. To leverage it, you need install a special version.

```
npm i --save vue-data-tables@ssr
```

import file `data-tables.server.js` in your SSR project.

```
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { DataTables } from 'vue-data-tables/dist/data-tables.server'

Vue.use(ElementUI)
Vue.use(DataTables)
```

That's it ~ Enjoy! :-)
