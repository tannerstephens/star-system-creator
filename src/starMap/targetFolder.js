import { GUI } from 'dat.gui';

/**
 * @param {GUI} folder
 *
 * @returns {GUI} The super parent
 */
const getSuperParent = folder => {
  if(folder.parent != null) {
    return getSuperParent(folder.parent);
  }

  return folder;
}

/**
 *
 * @param {GUI} folder
 */
const closeAllChildFolders = folder => {
  const folders = folder.__folders;
  Object.entries(folders).forEach(([_, folder]) => {
    closeAllChildFolders(folder);
    folder.close()
  });
}

/**
 * @param {GUI} folder
 */
const openAllParentFolders = folder => {
  folder.open();

  if(folder.parent != null) {
    openAllParentFolders(folder.parent);
  }
}

/**
 * Close all folders and open target folder
 * @param {GUI} folder The folder to open
 */
export const targetFolder = folder => {
  const parent = getSuperParent(folder);

  closeAllChildFolders(parent);

  openAllParentFolders(folder);
}
