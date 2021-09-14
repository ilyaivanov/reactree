export const createDummyItem = (
  title: string | Partial<Item>,
  children?: Item[]
): Item => {
  const props: Partial<Item> = typeof title === "string" ? { title } : title;
  return {
    id: "id_" + props.title,
    isOpen: false,
    children: children || [],
    title: "",
    ...props,
  };
};
