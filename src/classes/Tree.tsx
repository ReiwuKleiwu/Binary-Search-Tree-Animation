import { Circle, Layout, Ray, View2D } from '@motion-canvas/2d';
import TreeNode from './TreeNode';
import { Reference, Vector2, all, sequence } from '@motion-canvas/core';

export default class Tree {
  root: TreeNode;
  rootPosition: Vector2;
  view: View2D;
  xOffset: number;
  yOffset: number;

  constructor(rootPosition: Vector2, xOffset: number, yOffset: number, view: View2D) {
    this.rootPosition = rootPosition;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.view = view;
  }

  insert(value: number) {
    if (!this.root) {
      this.root = new TreeNode(null, value, this.rootPosition);
      return;
    }

    this.insertNode(this.root, value, this.rootPosition);
  }

  insertNode(node: TreeNode, value: number, position: Vector2, depth: number = 0) {
    const scale = Math.pow(2, depth);
    if (value < node.value) {
      node.leftChild
        ? this.insertNode(
            node.leftChild,
            value,
            position.add([-this.xOffset / scale, this.yOffset]),
            depth + 1
          )
        : (node.leftChild = new TreeNode(
            node,
            value,
            position.add([-this.xOffset / scale, this.yOffset])
          ));
    } else {
      node.rightChild
        ? this.insertNode(
            node.rightChild,
            value,
            position.add([this.xOffset / scale, this.yOffset]),
            depth + 1
          )
        : (node.rightChild = new TreeNode(
            node,
            value,
            position.add([this.xOffset / scale, this.yOffset])
          ));
    }
  }

  *animateInsert(value: number) {
    if (!this.root) {
      this.root = new TreeNode(null, value, this.rootPosition);
      return;
    }

    yield* this.animateInsertNode(this.root, value, this.rootPosition);
  }

  *animateInsertNode(node: TreeNode, value: number, position: Vector2, depth: number = 0): any {
    const scale = Math.pow(2, depth);
    if (value < node.value) {
      yield* node.circleRef().stroke('#a6e3a1', 1);
      if (node.leftChild) {
        yield* this.animateInsertNode(
          node.leftChild,
          value,
          position.add([-this.xOffset / scale, this.yOffset]),
          depth + 1
        );
      } else {
        node.leftChild = new TreeNode(
          node,
          value,
          position.add([-this.xOffset / scale, this.yOffset])
        );

        this.view.add(
          <Layout>
            <Circle
              ref={node.leftChild.circleRef}
              width={100}
              height={100}
              position={node.leftChild.position}
              stroke="#cdd6f4"
              lineWidth={5}
              end={0}
            />
            <Ray
              ref={node.arrowToLeftChild}
              lineWidth={5}
              stroke={'#cdd6f4'}
              from={node.circleRef().left}
              to={node.leftChild.circleRef().top}
              end={0}
            />
          </Layout>
        );

        yield* sequence(
          0.2,
          node.leftChild.circleRef().end(1, 1),
          node.arrowToLeftChild().end(1, 1)
        );
      }
    } else {
      yield* node.circleRef().stroke('#fab387', 1);
      if (node.rightChild) {
        yield* this.animateInsertNode(
          node.rightChild,
          value,
          position.add([this.xOffset / scale, this.yOffset]),
          depth + 1
        );
      } else {
        node.rightChild = new TreeNode(
          node,
          value,
          position.add([this.xOffset / scale, this.yOffset])
        );
        this.view.add(
          <Layout>
            <Circle
              ref={node.rightChild.circleRef}
              width={100}
              height={100}
              position={node.rightChild.position}
              stroke="#cdd6f4"
              lineWidth={5}
              end={0}
            />
            <Ray
              ref={node.arrowToRightChild}
              lineWidth={5}
              stroke={'#cdd6f4'}
              from={node.circleRef().right}
              to={node.rightChild.circleRef().top}
              end={0}
            />
          </Layout>
        );

        yield* sequence(
          0.2,
          node.rightChild.circleRef().end(1, 1),
          node.arrowToRightChild().end(1, 1)
        );
      }
    }
  }

  *animatePreOrderTraversal(node: TreeNode): any {
    if (node) {
      yield* node.highlightNode();
      yield* this.animatePreOrderTraversal(node.leftChild);
      yield* this.animatePreOrderTraversal(node.rightChild);
    }
  }

  traversePreOrder(node: TreeNode, result: TreeNode[] = []): TreeNode[] {
    if (node) {
      result.push(node);
      this.traversePreOrder(node.leftChild, result);
      this.traversePreOrder(node.rightChild, result);
    }
    return result;
  }

  getPreOrderRefs(node: TreeNode, result: Reference<Circle | Ray>[] = []) {
    if (node) {
      result.push(node.circleRef);
      node.parent?.leftChild === node
        ? result.push(node.arrowToLeftChild)
        : result.push(node.arrowToRightChild);
      this.getPreOrderRefs(node.leftChild, result);
      this.getPreOrderRefs(node.rightChild, result);
    }
    return result;
  }

  getInOrderRefs(node: TreeNode, result: Reference<Circle | Ray>[] = []) {
    if (node) {
      this.getInOrderRefs(node.leftChild, result);
      result.push(node.circleRef);
      node.parent?.leftChild === node
        ? result.push(node.arrowToLeftChild)
        : result.push(node.arrowToRightChild);
      this.getInOrderRefs(node.rightChild, result);
    }
    return result;
  }

  getPostOrderRefs(node: TreeNode, result: Reference<Circle | Ray>[] = []) {
    if (node) {
      this.getPostOrderRefs(node.leftChild, result);
      this.getPostOrderRefs(node.rightChild, result);
      result.push(node.circleRef);
      node.parent?.leftChild === node
        ? result.push(node.arrowToLeftChild)
        : result.push(node.arrowToRightChild);
    }
    return result;
  }
}
