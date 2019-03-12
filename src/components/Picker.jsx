import isFunction from 'lodash-es/isFunction';
import isNull from 'lodash-es/isNull';
import ListGroup, {Item as ListGroupItem} from 'react-bootstrap/ListGroup';
import map from 'lodash-es/map';
import React from 'react';
import property from 'lodash-es/property';
import CenterAll from './layout/CenterAll';

export default function Picker({
  itemKey,
  itemLabel,
  items = null,
  header,
  onPick,
}) {
  const getItemKey = isFunction(itemKey) ? itemKey : property(itemKey);
  const getItemLabel = isFunction(itemLabel) ? itemLabel : property(itemLabel);

  return (
    <CenterAll>
      {
        isNull(items) ? (
          <p>Loading…</p>
        ) : (
          <div>
            <h2>{header}</h2>
            <ListGroup>
              {map(
                items,
                item =>
                  <ListGroupItem
                    action
                    key={getItemKey(item)}
                    onClick={() => onPick(item)}
                  >
                    {getItemLabel(item)}
                  </ListGroupItem>
              )}
            </ListGroup>
          </div>
        )
      }
    </CenterAll>
  );
}
