export function getByteLen(val) {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/gi) != null) {
      len += 1
    } else {
      len += 0.5
    }
  }
  return Math.floor(len)
}

export function param(json) {
  if (!json) return '';
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return '';
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**深度COPY*/
function deepCopy(objectOrArray) {
  return JSON.parse(JSON.stringify(objectOrArray));
}

/**检查有没有调用某url资源的权限*/
export function checkResources(url) {
  let resourceArray = JSON.parse(localStorage.resource);
  for (let i = 0; i < resourceArray.length; i ++){
    if (resourceArray[i].url === url) {
      return true;
    }
  }
  return false;
}

/**将接收到的平铺资源整理成树形资源结构*/
export function convertNodeArrayToTreeNodeArray(inputNodeArray) {
  //首先深度copy一份新平铺节点数组，并为每个节点添加children属性
  let nodeArray = deepCopy(inputNodeArray);
  for (let i = 0; i < nodeArray.length; i ++){
    nodeArray[i].children = [];
  }
  //然后整理成树型结构，组成树型菜单数组
  let treeNodeArray = [];
  for (let i = 0; i < nodeArray.length; i ++) {
    let treeNode = nodeArray[i];
    if (treeNode.pid === 0) {
      treeNode = addChildrenIntoTreeNode(treeNode, nodeArray);
      treeNodeArray.push(treeNode);
    }
  }
  return treeNodeArray;
}

/**为父节点增加子节点*/
function addChildrenIntoTreeNode(treeNode, nodeArray){
  //递归为节点增加子节点
  for (let i = 0; i < nodeArray.length; i ++ ) {
    if (nodeArray[i].pid === treeNode.id){
      nodeArray[i] = addChildrenIntoTreeNode(nodeArray[i], nodeArray);
      treeNode.children.push(nodeArray[i]);
    }
  }
  return treeNode;
}

/**生成id数组并添加父id进去*/
export function generateIdArrayAndAddParentIds(selectedNodeArray, allNodeTreeArray) {
  //增加parentNode
  let selectedNodeArrayWithPid = [];
  for (let i = 0; i < selectedNodeArray.length; i ++){
    selectedNodeArrayWithPid = addParentIdsIntoNodeArray(selectedNodeArray[i], selectedNodeArrayWithPid, allNodeTreeArray);
  }
  //转成id数组
  let idArray = [];
  for (let i = 0; i < selectedNodeArrayWithPid.length; i++) {
    idArray.push(selectedNodeArrayWithPid[i].id);
  }
  console.log(idArray);
  return idArray;
}

/**递龟出某节点所包含的所有父节点并连其自己一起塞进数组里*/
function addParentIdsIntoNodeArray(node, nodeArrayWithPid, allNodeTreeArray) {
  //首先把自己塞进数组里去
  if (!isNodeContainsInNodeArray(node, nodeArrayWithPid)) {
    nodeArrayWithPid.push(node);
  }
  //然后开始龟！龟！！龟！！！
  if (node.pid !== 0){
    addParentIdsIntoNodeArray(findNodeFromNodeTreeArrayById(node.pid, allNodeTreeArray), nodeArrayWithPid, allNodeTreeArray);
  }
  return nodeArrayWithPid;
}

/**判断某节点是否在节点数组中*/
function isNodeContainsInNodeArray(node, nodeArray) {
  for (let i = 0; i < nodeArray.length; i ++){
    if (node.id === nodeArray[i].id) {
      return true;
    }
  }
  return false;
}

/**从树结构节点数组中递龟找到某节点，没有则返回null*/
function findNodeFromNodeTreeArrayById(id, nodeTreeArray) {
  for (let i = 0; i < nodeTreeArray.length; i++) {
    if (nodeTreeArray[i].id === id) {
      return nodeTreeArray[i];
    }else if(nodeTreeArray[i].children.length !== 0){
      let node = findNodeFromNodeTreeArrayById(id, nodeTreeArray[i].children);
      if (node !== null){
        return node;
      }
    }
  }
  return null;
}

