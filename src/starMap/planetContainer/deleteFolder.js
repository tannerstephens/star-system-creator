import { GUI } from "dat.gui";

/**
 * @param {GUI} folder
 */
export const deleteFolder = folder => {
  folder.parent.removeFolder(folder);
}
