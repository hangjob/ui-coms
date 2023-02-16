import '../../../common/packages/style/reset.css'
import compSetup from '../../../common/packages/components'
import {isVue2, isVue3} from "vue-demi"

const install = (app) => {
    console.log('vue2', isVue2)
    console.log('vue3', isVue3)
    compSetup(app)
}


export default install;
