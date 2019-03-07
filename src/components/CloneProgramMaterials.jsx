import Button from 'react-bootstrap/Button';
import isUndefined from 'lodash-es/isUndefined';
import Jumbotron from 'react-bootstrap/Jumbotron';
import noop from 'lodash-es/noop';
import React, {useState} from 'react';
import {useAsyncEffect} from 'use-async-effect';

import {getFolderDetails, copyLesson} from '../clients/google';

import CenterAll from './layout/CenterAll';

export default function CloneProgramMaterials({
  masterMaterials,
  programDetails: {lessonMaterialsFolderUrl, programPrefix},
  onCloned,
}) {
  const [programFolder, setProgramFolder] = useState();
  const [isCloning, setIsCloning] = useState(false);

  useAsyncEffect(async () => {
    setProgramFolder(await getFolderDetails({url: lessonMaterialsFolderUrl}));
  }, noop, []);

  return (
    <CenterAll>
      {
        isUndefined(programFolder) ?
          'Loading...' : (
            <Jumbotron>
              <p>Copy lesson materials for <strong>{masterMaterials.slides.name}</strong> to <strong>{programFolder.name}?</strong></p>
              <Button
                disabled={isCloning}
                onClick={async () => {
                  setIsCloning(true);
                  onCloned(
                    await copyLesson(
                      masterMaterials,
                      programFolder,
                      programPrefix,
                    )
                  );
                }}
              >
                {isCloning ? 'Copying...' : 'Continue'}
              </Button>
            </Jumbotron>
          )
      }
    </CenterAll>
  )
}
