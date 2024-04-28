import { Circle, Layout, makeScene2D, Ray, Rect, Txt } from '@motion-canvas/2d';
import {
  all,
  createRefMap,
  makeRef,
  range,
  sequence,
  useLogger,
  Vector2,
  waitFor,
} from '@motion-canvas/core';
import Tree from '../classes/Tree';
import TreeNode from '../classes/TreeNode';

export default makeScene2D(function* (view) {
  const logger = useLogger();

  const tree = new Tree(new Vector2(0, -400), 300, 200, view);
  tree.insert(8);
  tree.insert(3);
  tree.insert(10);
  tree.insert(1);
  tree.insert(6);
  tree.insert(4);
  tree.insert(7);
  tree.insert(14);
  tree.insert(13);
  tree.insert(20);

  const nodes = tree.traversePreOrder(tree.root);

  view.fill('#11111b');

  view.add(
    range(nodes.length).map((index) => (
      <Layout>
        <Circle
          ref={nodes[index].circleRef}
          width={100}
          height={100}
          position={nodes[index].position}
          stroke="#cdd6f4"
          lineWidth={5}
          end={0}
        >
          <Txt text={nodes[index].value.toString()} fill="#cdd6f4" fontSize={35} />
        </Circle>
        {nodes[index].parent ? (
          <Ray
            ref={getArrowToRef(nodes[index].parent, nodes[index])}
            lineWidth={5}
            stroke={'#cdd6f4'}
            from={getArrowFromPosition(nodes[index].parent, nodes[index])}
            to={getArrowToPosition(nodes[index].parent, nodes[index])}
            end={0}
          />
        ) : null}
      </Layout>
    ))
  );

  const refs = tree.getPreOrderRefs(tree.root);

  yield* sequence(0.1, ...refs.map((ref) => ref()?.end(1, 1)));
  //yield* tree.animatePreOrderTraversal(tree.root);
  //yield* tree.animateInsert(23);
  yield* all(tree.animateInsert(0));
  yield* all(tree.animateInsert(2));
});

function getArrowToRef(fromNode: TreeNode, toNode: TreeNode) {
  if (fromNode.leftChild === toNode) {
    return toNode.arrowToLeftChild;
  } else {
    return toNode.arrowToRightChild;
  }
}

function getArrowFromPosition(fromNode: TreeNode, toNode: TreeNode) {
  if (fromNode.leftChild === toNode) {
    return fromNode.circleRef().left;
  } else {
    return fromNode.circleRef().right;
  }
}

function getArrowToPosition(fromNode: TreeNode, toNode: TreeNode) {
  if (fromNode.leftChild === toNode) {
    return toNode.circleRef().top;
  } else {
    return toNode.circleRef().top;
  }
}
