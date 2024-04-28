import { Circle, Ray } from '@motion-canvas/2d';
import { Reference, Vector2, all, createRef } from '@motion-canvas/core';

export default class TreeNode {
  leftChild: TreeNode | null;
  rightChild: TreeNode | null;
  parent: TreeNode | null;
  value: number;
  position: Vector2;
  circleRef: Reference<Circle>;
  arrowToLeftChild: Reference<Ray>;
  arrowToRightChild: Reference<Ray>;

  constructor(parent: TreeNode | null, value: number, position: Vector2) {
    this.leftChild = null;
    this.rightChild = null;
    this.parent = parent;
    this.value = value;
    this.position = position;
    this.circleRef = createRef<Circle>();
    this.arrowToLeftChild = createRef<Ray>();
    this.arrowToRightChild = createRef<Ray>();
  }

  *highlightNode() {
    yield* all(
      this.circleRef().stroke('#f9e2af', 0.8),
      this.circleRef().lineWidth(8, 0.8),
      this.circleRef().scale(1.2, 0.8)
    );
  }
}
