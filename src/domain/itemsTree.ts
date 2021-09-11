export const createItem = (title: string, children?: Item[]): Item => {
  const item: Item = {
    title,
    isOpen: children ? children.length > 0 : false,
    children: children || [],
  };

  children && children.forEach((child) => (child.parent = item));
  return item;
};

export const getItemOffsetFromParent = (item: Item) => {
  if (!item.parent) return 0;
  else {
    const getChildrenCountIncludingSelf = (item: Item): number => {
      if (item.isOpen)
        return item.children.reduce(
          (count, item) => count + getChildrenCountIncludingSelf(item),
          1
        );
      else return 1;
    };
    const context = item.parent.children;
    const index = context.indexOf(item);
    return (
      1 +
      context
        .slice(0, index)
        .reduce((count, item) => count + getChildrenCountIncludingSelf(item), 0)
    );
  }
};
