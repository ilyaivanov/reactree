import * as tree from "./itemsTree";

const root = tree.createItem("Root", [
  /*1*/ tree.createItem("Item 1"),
  /*2*/ tree.createItem("Item 2", [
    /*1*/ tree.createItem("Item 3"),
    /*2*/ tree.createItem("Item 4", [
      /*1*/ tree.createItem("Item 5"),
      /*2*/ tree.createItem("Item 6"),
      /*3*/ tree.createItem("Item 7"),
    ]),
  ]),
  /*8*/ tree.createItem("Item 9"),
]);

//TODO: terrible test names, need some practice
it("having a root item with a bunch of children getParentOffset returns proper offset", () => {
  expect(tree.getItemOffsetFromParent(root.children[0])).toEqual(1);

  expect(tree.getItemOffsetFromParent(root.children[1])).toEqual(2);

  expect(tree.getItemOffsetFromParent(root.children[2])).toEqual(8);
});
