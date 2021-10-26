import {
  LEVEL_STATISTICS,
  // STATISTIC_CONFIGS,
  // SPRING_CONFIG_NUMBERS,
} from '../constants';
// import { capitalize, formatNumber, getStatistic } from '../utils/commonFunctions';

// import { HeartFillIcon } from '@primer/octicons-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import { memo, useMemo } from 'react';
// import { useTranslation } from 'react-i18next';
import { animated, useSpring } from 'react-spring';
import {abbreviateNumber} from '../utils/commonFunctions';

function PureLevelItem({ data }) {
  // const { t } = useTranslation();
  // const spring = useSpring({
  //   total: total,
  //   delta: delta,
  //   config: SPRING_CONFIG_NUMBERS,
  // });

  console.log(data,'data items is there');

  // const statisticConfig = STATISTIC_CONFIGS[statistic];



  return (
    <>
      <h5 style={{padding: '2rem 0 1rem'}}>{data.name}</h5>
      <animated.h4 style={{padding: '0rem 0 1rem'}}>
        {data.percentage.toFixed(2)}%
      </animated.h4>
      <animated.h1>
        { abbreviateNumber(data.total)}
      </animated.h1>
    </>
  );
}

const LevelItem = memo(PureLevelItem);

function Level({ data }) {
  const trail = useMemo(() => {
    const styles = [];

    console.log(LEVEL_STATISTICS, 'Level statistics')

    console.log(data, 'ldsfjldsjflksjlk data')

    LEVEL_STATISTICS.map((statistic, index) => {
      styles.push({
        animationDelay: `${750 + index * 250}ms`,
        width: `calc(${100 / LEVEL_STATISTICS.length}%)`,
      });
      return null;
    });
    return styles;
  }, []);

  return (
    <div className="Level">
      {data.map((dataItem,index) => (
        <animated.div
          key={index}
          className={classnames('level-item', `is-${
            dataItem.name.toLowerCase().includes('call') ?
              'calls' : dataItem.name.toLowerCase().includes('put') ? 'puts' : 
              'active'
          
          }`, 'fadeInUp')}
          style={trail[index]}
        >
          <LevelItem
            data={dataItem}
          />
        </animated.div>
      ))}
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (!equal(prevProps.data, currProps.data)) {
    return false;
  }
  return true;
};

export default memo(Level, isEqual);
