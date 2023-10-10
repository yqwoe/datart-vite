export function arrayToTree(list: any[] = [], parentId = null) {
  return list
    .filter(item => item.parentId === parentId)
    .map(item => ({
      ...item,
      title: item.name,
      key: item.id,
      pId: item.parentId,
      children: arrayToTree(list, item.id),
    }));
}

export function treeToArray(tree: any[] = [], newArr: any[] = []) {
  tree.forEach(item => {
    const { children } = item;
    if (children) {
      if (children.length) {
        newArr.push(item);
        return treeToArray(children, newArr);
      }
    }
    newArr.push(item);
  });

  return newArr;
}
