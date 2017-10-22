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

export default source => {
	return Object.keys(source).reduce((tree, rootPath) => {
		const files = source[rootPath].files.slice(0, 3);
		const node = extractTreeNode(rootPath, files);
		return tree.concat(node);
	}, []);
};
