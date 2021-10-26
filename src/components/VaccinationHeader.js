import {SPRING_CONFIG_NUMBERS, STATISTIC_CONFIGS} from '../constants.js';
import { getStatistic} from '../utils/commonFunctions';

import {ShieldCheckIcon} from '@primer/octicons-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import {useEffect, useRef, useState, memo} from 'react';
import {useTranslation} from 'react-i18next';
import {animated, useSpring, Globals} from 'react-spring';
import {abbreviateNumber} from '../utils/commonFunctions';
// Disable react-spring color string interpolation
// It renders administered => administergba(255, 0, 0, 1)
Globals.assign({colors: null});

function ProgressBar({dose1, dose2, data}) {
  const {t} = useTranslation();
  const [highlightedDose, setHighlightedDose] = useState(2);
  const isMounted = useRef(false);


  console.log(dose1, dose2, 'Here is dose one and dose two');

  // const doseSpring = useSpring({
  //   dose1,
  //   dose2,
  //   from: {
  //     dose1: 0,
  //     dose2: 0,
  //   },
  //   delay: isMounted.current ? 0 : 2000,
  // });

  useEffect(() => {
    isMounted.current = true;
  }, []);

  return (

    <div style={{width: '100%'}}>

      {/* top values*/}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          Total Call Premium
        </div>

        <div>
          Total Put Premium
        </div>

      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `${data.callpremiumpercent}% ${data.putpremiumpercent}%`,
        width: '100%',
      }}>

        <div
          className='progress-bar-wrapper fadeInUp'
          style={{animationDelay: `${750 + 5 * 250}ms`, width: `100%`}}
        >

          <div className='progress-bar-call' style={{width: `100%`}}>
            <animated.div
              className={classnames('progress-bar-call', 'value', {
                highlighted: highlightedDose === 1,
              })}
              style={{width: `100%`}}
              onMouseEnter={setHighlightedDose.bind(this, 1)}
              onMouseLeave={setHighlightedDose.bind(this, 2)}
            >
              {/*<animated.span>*/}
              {/* Call Premium Percent*/}
              {/*</animated.span>*/}
              {/*----------------------------------------------*/}

              {/*----------------------------------------------*/}

            </animated.div>
            <animated.div
              className={classnames('progress-bar', 'value', 'opaque', {
                highlighted: highlightedDose === 2,
              })}
              style={{width: `${data.callpremiumpercent}%`}}
            />
          </div>
          {/* 2nd part*/}
          <div
            className={classnames('legend', {
              highlighted: highlightedDose === 2,
            })}
          >
            <animated.div
              className='arrow'
              style={{
                marginLeft: `${data.callpremiumpercent}%`,
              }}
            >
              {/*|*/}
            </animated.div>
            <div className='label-wrapper' style={{justifyContent: 'center'}}>
              {/*<animated.div*/}
              {/*  style={{*/}
              {/*    width: `${data.callpremiumpercent}%`,*/}
              {/*  }}*/}
              {/*/>*/}
              {/*<animated.div className="label">*/}
              {/*  /!* {doseSpring.dose2.to(*/}
              {/*		(n) => `${t('Fully vaccinated')} (${formatNumber(n, '%')})`*/}
              {/*	)} *!/*/}
              {/*fixme*/}
              {/* call premium percent */}
              {/*  { data.callpremiumpercent.toFixed(2)} %*/}
              {/*</animated.div>*/}
            </div>
          </div>

        </div>


        {/* 2nd part */}
        <div
          className='progress-bar-wrapper fadeInUp'
          style={{animationDelay: `${750 + 5 * 250}ms`, width: `100%`}}
        >

          <div className='progress-bar-put' style={{width: `100%`}}>
            <animated.div
              className={classnames('progress-bar-put', 'value', {
                highlighted: highlightedDose === 1,
              })}
              style={{width: `100%`, borderRadiusRight: 0}}
              onMouseEnter={setHighlightedDose.bind(this, 1)}
              onMouseLeave={setHighlightedDose.bind(this, 2)}
            >
              {/*<animated.span>*/}
              {/*  Put Premium Percent*/}
              {/*</animated.span>*/}
            </animated.div>
            <animated.div
              className={classnames('progress-bar', 'value', 'opaque', {
                highlighted: highlightedDose === 2,
              })}
              style={{width: `${data.putpremiumpercent}%`, borderTopRightRadius: 0}}
            />
          </div>
          {/* 2nd part*/}
          <div
            className={classnames('legend', {
              highlighted: highlightedDose === 2,
            })}
          >
            <animated.div
              className='arrow'
              style={{
                marginLeft: `${data.putpremiumpercent}%`,
              }}
            >
              {/*|*/}
            </animated.div>
            <div className='label-wrapper' style={{justifyContent: 'center'}}>
              {/*<animated.div*/}
              {/*  style={{*/}
              {/*    width: `${data.callpremiumpercent}%`,*/}
              {/*  }}*/}
              {/*/>*/}
              {/*fixme*/}
              {/*put premium percent */}
              {/*<animated.div className="label">*/}
              {/*  /!* {doseSpring.dose2.to(*/}
              {/*		(n) => `${t('Fully vaccinated')} (${formatNumber(n, '%')})`*/}
              {/*	)} *!/*/}

              {/*  { data.putpremiumpercent.toFixed(2)} %*/}
              {/*</animated.div>*/}
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Values*/}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '.5rem'}}>
        <div>
          {data.callpremiumpercent.toFixed(2)} %
        </div>

        <div>
          {data.putpremiumpercent.toFixed(2)} %
        </div>

      </div>

    </div>

  );
}

function Level({data}) {
  const {t} = useTranslation();

  const spring = useSpring({
    total: getStatistic(data, 'total', 'vaccinated'),
    // delta: getStatistic(data, 'delta', 'vaccinated'),
    config: SPRING_CONFIG_NUMBERS,
  });

  const statisticConfig = STATISTIC_CONFIGS.vaccinated;

  return (
    <>
      <div
        className='total-premium fadeInUp'
        style={{animationDelay: `${750 + 4 * 250}ms`}}
      >
        <ShieldCheckIcon />
        <animated.div>
          {abbreviateNumber(data.totalpremium)}
          {/* {spring.total.to((total) => formatNumber(total, 'long'))} */}
        </animated.div>
        {/* <animated.div>
        {spring.delta.to(
          (delta) =>
            `(+ ${formatNumber(delta, 'long')})`
        )}
      </animated.div> */}
        <div>Total Premium</div>
      </div>
    </>
  );
}

function VaccinationHeader({data}) {
  const dose1 = getStatistic(data, 'total', 'vaccinated1', {
    normalizedByPopulationPer: 'hundred',
  });
  const dose2 = getStatistic(data, 'total', 'vaccinated2', {
    normalizedByPopulationPer: 'hundred',
  });

  return (
    <div className='VaccinationHeader'>
      <Level {...{data}} />
      <div style={{marginTop: '1rem',width: '100%'}}>
        <ProgressBar data={data} {...{dose1, dose2}} />
      </div>
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (!equal(prevProps.data, currProps.data)) {
    return false;
  }
  return true;
};

export default memo(VaccinationHeader, isEqual);
