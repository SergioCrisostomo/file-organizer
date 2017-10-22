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
                      :selectedPaths="paths"
                    />
                </tab-pane>
                <tab-pane name="show-files" label="See files">
                  <inpect-paths
                    :selectedPaths="paths"
                  />
                </tab-pane>
                <tab-pane name="take-actions" label="Take actions">Something smart</tab-pane>
            </tabs>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import folderSelector from './folderSelector.vue';
import inspectPaths from './inspectPaths.vue';

export default {
	el: '#app',
	data() {
		return {
			currentTab: 'choose-folders',
			paths: [],
			folders: {},
			loading: false
		};
	},
	components: {
		'folder-selector': folderSelector,
		'inpect-paths': inspectPaths
	},
	methods: {
		updatePaths(paths) {
			this.paths = paths;
		}
	}
};
</script>
