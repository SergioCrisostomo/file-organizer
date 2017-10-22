<style scoped>
.actions > * {
  display: inline-block;
  vertical-align: middle;
}
.selector-section {
  margin: 10px 0;
  padding: 10px 0;
  border-bottom: 2px solid black;
}
.loading-spinners {
    margin-top: 20px;
}
.loading-spinners > * {
    display: inline-block;
}

</style>
<template>
  <div>
      <div class="actions selector-section">
        <Button type="ghost" @click="updateData(false)">Soft read</Button>
        <Button type="ghost" @click="updateData(true)">Check for duplicates</Button>
        <Input v-model="fileExtension" style="width: 80px; margin-left: 10px;" placeholder="File extension" />
      </div>
      <div class="loading-spinners" v-if="loading">
          <Spin size="small"></Spin><Spin size="small"></Spin><Spin size="small"></Spin>
      </div>
      <div class="selector-section">
        <Tree :data="folderTree" show-checkbox></Tree>
      </div>
  </div>
</template>
<script>
import axios from 'axios';
import compileTree from '../lib/compileTree.js';

export default {
	name: 'inspectPaths',
	props: {
		selectedPaths: Array
	},
	data() {
		return {
			fileExtension: 'jpg',
			folders: {},
			loading: false
		};
	},
	computed: {
		folderTree() {
			return compileTree(this.folders);
		}
	},
	watch: {
		selectedPaths() {
			this.updateData();
		}
	},
	methods: {
		updateData(process = false) {
			if (this.selectedPaths.length === 0) {
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
				.post('/organizer', { paths: this.selectedPaths, process: process, ext: extensions })
				.then(res => (this.folders = res.data))
				.then(() => (this.loading = false))
				.catch(e => console.log(e));
		}
	}
};
</script>
