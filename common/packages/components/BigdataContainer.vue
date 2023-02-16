<template>
	<!--这是一个大屏布局组件-->
	<div class="bigdata-container" ref='container'>
		<slot/>
	</div>
</template>
<script>
import {defineComponent, nextTick} from "vue-demi"

export default defineComponent({
	props: {
		options: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			compData: {
				width: 0, // 大屏真实宽度
				height: 0, // 大屏真实高度
				originalWidth: 0, // 窗口原始宽度
				originalHeight: 0, // 窗口原始高度
			}
		}
	},
	created() {
	
	},
	mounted() {
		this.container = this.$refs['container']
		// 获取相关尺寸数据
		this.initSize().then(() => {
			// 设置容器尺寸，让容器尺寸与内容尺寸一致
			this.updateSize();
			// 设置容器缩放比例，实现内容一屏完整显示
			this.updateScale();
			// 监听 resize事件，实现页面动态适配
			window.addEventListener('resize', this.onResize);
		})
	},
	methods: {
		// 获取相关尺寸数据
		initSize() {
			return new Promise(resolve => {
				nextTick(() => {
					// 获取大屏真实尺寸
					if (this.options.width && this.options.height) {
						this.compData.width = this.options.width;
						this.compData.height = this.options.height;
					} else {
						// 若未传递大屏真实尺寸，则获取容器被内容撑满后的尺寸 作为大屏真实尺寸
						this.compData.width = this.container.clientWidth;
						this.compData.height = this.container.clientHeight;
					}
					// 获取窗口原始尺寸
					if (!this.compData.originalWidth || !this.compData.originalHeight) {
						this.compData.originalWidth = window.screen.width;
						this.compData.originalHeight = window.screen.height;
					}
					resolve();
				});
			});
		},
		// 设置容器尺寸，让容器尺寸与内容尺寸一致
		updateSize() {
			if (this.compData.width && this.compData.height) {
				this.container.style.width = `${this.compData.width}px`;
				this.container.style.height = `${this.compData.height}px`;
			}
		},
		// 设置容器缩放比例，实现内容一屏完整显示
		updateScale() {
			// 屏幕视口存在认为缩放，拖动，导致真实视口发生变化，这里获取真实的视口尺寸
			const currentWidth = document.body.clientWidth;
			const currentHeight = document.body.clientHeight;
			// 获取大屏最终宽高， 若未获得大屏幕尺寸，则将屏幕视口原始尺寸作为大屏最终宽高
			const realWidth = this.compData.width || this.compData.originalWidth;
			const realHeight = this.compData.height || this.compData.originalHeight;
			// 计算宽高比
			const widthScale = currentWidth / realWidth;
			const heightScale = currentHeight / realHeight;
			this.container.style.transform = `scale(${widthScale}, ${heightScale})`;
		},
		// 监听 resize 事件， 动态更新容器缩放比
		onResize() {
			this.initSize()
			this.updateScale()
		}
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.onResize);
	}
})
</script>
<style scoped>
.bigdata-container {
	position: fixed;
	top: 0;
	left: 0;
	overflow: hidden;
	transform-origin: left top;
	z-index: 9999;
}
</style>
