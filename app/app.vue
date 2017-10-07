<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        height: 100%;
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
        height: 100%;
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
        </div>
        <div class="layout-body">
            <tabs value="name1">
                <tab-pane label="Add folders">
                    <div>
                        Add a folder to read here:
                        <Input v-model="inputPath" style="width: 300px; margin-left: 10px;"></Input>
                        <Button type="ghost" @click="togglePath(true)" icon="plus"></Button>
                    </div>
                    <hr style="margin: 10px 0;">
                    <p v-for="path in paths">
                        <Button size="small" type="ghost" @click="togglePath(false)" icon="minus"></Button>
                        <span class="folder-name">{{path}}</span>
                        <span class="file-count">({{fileCount(path)}} files)</span>
                    </p>
                </tab-pane>
                <tab-pane label="See files">Maybe a Tree component with the files?</tab-pane>
                <tab-pane label="Take actions">Something smart</tab-pane>
            </tabs>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
	el: '#app',
	data() {
		return {
			inputPath: '/Users/Desktop',
			paths: [],
			folders: {}
		};
	},
	watch: {
		paths() {
			if (this.paths.length === 0) this.folders = {};
			axios
				.post('/ajax', {paths: this.paths})
				.then(res => (this.folders = res.data))
				.catch(e => console.log(e));
		}
	},
	methods: {
		togglePath(add) {
			if (!this.inputPath.trim()) return;
			if (add) {
				if (this.paths.includes(this.inputPath)) return;
				this.paths = this.paths.concat(this.inputPath);
			} else {
				this.paths = this.paths.filter(path => path != this.inputPath);
			}
		},
		fileCount(path) {
			return this.folders[path] ? this.folders[path].files.length : 0;
		}
	}
};
</script>
