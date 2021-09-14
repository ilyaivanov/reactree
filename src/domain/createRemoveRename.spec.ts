import { createDummyItem } from "./specs/utils";
import * as sut from "./createRemoveRename";

it("creating a new item after first create new item after it", () => {
  const state: AppState = {
    root: createDummyItem("Home", [
      createDummyItem("First"),
      createDummyItem("Second"),
    ]),
    path: [0],
  };

  Math.random = () => "DUMMYID" as unknown as number;
  const expectedStateAfterCreation: AppState = {
    root: createDummyItem("Home", [
      createDummyItem("First"),
      createDummyItem({ id: "rid_DUMMYID", title: "", isEditing: true }),
      createDummyItem("Second"),
    ]),
    path: [1],
  };

  expect(sut.createNewItem(state)).toEqual(expectedStateAfterCreation);
});

it("creating a new item while focusing on root creates a child node", () => {
  const state: AppState = {
    root: createDummyItem("Home", [createDummyItem("First")]),
    path: [],
  };

  Math.random = () => "DUMMYID" as unknown as number;
  const expectedStateAfterCreation: AppState = {
    root: createDummyItem({ title: "Home", isOpen: true }, [
      createDummyItem({ id: "rid_DUMMYID", title: "", isEditing: true }),
      createDummyItem("First"),
    ]),
    path: [0],
  };

  expect(sut.createNewItem(state)).toEqual(expectedStateAfterCreation);
});
