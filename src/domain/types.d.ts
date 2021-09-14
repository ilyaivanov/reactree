type Item = {
  id: string;
  title: string;
  children: Item[];
  isOpen: boolean;
  isEditing?: boolean;
};

type AppState = {
  root: Item;
  path: Path;
};

type Path = number[];
