<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-header{
        padding: 20px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-ceiling{
        background: #464c5b;
        padding: 10px 0;
        overflow: hidden;
        color: #f5f7f9;
    }
    .layout-ceiling-main{
        float: right;
        margin-right: 15px;
    }
    .layout-ceiling-main a{
        color: #9ba7b5;
    }
    .layout-body {
        padding: 20px;
        min-height: 200px;
    }
</style>
<template>
    <div class="layout">
        <div class="layout-ceiling">
            <div class="layout-ceiling-main">
                In development!
            </div>
        </div>
        <div class="layout-header">
            Add a folder to read here:
            <Input v-model="inputPath" style="width: 300px; margin-left: 10px;"></Input>
            <Button type="ghost" @click="addPath" icon="plus"></Button>
        </div>
        <div class="layout-body">
            <p v-for="path in paths">
                <Button type="ghost" @click="removePath(path)" icon="minus"></Button>
                {{path}}
            </p>
        </div>
        <div class="layout-copy">
            File organizer
        </div>
    </div>
</template>
<script>
export default {
	el: '#app',
	data() {
		return {
			inputPath: 'home/file-organizer',
			paths: []
		};
	},
	watch: {
		paths() {}
	},
	methods: {
		addPath() {
			this.paths.push(this.inputPath);
		}
	}
};
</script>
