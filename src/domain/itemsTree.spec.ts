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
  /*8*/ tree.createItem("Item 8"),
]);

it("item offset for the first root child is 1", () =>
  expect(tree.getItemOffsetFromParent(root.children[0])).toEqual(1));

it("item offset for the second root child is 2", () =>
  expect(tree.getItemOffsetFromParent(root.children[1])).toEqual(2));

it("item offset for the third root child is 8 (second child is open and it affect position of the third)", () =>
  expect(tree.getItemOffsetFromParent(root.children[2])).toEqual(8));

it("get item at path [] is a root item", () =>
  expect(tree.getItemAtPath(root, []).title).toEqual("Root"));

it("get item at path [1, 1, 2] is Item 7", () =>
  expect(tree.getItemAtPath(root, [1, 1, 2]).title).toEqual("Item 7"));

it("get item at path throws proper error if item is not found", () => {
  const error =
    new Error(`Invalid path. Can't find element at [1, 1, 2, 66]. Broke at:
[1, 1, 2, 66]
          ^^
Check children of an item Item 7`);
  expect(() => tree.getItemAtPath(root, [1, 1, 2, 66]).title).toThrow(error);
});

it("get item at path throws proper error if item is not found", () => {
  const error2 =
    new Error(`Invalid path. Can't find element at [1, 66]. Broke at:
[1, 66]
    ^^
Check children of an item Item 2`);
  expect(() => tree.getItemAtPath(root, [1, 66]).title).toThrow(error2);
});

it("having a path of [] (Root is selected) selected box position should be 0", () =>
  expect(tree.getPathPositionFromRoot(root, [])).toBe(0));

it("having a path of [0] (First child is selected) selected box position should be 1", () =>
  expect(tree.getPathPositionFromRoot(root, [0])).toBe(1));

it("having a path of [1,1,2] (Item 7 is selected) selected box position should be 7", () =>
  expect(tree.getPathPositionFromRoot(root, [1, 1, 2])).toBe(7));

it("updating title of an item at [0] changes title from Item 2 to New Title", () => {
  const newTree = tree.updateItemByPath(root, [0], (i) => ({
    ...i,
    title: "New Title",
  }));
  expect(newTree.children[0].title).toBe("New Title");
});

it("updating title of an item at [1, 1, 2] changes title from Item 7 to New 7 Title", () => {
  const newTree = tree.updateItemByPath(root, [1, 1, 2], (i) => ({
    ...i,
    title: "New 7 Title",
  }));
  expect(newTree.children[1].children[1].children[2].title).toBe("New 7 Title");
});

it("updating title of an item at wrong path [1, 1, 2, 66] throws an error", () => {
  const action = () => tree.updateItemByPath(root, [1, 1, 2, 66], (i) => i);
  const error =
    new Error(`Invalid path. Can't find element at [1, 1, 2, 66]. Broke at:
[1, 1, 2, 66]
          ^^
Check children of an item Item 7`);
  expect(action).toThrow(error);
});

//Tree traversal
//  1
//  2
//    3
//    4
//      5
//      6
//      7
//  8

describe("item below", () => {
  it("[] is [0]", () => expect(tree.getItemBelow(root, [])).toEqual([0]));

  it("[0] is [1] (item at [0] is empty)", () =>
    expect(tree.getItemBelow(root, [0])).toEqual([1]));

  it("[1] is [1, 0] (item at [1] is open)", () =>
    expect(tree.getItemBelow(root, [1])).toEqual([1, 0]));

  it("[1, 0] is [1, 1] (item at [1, 0] is empty)", () =>
    expect(tree.getItemBelow(root, [1, 0])).toEqual([1, 1]));

  it("[1, 1] is [1, 1, 0] (item at [1, 1] is open)", () =>
    expect(tree.getItemBelow(root, [1, 0])).toEqual([1, 1]));

  it("[1, 1, 0] is [1, 1, 1] (item at [1, 1, 0] is empty)", () =>
    expect(tree.getItemBelow(root, [1, 1, 0])).toEqual([1, 1, 1]));

  it("[1, 1, 2] is [2] (item at [1, 1, 2] is a last child, thus parents are traversed to find next item)", () =>
    expect(tree.getItemBelow(root, [1, 1, 2])).toEqual([2]));
});

//get item at path DONE
//get path offset DONE
//toggle item by path DONE
//get item below
//get item above
//get parent
//get child
