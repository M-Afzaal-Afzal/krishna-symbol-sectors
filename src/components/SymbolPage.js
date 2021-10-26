import TableLoader from './loaders/Table';
import {
  DATA_API_ROOT,
  DISTRICT_START_DATE,
  DISTRICT_TEST_END_DATE, MAP_STATISTICS,
  MAP_VIEWS,
  PRIMARY_STATISTICS,
  TESTED_EXPIRING_DAYS,
  UNKNOWN_DISTRICT_KEY,
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
import useSWR from 'swr';
import {useTranslation} from 'react-i18next';
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

function Home() {

  const symbol = useParams()?.id || '';

  console.log(symbol,'****************************************************');

  const [regionHighlighted, setRegionHighlighted] = useState({
    stateCode: 'TT',
    districtName: null,
  });

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

  const {data: timeseries} = useStickySWR(
    `${DATA_API_ROOT}/timeseries.min.json`,
    fetcher,
    {
      revalidateOnMount: true,
      refreshInterval: 100000,
    },
  );

  const {data} = useStickySWR(
    `https://www.finlytica.com/options-flow-summary-sector?days=60&sort=totalpremium:asc&putcountpercent_gte=5&limit=10`,
    fetcher,
    {
      revalidateOnMount: true,
      refreshInterval: 100000,
    },
  );

  const homeRightElement = useRef();
  const isVisible = useIsVisible(homeRightElement);
  const {width} = useWindowSize();

  const hideDistrictData = date !== '' && date < DISTRICT_START_DATE;
  const hideDistrictTestData =
    date === '' ||
    date >
    formatISO(
      addDays(parseIndiaDate(DISTRICT_TEST_END_DATE), TESTED_EXPIRING_DAYS),
      {representation: 'date'},
    );

  // const hideVaccinated =
  //   getStatistic(data?.['TT'], 'total', 'vaccinated') === 0;

  // const lastDataDate = useMemo(() => {
  //   const updatedDates = [
  //     data?.['TT']?.meta?.date,
  //     data?.['TT']?.meta?.tested?.date,
  //     data?.['TT']?.meta?.vaccinated?.date,
  //   ].filter((date) => date);
  //   return updatedDates.length > 0
  //     ? formatISO(max(updatedDates.map((date) => parseIndiaDate(date))), {
  //       representation: 'date',
  //     })
  //     : null;
  // }, [data]);

  // const noDistrictDataStates = useMemo(
  //   () =>
  //     // Heuristic: All cases are in Unknown
  //     Object.entries(data || {}).reduce((res, [stateCode, stateData]) => {
  //       res[stateCode] = !!(
  //         stateData?.districts &&
  //         stateData.districts?.[UNKNOWN_DISTRICT_KEY] &&
  //         PRIMARY_STATISTICS.every(
  //           (statistic) =>
  //             getStatistic(stateData, 'total', statistic) ===
  //             getStatistic(
  //               stateData.districts[UNKNOWN_DISTRICT_KEY],
  //               'total',
  //               statistic,
  //             ),
  //         )
  //       );
  //       return res;
  //     }, {}),
  //   [data],
  // );

  // const noRegionHighlightedDistrictData =
  //   regionHighlighted?.stateCode &&
  //   regionHighlighted?.districtName &&
  //   regionHighlighted.districtName !== UNKNOWN_DISTRICT_KEY &&
  //   noDistrictDataStates[regionHighlighted.stateCode];

  // tabular chart config
  const [showAllDistricts, setShowAllDistricts] = useState(false);
  // const primaryStatistic = MAP_STATISTICS.includes(mapStatistic)
  //   ? mapStatistic
  //   : 'confirmed';

  // const trail = useMemo(() => {
  //   const styles = [];
  //
  //   [0, 0, 0, 0].map((element, index) => {
  //     styles.push({
  //       animationDelay: `${index * 250}ms`,
  //     });
  //     return null;
  //   });
  //   return styles;
  // }, []);

  const stateCode = 'MH';

  const stateData = data?.[stateCode];

  // const gridRowCount = useMemo(() => {
  //   if (!stateData) return;
  //   const gridColumnCount = window.innerWidth >= 540 ? 3 : 2;
  //   const districtCount = stateData?.districts
  //     ? Object.keys(stateData.districts).filter(
  //       (districtName) => districtName !== 'Unknown',
  //     ).length
  //     : 0;
  //   const gridRowCount = Math.ceil(districtCount / gridColumnCount);
  //   return gridRowCount;
  // }, [stateData]);

  // const noDistrictData = useMemo(() => {
  //   // Heuristic: All cases are in Unknown
  //   return !!(
  //     stateData?.districts &&
  //     stateData.districts?.[UNKNOWN_DISTRICT_KEY] &&
  //     PRIMARY_STATISTICS.every(
  //       (statistic) =>
  //         getStatistic(stateData, 'total', statistic) ===
  //         getStatistic(
  //           stateData.districts[UNKNOWN_DISTRICT_KEY],
  //           'total',
  //           statistic,
  //         ),
  //     )
  //   );
  // }, [stateData]);

  // const districts = Object.keys(
  //   ((!noDistrictData || !statisticConfig.hasPrimary) &&
  //     stateData?.districts) ||
  //   {},
  // );

  // const handleSort = (districtNameA, districtNameB) => {
  //   const districtA = stateData.districts[districtNameA];
  //   const districtB = stateData.districts[districtNameB];
  //   return (
  //     getStatistic(districtB, 'total', mapStatistic) -
  //     getStatistic(districtA, 'total', mapStatistic)
  //   );
  // };

  // const lookback = showAllDistricts ? (window.innerWidth >= 540 ? 10 : 8) : 6;

  // const {error: timeseriesResponseError} = useSWR(
  //   `${DATA_API_ROOT}/timeseries-${stateCode}.min.json`,
  //   fetcher,
  //   {
  //     revalidateOnMount: true,
  //     refreshInterval: 100000,
  //   },
  // );

  // const toggleShowAllDistricts = () => {
  //   setShowAllDistricts(!showAllDistricts);
  // };

  //CARDS SETUP

  const [cardsData, setCardsData] = useState();
  const [symbolSectorStats, setSymbolSectorStats] = useState(null);
  // const [sectors, setSectors] = useState(null);

  useEffect(() => {

    if (!cardsData || !symbolSectorStats) {


      fetch('https://www.finlytica.com/options-flow')
        .then(res => res.json())
        .then(data => {
          const dates = data.map(dataItem => dataItem.created_date);
          if (!dates) {
            setDates(dates);
          }
        });

      fetch('https://www.finlytica.com/options-flow-summary-stats?start_date=2021-07-28&end_date=2021-08-01')
        .then(res => res.json())
        .then(res => {
          const data = res.data;


          console.log(data, 'data is there');

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
              // case 4: {
              //   return {
              //     id: 4,
              //     name: 'CALL PREMIUM',
              //     total: data.totalcallpremium,
              //     percentage: data.callpremiumpercent,
              //   };
              // }
              // case 5: {
              //   return {
              //     id: 5,
              //     name: 'PUT PREMIUM',
              //     total: data.totalputpremium,
              //     percentage: data.putpremiumpercent,
              //   };
              // }
              // case 6: {
              //   return {
              //     id: 6,
              //     name: 'TOTAL ORDER VOLUME',
              //     total: data.totalcount,
              //     percentage: '',
              //   };
              // }
              // case 7: {
              //   return {
              //     id: 7,
              //     name: 'TOTAL PREMIUM VOLUME',
              //     total: data.totalpremium,
              //     percentage: '',
              //   };
              // }
            }
          });

          if (!symbolSectorStats) {
            setSymbolSectorStats(data);
          }

          if (!cardsData) {
            setCardsData(cardsDataArr);
          }


          console.log(cardsDataArr, 'cards data array');

        });

    }

  }, []);

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
              <Search />
            </Suspense>

            {/*{!data && !timeseries && <div style={{height: '60rem'}} />}*/}

            <>
              {/*{!timeseries && <div style={{minHeight: '61px'}} />}*/}
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

            {/*<>*/}
            {/*  {!timeseries && <div style={{height: '123px'}} />}*/}
            {/*  {timeseries && (*/}
            {/*    <Suspense fallback={<div style={{height: '123px'}} />}>*/}
            {/*      <Minigraphs*/}
            {/*        timeseries={timeseries['TT']?.dates}*/}
            {/*        {...{date}}*/}
            {/*      />*/}
            {/*    </Suspense>*/}
            {/*  )}*/}
            {/*</>*/}
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

              {timeseries && (
                <Suspense fallback={<div style={{height: '50rem'}} />}>
                  <TimeseriesExplorer
                    stateCode='TT'
                    {...{
                      timeseries,
                      date,
                      regionHighlighted,
                      setRegionHighlighted,
                      anchor,
                      setAnchor,
                      expandTable,
                      hideVaccinated,
                      noRegionHighlightedDistrictData,
                    }}
                  />
                </Suspense>
              )}
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
                  regionHighlighted,
                  setRegionHighlighted,
                  expandTable,
                  setExpandTable,
                  hideDistrictData,
                  hideDistrictTestData,
                  hideVaccinated,
                  lastDataDate,
                  noDistrictDataStates,
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

export default Home;
