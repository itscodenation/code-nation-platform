import fromEntries from 'object.fromentries';
import map from 'lodash-es/map';

import {loadAndConfigureGapi} from '../../services/gapi';

export default async function copyLesson(
  masterMaterials,
  programFolder,
  programPrefix
) {
  const {client: {drive}} = await loadAndConfigureGapi();

  return fromEntries(
    await Promise.all(map(
      masterMaterials,
      async (masterFile, type) => {
        const {result: file} = await drive.files.copy({
          fileId: masterFile.id,
          resource: {
            name: `${programPrefix} ${masterFile.name}`,
            parents: [programFolder.id],
          },
        });
        return [type, file];
      }
    ))
  );
}
