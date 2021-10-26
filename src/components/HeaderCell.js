import Tooltip from './Tooltip';

import {STATISTIC_CONFIGS} from '../constants';
import {toTitleCase} from '../utils/commonFunctions';

import {InfoIcon, SortAscIcon, SortDescIcon} from '@primer/octicons-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import produce from 'immer';
import {memo, useCallback, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {useLongPress} from 'react-use';

function StateHeaderCell({handleSort, statistic,sortBy,isAscending}) {
  const {t} = useTranslation();
  const wasLongPressed = useRef(false);

  const onLongPress = () => {
    if (sortBy === statistic) {
      wasLongPressed.current = true;
      handleSort(statistic);
    }
  };
  const longPressEvent = useLongPress(onLongPress, {isPreventDefault: false});

  const handleClick = useCallback(
    (statistic) => {
      if (wasLongPressed.current) {
        wasLongPressed.current = false;
      } else {
        handleSort(statistic);
      }
    },
    [handleSort]
  );

  console.log(statistic.split('percent'),'Here is the statistic, hhhhhhhhhhhhhhhhhhhhhhhhh');

  const statisticConfig = STATISTIC_CONFIGS[statistic];

  return (
    <div
      className={classnames('cell', 'heading')}
      onClick={() => {
        handleSort(statistic)
      }}
      {...longPressEvent}
    >
      {sortBy=== statistic && (
        <div
          className={classnames('sort-icon', {
            [`is-${statistic}`]: sortBy,
          })}
        >
          {isAscending ? (
            <SortAscIcon size={12} />
          ) : (
            <SortDescIcon size={12} />
          )}
        </div>
      )}

      <div>
        {statistic.includes('percent') ? statistic.split('percent') : statistic}
      </div>
      {/*{statisticConfig?.tableConfig?.notes && (*/}
      {/*  <Tooltip message={t(statisticConfig.tableConfig.notes)}>*/}
      {/*    <InfoIcon size={14} />*/}
      {/*  </Tooltip>*/}
      {/*)}*/}
      {/*<div>*/}
      {/*  {t(*/}
      {/*    toTitleCase(*/}
      {/*      statisticConfig?.tableConfig?.displayName ||*/}
      {/*        statisticConfig.displayName*/}
      {/*    )*/}
      {/*  )}*/}
      {/*</div>*/}
    </div>
  );
}

export default StateHeaderCell;
