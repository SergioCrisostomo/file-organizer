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
</style>
<template>
  <div>
      <div class="actions selector-section">
        <h1>Actions:</h1>
        <div class="action-buttons">
          <Button type="ghost" @click="loadSelected(selected)" :disabled="selected.length == 0">Load subtree</Button>
          <Button type="ghost" @click="makeRootFromSelected(selected)" :disabled="selected.length == 0">Make it root node</Button>
          <Button type="ghost" @click="addToSelected(selected)" :disabled="selected.length == 0">Add to selected</Button>
          <Button type="ghost" @click="hideSelected(selected)" :disabled="selected.length == 0">Hide</Button>
        </div>
      </div>
      <div class="selector-section">
        <h1>Selected paths:</h1>
        <div v-for="path in selectedPaths">
          <p>
            <span>{{path}}</span>
            <Button type="ghost" @click="removePath(path)" icon="minus" size="small"></Button>
          </p>
        </div>
      </div>
      <div class="selector-section">
        <h1>Select folders:</h1>
        <Tree :data="tree" show-checkbox @on-select-change="onSelect" multiple :show-checkbox="false" ref="Tree"></Tree>
      </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
	name: 'folderSelector',
	props: {
		selectedPaths: Array
	},
	data() {
		return {
			inputPath: '/',
			selected: [],
			folders: {},
			tree: [],
			loading: false
		};
	},
	computed: {},
	watch: {},
	methods: {
		onSelect(selected) {
			this.selected = selected;
		},
		nodify(data, folderName, parent) {
			const title = `${folderName} - ${data.files.length} files and ${data.subFolders.length} subfolders`;
			const subFolders = data.subFolders.map(folder => {
				return {
					path: folderName,
					fullPath: folder,
					expand: false,
					title: folder,
					children: []
				};
			});

			return {
				path: parent,
				fullPath: parent,
				expand: true,
				title: title,
				children: subFolders
			};
		},
		getPathChildren(path) {
			return axios.post('/folder-selector', { path });
		},
		resetSelected() {
			this.$refs.Tree.getSelectedNodes().forEach(node => (node.selected = false));
		},
		loadSelected(paths) {
			const fullPaths = paths.map(p => p.fullPath);
			Promise.all(fullPaths.map(p => this.getPathChildren(p))).then(nodes => {
				nodes.forEach((node, i) => {
					const updatedNode = this.nodify(node.data, paths[i].title, paths[i].path);
					for (let prop in updatedNode) {
						paths[i][prop] = updatedNode[prop];
					}
					this.resetSelected();
				});
			});
		},
		hideSelected(paths) {
			function searchRecursive(node, parentNode) {
				if (paths.includes(node)) {
					parentNode.children = parentNode.children.filter(n => n != node);
				}
				if (!node.children) return;
				node.children.forEach(n => searchRecursive(n, node));
			}

			this.tree.forEach(node => searchRecursive(node, this.tree));
			this.resetSelected();
		},
		makeRootFromSelected(paths) {
			this.tree = paths;
			this.resetSelected();
		},
		addToSelected(selected) {
			this.$emit('update-paths', selected.map(el => el.fullPath));
			this.resetSelected();
		},
		removePath(path) {
			const selected = this.selectedPaths.filter(p => p != path);
			this.$emit('update-paths', selected);
		}
	},
	mounted() {
		this.getPathChildren(this.inputPath).then(({ data }) => {
			this.tree = [this.nodify(data, '', '')];
		});
	}
};
</script>
