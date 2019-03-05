import fromEntries from 'object.fromentries';
import map from 'lodash-es/map';

import {loadAndConfigureGapi} from '../../services/gapi';

async function copyFile(masterFile, programFolder, programPrefix) {
  const {client: {drive}} = await loadAndConfigureGapi();

  const {result: file} = await drive.files.copy({
    fileId: masterFile.id,
    resource: {
      name: `${programPrefix} ${masterFile.name}`,
      parents: [programFolder.id],
    },
  });
  return file;
}

async function makeFilePubliclyReadable(fileId) {
  const {client: {drive}} = await loadAndConfigureGapi();

  await drive.permissions.create({
    fileId,
    resource: {role: 'reader', type: 'anyone'},
  }) ;

  const {result: file} = await drive.files.get({
    fileId,
    fields: ['webViewLink,id,mimeType,name']
  });
  return file;
}

export default async function copyLesson(
  masterMaterials,
  programFolder,
  programPrefix
) {
  return fromEntries(
    await Promise.all(map(
      masterMaterials,
      async (masterFile, type) => {
        const {id: fileId} =
          await copyFile(masterFile, programFolder, programPrefix);
        const file = await makeFilePubliclyReadable(fileId);
        return [type, file];
      }
    ))
  );
}
