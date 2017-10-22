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
        height: 85vh;
        padding: 20px;
        min-height: 200px;
        overflow-y: scroll;
    }
    .loading-spinners {
        margin-top: 20px;
    }
    .loading-spinners > * {
        display: inline-block;
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
            <tabs v-model="currentTab">
                <tab-pane name="choose-folders" label="Choose folders">
                    <folder-selector
                      @update-paths="updatePaths"
                      :file-extension="fileExtension"
                      :selectedPaths="paths"
                    />
                </tab-pane>
                <tab-pane name="show-files" label="See files">
                    <Button type="ghost" @click="updateData(true)">Check for duplicates</Button>
                    <hr style="margin: 10px 0;">
                    <Tree :data="folderTree" show-checkbox></Tree>
                </tab-pane>
                <tab-pane name="take-actions" label="Take actions">Something smart</tab-pane>
            </tabs>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import folderSelector from './folderSelector.vue';

const compileTree = (() => {
	function extractTreeNode(rootPath, files) {
		files = files.map(f => f.slice(rootPath.lengh));
		return {
			title: rootPath,
			expand: true,
			children: extractTreeChildren(files, rootPath)
		};
	}

	function extractTreeChildren(files, root) {
		const subLevels = {};
		const thisLevel = [];
		for (const file of files) {
			const subFolders = file.split('/').filter(Boolean);
			let pathFragment = subFolders.shift();
			if (subFolders.length == 0) {
				thisLevel.push(pathFragment);
				continue;
			}
			if (!subLevels[pathFragment]) subLevels[pathFragment] = [];
			subLevels[pathFragment].push(subFolders.join('/'));
		}
		const children = Object.keys(subLevels).reduce((tree, subPath) => {
			const node = extractTreeNode(subPath, subLevels[subPath]);
			return tree.concat(node);
		}, []);
		return thisLevel.map(el => ({ title: el })).concat(children);
	}

	return source => {
		return Object.keys(source).reduce((tree, rootPath) => {
			const files = source[rootPath].files.slice(0, 3);
			const node = extractTreeNode(rootPath, files);
			return tree.concat(node);
		}, []);
	};
})();

export default {
	el: '#app',
	data() {
		return {
			inputPath: '/Users/sergiocrisostomo/Desktop/deleteme',
			fileExtension: 'jpg',
			currentTab: 'choose-folders',
			paths: [],
			folders: {},
			loading: false
		};
	},
	components: {
		'folder-selector': folderSelector
	},
	computed: {
		folderTree() {
			return compileTree(this.folders);
		}
	},
	watch: {
		paths() {
			this.updateData();
		}
	},
	methods: {
		updatePaths(paths) {
			this.paths = paths;
		},
		updateData(process = false) {
			if (this.paths.length === 0) {
				this.folders = {};
				this.loading = false;
				if (process == true) this.$Message.warning('No folders selected');
				return;
			}

			this.loading = true;
			const extensions = this.fileExtension
				.split(/,\./g)
				.map(el => el.trim())
				.filter(Boolean);

			axios
				.post('/organizer', { paths: this.paths, process: process, ext: extensions })
				.then(res => (this.folders = res.data))
				.then(() => (this.loading = false))
				.catch(e => console.log(e));
		},
		fileCount(path) {
			return this.folders[path] ? this.folders[path].files.length : 0;
		}
	}
};
</script>
