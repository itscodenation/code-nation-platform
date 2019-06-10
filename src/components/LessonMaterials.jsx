import map from 'lodash-es/map';
import React from "react";
import {useTranslation} from 'react-i18next';

export default function LessonMaterials({lessonMaterials}) {
  const {t} = useTranslation();
  const FEEDBACK_URL = "https://forms.gle/NHsbdZnrU5PZCA9d6"

  return (
    <ul>
      {
        map(lessonMaterials, ({webViewLink}, type) => (
          <li key={type}>
            <a href={webViewLink} rel="noopener noreferrer" target="_blank">
              {t(`materials.${type}`)}
            </a>
          </li>
        ))
      }
      <li>
        <a href={FEEDBACK_URL} rel="noopener noreferrer" target="_blank">
          {t('materials.feedback')}
        </a>
      </li>
    </ul>
  );
}
