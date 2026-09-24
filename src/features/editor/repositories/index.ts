import {
  type IEditorRepository,
  drizzleEditorRepository,
} from "./editor.repository";

export * from "./editor.repository";

export const editorRepository: IEditorRepository = drizzleEditorRepository;
