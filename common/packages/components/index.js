import PmBigdataContainer from './BigdataContainer.vue' // 容器组件
import PmTest from './Test.vue'

const comps = {
    PmBigdataContainer,
    PmTest
}
const compSetup = (app) => {
    Object.keys(comps).forEach((item) => {
        const str = item.replace(item[0], item[0].toLowerCase());
        const name = str.replace(/([A-Z])/g, "-$1").toLowerCase();
        app.component(name, comps[item])
    })
}

export default compSetup;
