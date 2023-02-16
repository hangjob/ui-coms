import '../../common/packages/style/reset.css'
import compSetup from '../../common/packages/components'
import {isVue3} from 'vue-demi'
const install = (app, options) => {
    console.log(isVue3)
    compSetup(app)
}


export default install;
