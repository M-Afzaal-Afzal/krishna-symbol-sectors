import TableLoader from './loaders/Table';
import {
  DATA_API_ROOT,
  DISTRICT_START_DATE,
  DISTRICT_TEST_END_DATE,
  // MAP_STATISTICS,
  // MAP_VIEWS,
  // PRIMARY_STATISTICS,
  TESTED_EXPIRING_DAYS,
  // UNKNOWN_DISTRICT_KEY,
} from '../constants';
import useIsVisible from '../hooks/useIsVisible';
import useStickySWR from '../hooks/useStickySWR';
import {
  fetcher,
  getStatistic,
  parseIndiaDate,
  retry,
} from '../utils/commonFunctions';

import classnames from 'classnames';
import {addDays, formatISO, max} from 'date-fns';
import {useMemo, useRef, useState, lazy, Suspense, useEffect} from 'react';
import {Helmet} from 'react-helmet';
import {useLocation, useParams} from 'react-router-dom';
import {useLocalStorage, useSessionStorage, useWindowSize} from 'react-use';
// import useSWR from 'swr';
// import {useTranslation} from 'react-i18next';
import FeelingCard from './FeelingCard/FeelingCard';

import {SmileyIcon} from '@primer/octicons-react';

const Actions = lazy(() => retry(() => import('./Actions')));
const Footer = lazy(() => retry(() => import('./Footer')));
const Level = lazy(() => retry(() => import('./Level')));
const VaccinationHeader = lazy(() =>
  retry(() => import('./VaccinationHeader')),
);
const MapSwitcher = lazy(() => retry(() => import('./MapSwitcher')));
const Search = lazy(() => retry(() => import('./Search')));
const Table = lazy(() => retry(() => import('./Table')));
const TimeseriesExplorer = lazy(() =>
  retry(() => import('./TimeseriesExplorer')),
);

function SymbolPage() {


  const [symbol,setSymbol] = useState( useParams()?.id || '');
  const [sector,setSector] = useState(null);

  const symbolHandler = (val) => {
    setSymbol(val);
    setSector(null);
  }

  const sectorHandler = (val) => {
    setSector(val);
    setSymbol(null);
  }

  console.log(symbol,'****************************************************');

  // const [regionHighlighted, setRegionHighlighted] = useState({
  //   stateCode: 'TT',
  //   districtName: null,
  // });

  const [anchor, setAnchor] = useLocalStorage('anchor', null);
  const [expandTable, setExpandTable] = useLocalStorage('expandTable', false);
  const [mapStatistic, setMapStatistic] = useSessionStorage(
    'mapStatistic',
    'active',
  );
  // const [mapView, setMapView] = useLocalStorage('mapView', MAP_VIEWS.DISTRICTS);

  const [date, setDate] = useState('');
  const [dates, setDates] = useState(null);
  const location = useLocation();

  // const {data: timeseries} = useStickySWR(
  //   `${DATA_API_ROOT}/timeseries.min.json`,
  //   fetcher,
  //   {
  //     revalidateOnMount: true,
  //     refreshInterval: 100000,
  //   },
  // );

  const {data} = useStickySWR(
    `https://www.finlytica.com/options-flow-summary-sector?days=60&sort=totalpremium:asc&putcountpercent_gte=5&limit=10${symbol ? `&symbol=${symbol}` : ''}`,
    fetcher,
    {
      revalidateOnMount: true,
      refreshInterval: 100000,
    },
  );

  const homeRightElement = useRef();
  const isVisible = useIsVisible(homeRightElement);
  const {width} = useWindowSize();


  const [cardsData, setCardsData] = useState();
  const [symbolSectorStats, setSymbolSectorStats] = useState(null);
  // const [sectors, setSectors] = useState(null);

  useEffect(() => {

    // if (!dates) {
      fetch(`https://www.finlytica.com/options-flow?${symbol ? `symbol=${symbol}` : ''}${sector ? `&sector=${sector}` : ''}`)
        .then(res => res.json())
        .then(data => {
          const dates = data.map(dataItem => dataItem.created_date);
          // if (!dates) {
            setDates(dates);
            console.log(dates,'------------------------------------------ dates from inside ----------------------------------------------------');
          // }
        });

    // }

    // if (!cardsData || !symbolSectorStats) {

      fetch(`https://www.finlytica.com/options-flow-summary-stats?start_date=2021-07-28&end_date=2021-08-01${symbol ? `&symbol=${symbol}` : ''}${sector ? `&sector=${sector}` : ''}`)
        .then(res => res.json())
        .then(res => {
          const data = res.data;


          // console.log(data, 'data is there');

          // console.log(data, 'data is there');

          const cardsDataArr = Array.from({length: 4}, (_, index) => {
            switch (index) {
              case 0: {
                return {
                  id: 0,
                  name: 'CAll VOLUME',
                  total: data.totalcallvolume,
                  percentage: data.callcountpercent,
                };
              }
              case 1: {
                return {
                  id: 1,
                  name: 'PUT VOLUME',
                  total: data.totalputvolume,
                  percentage: data.putcountpercent,
                };
              }
              case 2: {
                return {
                  id: 2,
                  name: 'CALL OI',
                  total: data.totalcalloi,
                  percentage: data.calloipercent,
                };
              }
              case 3: {
                return {
                  id: 3,
                  name: 'PUT OI',
                  total: data.totalputoi,
                  percentage: data.putoipercent,
                };
              }

            }
          });

          // if (!symbolSectorStats) {
            setSymbolSectorStats(data);
          // }

          // if (!cardsData) {
            setCardsData(cardsDataArr);
          // }


          // console.log(cardsDataArr, 'cards data array');

        });

    // }

  }, [symbol,sector]);

  return (
    <>
      <Helmet>
        <title>Coronavirus Outbreak in India - covid19india.org</title>
        <meta
          name='title'
          content='Coronavirus Outbreak in India: Latest Map and Case Count'
        />
      </Helmet>

      <div className='Home'>
        <div className={classnames('home-left')}>
          <div className='header'>
            <Suspense fallback={<div />}>
              <Search symbolHandler={symbolHandler} sectorHandler={sectorHandler} />
            </Suspense>



            <>
              {/*{!timeseries && <div style={{minHeight: '61px'}} />}*/}

              {/* These actions are for date */}
              {dates && (
                <Suspense fallback={<div style={{minHeight: '61px'}} />}>
                  <Actions
                    {...{
                      date,
                      setDate,
                      dates: dates,
                    }}
                  />
                </Suspense>
              )}
            </>
          </div>

          <div style={{position: 'relative', marginTop: '10rem'}}>
            {cardsData && (
              <Suspense fallback={<div style={{height: '50rem'}} />}>
                {width >= 769 && !expandTable && (
                  <MapSwitcher data={cardsData} {...{mapStatistic, setMapStatistic}} />
                )}
                <Level data={cardsData} />
              </Suspense>
            )}


          </div>

          <div style={{height: '8rem'}} />

          {symbolSectorStats && <VaccinationHeader data={symbolSectorStats} />}

          <div />


        </div>

        <div
          className={classnames('home-right')}
          // ref={homeRightElement}
          style={{minHeight: '4rem'}}
        >

          <FeelingCard />

          <div style={{
            display: 'grid',
            gridTemplateRows: '1fr 1fr',
            gridTemplateColumns: '1fr 1fr',
            // rowGap: '4rem',
            marginLeft: '6rem',
            // marginTop: '8.5rem',
          }} className={'tables-container'}>

            {/* 1st element*/}
            {/*<div className='district-bar'>*/}
            {/*  <div*/}
            {/*    className={classnames('district-bar-top', {*/}
            {/*      expanded: showAllDistricts,*/}
            {/*    })}*/}
            {/*  >*/}
            {/*    <div className='district-bar-left'>*/}
            {/*      <h2*/}
            {/*        className={classnames(primaryStatistic, 'fadeInUp')}*/}
            {/*        style={trail[0]}*/}
            {/*      >*/}
            {/*        {t('Trending Symbols')}*/}
            {/*      </h2>*/}
            {/*      <div*/}
            {/*        className={`districts fadeInUp ${*/}
            {/*          showAllDistricts ? 'is-grid' : ''*/}
            {/*        }`}*/}
            {/*        style={*/}
            {/*          showAllDistricts*/}
            {/*            ? {*/}
            {/*              gridTemplateRows: `repeat(${gridRowCount}, 2rem)`,*/}
            {/*              ...trail[1],*/}
            {/*            }*/}
            {/*            : trail[1]*/}
            {/*        }*/}
            {/*      >*/}
            {/*        {districts*/}
            {/*          .filter((districtName) => districtName !== 'Unknown')*/}
            {/*          .sort((a, b) => handleSort(a, b))*/}
            {/*          .slice(0, showAllDistricts ? undefined : 5)*/}
            {/*          .map((districtName) => {*/}
            {/*            const total = getStatistic(*/}
            {/*              stateData.districts[districtName],*/}
            {/*              'total',*/}
            {/*              primaryStatistic,*/}
            {/*            );*/}
            {/*            const delta = getStatistic(*/}
            {/*              stateData.districts[districtName],*/}
            {/*              'delta',*/}
            {/*              primaryStatistic,*/}
            {/*            );*/}
            {/*            return (*/}
            {/*              <div key={districtName} className='district'>*/}
            {/*                <h2>{formatNumber(total)}</h2>*/}
            {/*                <h5>{t(districtName)}</h5>*/}
            {/*                {primaryStatistic !== 'active' && (*/}
            {/*                  <div className='delta'>*/}
            {/*                    <h6 className={primaryStatistic}>*/}
            {/*                      {delta > 0*/}
            {/*                        ? '\u2191' + formatNumber(delta)*/}
            {/*                        : ''}*/}
            {/*                    </h6>*/}
            {/*                  </div>*/}
            {/*                )}*/}
            {/*              </div>*/}
            {/*            );*/}
            {/*          })}*/}
            {/*      </div>*/}
            {/*    </div>*/}

            {/*    <div className='district-bar-right fadeInUp' style={trail[2]}>*/}
            {/*      {timeseries &&*/}
            {/*      (primaryStatistic === 'confirmed' ||*/}
            {/*        primaryStatistic === 'deceased') && (*/}
            {/*        <div className='happy-sign'>*/}
            {/*          {Object.keys(timeseries[stateCode]?.dates || {})*/}
            {/*            .slice(-lookback)*/}
            {/*            .every(*/}
            {/*              (date) =>*/}
            {/*                getStatistic(*/}
            {/*                  timeseries[stateCode].dates[date],*/}
            {/*                  'delta',*/}
            {/*                  primaryStatistic,*/}
            {/*                ) === 0,*/}
            {/*            ) && (*/}
            {/*            <div*/}
            {/*              className={`alert ${*/}
            {/*                primaryStatistic === 'confirmed' ? 'is-green' : ''*/}
            {/*              }`}*/}
            {/*            >*/}
            {/*              <SmileyIcon />*/}
            {/*              <div className='alert-right'>*/}
            {/*                No new {primaryStatistic} cases in the past five*/}
            {/*                days*/}
            {/*              </div>*/}
            {/*            </div>*/}
            {/*          )}*/}
            {/*        </div>*/}
            {/*      )}*/}
            {/*      /!*<DeltaBarGraph*!/*/}
            {/*      /!*  timeseries={timeseries?.[stateCode]?.dates}*!/*/}
            {/*      /!*  statistic={primaryStatistic}*!/*/}
            {/*      /!*  {...{stateCode, lookback}}*!/*/}
            {/*      /!*  forceRender={!!timeseriesResponseError}*!/*/}
            {/*      /!*//*/}
            {/*    </div>*/}
            {/*  </div>*/}

            {/*  /!*<div className="district-bar-bottom">*!/*/}
            {/*  /!*  {districts.length > 5 ? (*!/*/}
            {/*  /!*    <button*!/*/}
            {/*  /!*      className="button fadeInUp"*!/*/}
            {/*  /!*      onClick={toggleShowAllDistricts}*!/*/}
            {/*  /!*      style={trail[3]}*!/*/}
            {/*  /!*    >*!/*/}
            {/*  /!*        <span>*!/*/}
            {/*  /!*          {t(showAllDistricts ? 'View less' : 'View all')}*!/*/}
            {/*  /!*        </span>*!/*/}
            {/*  /!*    </button>*!/*/}
            {/*  /!*  ) : (*!/*/}
            {/*  /!*    <div style={{height: '3.75rem', flexBasis: '15%'}} />*!/*/}
            {/*  /!*  )}*!/*/}
            {/*  /!*</div>*!/*/}
            {/*</div>*/}

          </div>


          {(isVisible || location.hash) && (
            <>
              {data && (
                <div
                  style={{
                    marginTop: '-5rem',
                  }}
                  className={classnames('map-container', {
                    expanded: expandTable,
                    stickied:
                      anchor === 'mapexplorer' || (expandTable && width >= 769),
                  })}
                >

                </div>
              )}

              {/*{timeseries && (*/}
              {/*  <Suspense fallback={<div style={{height: '50rem'}} />}>*/}
              {/*    <TimeseriesExplorer*/}
              {/*      stateCode='TT'*/}
              {/*      {...{*/}
              {/*        date,*/}
              {/*        anchor,*/}
              {/*        setAnchor,*/}
              {/*        expandTable,*/}
              {/*        */}
              {/*      }}*/}
              {/*    />*/}
              {/*  </Suspense>*/}
              {/*)}*/}
            </>
          )}
        </div>
      </div>

      <div className={'tableCus'}>
        <div className={classnames(`tableCus-left ${expandTable ? 'expanded' : ''}`, {expanded: expandTable})}>
          {data && (
            <Suspense fallback={<TableLoader />}>
              <Table
                {...{
                  data,
                  symbol,
                  sector,
                  symbolHandler,
                  sectorHandler,
                  // regionHighlighted,
                  // setRegionHighlighted,
                  expandTable,
                  setExpandTable,
                  // hideDistrictData,
                  // hideDistrictTestData,
                  // hideVaccinated,
                  // lastDataDate,
                  // noDistrictDataStates,
                }}
              />
            </Suspense>
          )}
        </div>

        <div
          ref={homeRightElement}
          className={classnames(`tableCus-right ${expandTable ? 'expanded' : ''}`, {expanded: expandTable})}
        >
          &nbsp;
        </div>


        {/*<div>*/}
        {/*  <Pagination count={10} />*/}
        {/*</div>*/}

      </div>


      {isVisible && (
        <Suspense fallback={<div />}>
          <Footer />
        </Suspense>
      )}
    </>
  );
}

export default SymbolPage;
