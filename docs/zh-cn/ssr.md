# SSR 的支持

SSR 的支持目前还处于 beta 阶段. 如果想尝试的话，需要安装一个特殊的版本.

```
npm i --save vue-data-tables@ssr
```

然后在你的 SSR 项目里，你需要导入 `data-tables.server.js` 文件.

```
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { DataTables } from 'vue-data-tables/dist/data-tables.server'

Vue.use(ElementUI)
Vue.use(DataTables)
```

就这样，试试吧。:-)
