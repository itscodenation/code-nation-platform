import filter from 'lodash-es/filter';
import map from 'lodash-es/map';
import noop from 'lodash-es/noop';
import React from 'react';
import {useAsyncEffect} from 'use-async-effect';

import {loadAndConfigureGapi} from '../../services/gapi';

export default function LessonPlanner() {
  useAsyncEffect(async() => {
    const gapi = await loadAndConfigureGapi();
    const {result: {files}} = await gapi.client.drive.files.list({
      q: "'1wEfbo0L404VKNFpiOtOyQvllfiTs7CnO' in parents"
    });
  }, noop, []);
  return null;
}
