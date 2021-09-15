import {
  moveItemRight,
  moveItemLeft,
  moveItemDown,
  moveItemUp,
} from "../movement";
import { createDummyItem } from "./utils";

it("moving second item right places it as first child of first and opens it", () => {
  const initial = createDummyItem("Home", [
    createDummyItem("First"),
    createDummyItem("Second"),
  ]);

  const path = [1];

  const expected: AppState = {
    root: createDummyItem("Home", [
      createDummyItem({ title: "First", isOpen: true }, [
        createDummyItem("Second"),
      ]),
    ]),
    path: [0, 0],
  };

  expect(moveItemRight({ root: initial, path })).toEqual<AppState>(expected);
});

it("moving second item right places it as last child of first (because first has children)", () => {
  const initial = createDummyItem("Home", [
    createDummyItem({ title: "First", isOpen: true }, [
      createDummyItem("First.child"),
    ]),
    createDummyItem("Second"),
  ]);

  const path = [1];

  const expected: AppState = {
    root: createDummyItem("Home", [
      createDummyItem({ title: "First", isOpen: true }, [
        createDummyItem("First.child"),
        createDummyItem("Second"),
      ]),
    ]),
    path: [0, 1],
  };

  expect(moveItemRight({ root: initial, path })).toEqual<AppState>(expected);
});

it("moving First.child item left places after the parent", () => {
  const initial = createDummyItem("Home", [
    createDummyItem({ title: "First", isOpen: true }, [
      createDummyItem("First.child"),
    ]),
    createDummyItem("Second"),
  ]);

  const path = [0, 0];

  const expected: AppState = {
    root: createDummyItem("Home", [
      createDummyItem({ title: "First", isOpen: false }),
      createDummyItem("First.child"),
      createDummyItem("Second"),
    ]),
    path: [1],
  };

  expect(moveItemLeft({ root: initial, path })).toEqual<AppState>(expected);
});

it("moving item down swaps it with next sibling", () => {
  const initial = createDummyItem("Home", [
    createDummyItem("First"),
    createDummyItem("Second"),
  ]);

  const path = [0];

  const expected: AppState = {
    root: createDummyItem("Home", [
      createDummyItem("Second"),
      createDummyItem("First"),
    ]),
    path: [1],
  };

  expect(moveItemDown({ root: initial, path })).toEqual<AppState>(expected);
});

it("moving item up swaps it with previous sibling", () => {
  const initial = createDummyItem("Home", [
    createDummyItem("First"),
    createDummyItem("Second"),
  ]);

  const path = [1];

  const expected: AppState = {
    root: createDummyItem("Home", [
      createDummyItem("Second"),
      createDummyItem("First"),
    ]),
    path: [0],
  };

  expect(moveItemUp({ root: initial, path })).toEqual<AppState>(expected);
});
