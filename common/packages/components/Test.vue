<template>
	<div>
		这是一个测试组件
		<slot></slot>
	</div>
</template>
<script>
import {defineComponent} from "vue-demi";

export default defineComponent({
	created() {
		console.log(1)
		this.init()
	},
	methods: {
		init() {
			console.log(this)
		}
	}
})
</script>
