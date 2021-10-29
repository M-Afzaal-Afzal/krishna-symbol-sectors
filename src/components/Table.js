import HeaderCell from './HeaderCell';
// import TableLoader from './loaders/Table';
import {DistrictIcon} from './snippets/Icons';
// import TableDeltaHelper from './snippets/TableDeltaHelper';
import Tooltip from './Tooltip';

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

import {TABLE_FADE_IN, TABLE_FADE_OUT} from '../animations';
import {
  DISTRICT_TABLE_COUNT,
  STATE_NAMES,
  STATISTIC_CONFIGS,
  TABLE_STATISTICS,
  TABLE_STATISTICS_EXPANDED, TABLE_STATISTICS_SYMBOL,
  UNASSIGNED_STATE_CODE,
} from '../constants';
import {abbreviateNumber, getStatistic, parseParams, retry} from '../utils/commonFunctions';

import {
  FoldDownIcon,
  InfoIcon,
  OrganizationIcon,
  PeopleIcon,
  PulseIcon,
  QuestionIcon,
  SortAscIcon,
  SortDescIcon,
} from '@primer/octicons-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import produce from 'immer';
import {memo, useCallback, useEffect, useMemo, useState, lazy} from 'react';
import {
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
} from 'react-feather';
import {useTranslation} from 'react-i18next';
import {Link, useHistory, useLocation, useParams} from 'react-router-dom';
import {useTrail, useTransition, animated, config} from 'react-spring';
import {useKeyPressEvent, useMeasure, useSessionStorage} from 'react-use';
// eslint-disable-next-line
// import worker from 'workerize-loader!../workers/getDistricts';
import {Avatar} from '@chakra-ui/react';
import useDarkMode from 'use-dark-mode';

// const Row = lazy(() => retry(() => import('./Row')));

function Table({
                 // data: states,
                 // date: timelineDate,
                 // regionHighlighted,
                 // setRegionHighlighted,
                 expandTable,
                 setExpandTable,
                 hideDistrictData,
                 page,
                 limit,
                 start,
                 // hideDistrictTestData,
                 // hideVaccinated,
                 // lastDataDate,
                 // noDistrictDataStates,
               }) {
  const {t} = useTranslation();
  // const [sortData, setSortData] = useSessionStorage('sortData', {
  //   sortColumn: 'confirmed',
  //   isAscending: false,
  //   delta: false,
  // });
  // const [page, setPage] = useState(0);
  // const [delta7Mode, setDelta7Mode] = useState(false);
  const symbol = useParams()?.id || null;

  const [tableContainerRef, {width: tableWidth}] = useMeasure();
  const darkMode = useDarkMode();
  // console.log(darkMode, 'dark mode --------------------------------------------------------------------------------------');
  // const handleSortClick = useCallback(
  //   (statistic) => {
  //     if (sortBy !== statistic) {
  //       setSortData(
  //         produce(sortData, (draftSortData) => {
  //           if (
  //             sortData.sortColumn === 'regionName' ||
  //             statistic === 'regionName'
  //           ) {
  //             draftSortData.isAscending = !sortData.isAscending;
  //           }
  //           draftSortData.sortColumn = statistic;
  //         }),
  //       );
  //     } else {
  //       setSortData(
  //         produce(sortData, (draftSortData) => {
  //           draftSortData.isAscending = !sortData.isAscending;
  //         }),
  //       );
  //     }
  //   },
  //   [sortData, setSortData],
  // );

  const handleSortClick = (statistic) => {
    console.log(statistic, 'statistic for sort');
    if (statistic !== sortBy) {
      setSortBy(statistic);
      setIsAscending(false);
    } else {
      setIsAscending((prevState => !prevState));
    }
  };

  const trail = useTrail(5, {
    from: {transform: 'translate3d(0, 10px, 0)', opacity: 0},
    to: {transform: 'translate3d(0, 0px, 0)', opacity: 1},
    config: config.wobbly,
  });

  // const [allDistricts, setAllDistricts] = useState();

  const [tableOption, setTableOption] = useState('Symbols');
  // const [isPerLakh, setIsPerLakh] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  console.log(tableOption, 'table option is this waoo');

  // const getTableStatistic = useCallback(
  //   (data, statistic, type) => {
  //     const statisticConfig = STATISTIC_CONFIGS[statistic];
  //     if (type == 'total' && statisticConfig?.onlyDelta7) {
  //       type = 'delta7';
  //     }
  //
  //     if (statisticConfig?.showDelta && type === 'total' && delta7Mode) {
  //       type = 'delta7';
  //     }
  //
  //     return getStatistic(data, type, statistic, {
  //       expiredDate: lastDataDate,
  //       normalizedByPopulationPer: isPerLakh ? 'lakh' : null,
  //     });
  //   },
  //   [isPerLakh, lastDataDate, delta7Mode],
  // );

  // const districts = useMemo(() => {
  //   if (!isPerLakh) {
  //     return allDistricts;
  //   } else {
  //     return Object.keys(allDistricts || {})
  //       .filter(
  //         (districtKey) =>
  //           getStatistic(allDistricts[districtKey], 'total', 'population') > 0,
  //       )
  //       .reduce((res, districtKey) => {
  //         res[districtKey] = allDistricts[districtKey];
  //         return res;
  //       }, {});
  //   }
  // }, [isPerLakh, allDistricts]);

  // const numPages = Math.ceil(
  //   Object.keys(districts || {}).length / DISTRICT_TABLE_COUNT,
  // );

  // const sortingFunction = useCallback(
  //   (regionKeyA, regionKeyB) => {
  //     if (sortData.sortColumn !== 'regionName') {
  //       const statisticConfig = STATISTIC_CONFIGS[sortData.sortColumn];
  //       const dataType =
  //         sortData.delta && statisticConfig?.showDelta ? 'delta' : 'total';
  //
  //       const statisticA = getTableStatistic(
  //         districts?.[regionKeyA] || states[regionKeyA],
  //         sortData.sortColumn,
  //         dataType,
  //       );
  //       const statisticB = getTableStatistic(
  //         districts?.[regionKeyB] || states[regionKeyB],
  //         sortData.sortColumn,
  //         dataType,
  //       );
  //       return sortData.isAscending
  //         ? statisticA - statisticB
  //         : statisticB - statisticA;
  //     } else {
  //       const regionNameA =
  //         districts?.[regionKeyA]?.districtName || STATE_NAMES[regionKeyA];
  //       const regionNameB =
  //         districts?.[regionKeyB]?.districtName || STATE_NAMES[regionKeyB];
  //       return sortData.isAscending
  //         ? regionNameA.localeCompare(regionNameB)
  //         : regionNameB.localeCompare(regionNameA);
  //     }
  //   },
  //   [
  //     districts,
  //     getTableStatistic,
  //     sortData.delta,
  //     sortData.isAscending,
  //     sortData.sortColumn,
  //     states,
  //   ],
  // );

  const _setTableOption = useCallback(() => {
    setTableOption((prevTableOption) =>
      prevTableOption === 'Symbols' ? 'Sectors' : 'Symbols',
    );
  }, []);

  // useEffect(() => {
  // const workerInstance = worker();
  // workerInstance.getDistricts(states);
  // workerInstance.addEventListener('message', (message) => {
  //   if (message.data.type !== 'RPC') {
  //     setAllDistricts(message.data);
  //     workerInstance.terminate();
  //   }
  // });
  // }, [tableOption, states]);

  // useEffect(() => {
  //   setPage((p) => Math.max(0, Math.min(p, numPages - 1)));
  // }, [numPages]);

  const [sectors, setSectors] = useState(null);
  const [symbols, setSymbols] = useState(null);

  const [symbolsPageTableData, setSymbolsPageTableData] = useState(null);

  const [sortBy, setSortBy] = useState('totalcallvolume');

  const [isAscending, setIsAscending] = useState(false);

  // const history = useHistory();
  // let query = useQuery();


  // console.log(query.get('name'),'---------------------------------');


  // getting the query parameters object
  const queryParams = parseParams(window.location.search);

  console.log(queryParams, 'query params are there bhaii,---------------------------------------------------------');
  console.log(`https://www.finlytica.com/options-flow-summary-sector?start_date=2021-07-28&end_date=2021-08-01&sort=${sortBy}:${isAscending ? 'asc' : 'desc'}&putcountpercent_gte=5&${new URLSearchParams(queryParams)}&_limit=${limit}&_start=${(page-1)* limit}`);

  useEffect(() => {


    // fetch(`https://www.finlytica.com/options-flow-summary-sector?start_date=2021-07-28&end_date=2021-08-01&sort=${sortBy}:${isAscending ? 'asc' : 'desc'}&putcountpercent_gte=5&${new URLSearchParams(queryParams)}&limit=${limit}&start=${(page-1)* limit}`)
    fetch(`https://www.finlytica.com/options-flow-summary-sector?start_date=2021-07-28&end_date=2021-08-01&sort=${sortBy}:${isAscending ? 'asc' : 'desc'}&putcountpercent_gte=5&${new URLSearchParams(queryParams)}`)
      .then(res => res.json())
      .then((data) => {
        // if (!sectors) {
        setSectors(Object.entries(data));
        // }
        // console.log(data, 'Sectors are there - ------------------------------------------');
      });

    // fetch(`https://www.finlytica.com/options-flow-summary-symbol?sort=${sortBy}:${isAscending ? 'asc' : 'desc'}&limit=6&days=390&${new URLSearchParams(queryParams)}&limit=${limit}&start=${(page-1)* limit}`)
    fetch(`https://www.finlytica.com/options-flow-summary-symbol?sort=${sortBy}:${isAscending ? 'asc' : 'desc'}&limit=6&days=390&${new URLSearchParams(queryParams)}`)
      .then(res => res.json())
      .then((data) => {
        // if (!symbols) {
        setSymbols(Object.entries(data));
        // }
        console.log(data, 'Symbols are there - ------------------------------------------');
      });

    fetch(`https://www.finlytica.com/options-flow?symbol=${symbol}&${new URLSearchParams(queryParams)}&volume_gte=555`)
      .then(res => res.json())
      .then((data) => {
        // if (!symbolsPageTableData) {

        setSymbolsPageTableData(data);
        // }
        console.log(data, 'Symbols pag table data is here are there - -----------ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd-------------------------------');
      });


  }, [sortBy, isAscending, window.location.search,page]);

  // const handlePageClick = (direction) => {
  //   if (Math.abs(direction) === 1) {
  //     setPage(Math.min(Math.max(0, page + direction), numPages - 1));
  //   } else if (direction < 0) {
  //     setPage(0);
  //   } else if (direction > 0) {
  //     setPage(numPages - 1);
  //   }
  // };

  const transition = useTransition(isInfoVisible, {
    from: TABLE_FADE_OUT,
    enter: TABLE_FADE_IN,
    leave: TABLE_FADE_OUT,
  });


  const tableStatistics = symbol ? TABLE_STATISTICS_SYMBOL : TABLE_STATISTICS_EXPANDED;


  const showDistricts = tableOption === 'Symbols' && !hideDistrictData;

  // useEffect(() => {
  //   if (!showDistricts) {
  //     setPage(0);
  //   }
  // }, [showDistricts]);

  useKeyPressEvent('?', () => {
    setIsInfoVisible(!isInfoVisible);
  });

  return (
    <div className='Table'>
      <div className='table-top'>
        <div className='table-top-left'>
          <Tooltip message={'Toggle between symbols/states'} hold>
            <animated.div
              className={classnames('toggle', 'option-toggle', {
                'is-highlighted': showDistricts,
                disabled: hideDistrictData,
              })}
              onClick={_setTableOption}
              style={trail[0]}
            >
              <DistrictIcon />
            </animated.div>
          </Tooltip>

          <animated.div
            className={classnames('toggle', 'info-toggle', {
              'is-highlighted': isInfoVisible,
            })}
            onClick={setIsInfoVisible.bind(this, !isInfoVisible)}
            style={trail[3]}
          >
            <QuestionIcon size={14} />
          </animated.div>
        </div>

        <Tooltip message={`${expandTable ? 'Collapse' : 'Expand'} table`} hold>
          <animated.div
            className={classnames('toggle', 'expand-table-toggle', {
              'is-highlighted': expandTable,
            })}
            style={trail[4]}
            onClick={setExpandTable.bind(this, !expandTable)}
          >
            <FoldDownIcon size={16} />
          </animated.div>
        </Tooltip>
      </div>

      {/* Todo here in the toggle we've to add some details*/}
      {transition(
        (style, item) =>
          item && (
            <animated.div style={{
              height: '5rem',
              overflow: 'scroll',
            }} className='table-helper' {...{style}}>
              <div className='helper-top'>
                <div style={{display: 'flex', flexDirection: 'column'}} className='helper-left'>
                  {
                    sectors && sectors.map(([sector, _]) => (
                      <div key={sector} style={{width: '100%', display: 'block'}} className='info-item'>
                        <p className={'sectors'} style={{width: '100%', margin: '4px 0'}}>{sector}</p>
                      </div>
                    ))
                  }


                </div>


              </div>

              <h5 className='text'>
                {t('Compiled from State Govt. numbers')},{' '}
                <Link to='/about'>{t('know more')}!</Link>
              </h5>
            </animated.div>
          ),
      )}

      <div className='table-container' ref={tableContainerRef}>
        <div
          className='table fadeInUp'
          style={{
            gridTemplateColumns: `repeat(${tableStatistics.length + 1}, auto)`,
          }}
        >

          <div className='row heading'>
            {
              !symbol ? (
                <div
                  className='cell heading'
                  // todo we have to manage the sort
                  // onClick={handleSortClick.bind(this, 'regionName')}
                >

                  {/*    /!* todo here we have to manage the states or sectors*!/*/}

                  <div>
                    {tableOption}
                  </div>


                  {/*{sortData.sortColumn === 'regionName' && (*/}
                  {/*  <div className={'sort-icon'}>*/}
                  {/*    {sortData.isAscending ? (*/}
                  {/*      <SortAscIcon size={12} />*/}
                  {/*    ) : (*/}
                  {/*      <SortDescIcon size={12} />*/}
                  {/*    )}*/}
                  {/*  </div>*/}
                  {/*)}*/}
                </div>
              ) : (
                <div className={'cell heading'}>
                  <div>
                    {symbol}
                  </div>
                </div>
              )
            }


            {tableStatistics.map((statistic) => (
              <>
                <HeaderCell
                  key={statistic}

                  statistic={statistic}
                  sortBy={sortBy}
                  isAscending={isAscending}

                  handleSort={handleSortClick}
                />
              </>
            ))}
          </div>

          {
            !symbol && sectors && tableOption === 'Sectors' && sectors.map(([propertyName, propertyObj], index) => {

              return (
                <div key={index} className={'row'}>

                  <div key={index} style={{textAlign: 'left'}} className={'cell heading'}>{propertyName}</div>

                  {
                    tableStatistics.map((statistic, i) => {

                      return (
                        <div key={i} className={'cell'}>
                          {propertyObj[statistic] ? (
                              <div style={{color: statistic.includes('call') ? 'green' : 'red'}}>
                                {statistic.includes('percent') ? abbreviateNumber(propertyObj[statistic].toFixed(2)) + '%' : abbreviateNumber(propertyObj[statistic].toFixed(2))}
                              </div>
                            ) :
                            <>0</>
                          }
                        </div>);

                    })
                  }

                </div>
              );


            })
          }

          {
            !symbol && symbols && tableOption === 'Symbols' && symbols.map(([propertyName, propertyObj], index) => {

              return (
                <div key={index} className={'row'}>

                  <Link to={`/symbol/${propertyName}`}>
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }} className={'cell heading'}>
                      {propertyName} <Avatar ml={'8px'} size={'sm'}
                                             src={`https://storage.googleapis.com/iex/api/logos/${propertyName}.png`}
                                             name={'afzaal'} />
                    </div>
                  </Link>

                  {
                    tableStatistics.map((statistic, i) => {

                      return (
                        <div key={i} className={'cell'}>
                          {propertyObj[statistic] ? (
                            <div style={{color: statistic.includes('call') ? 'green' : 'red'}}>
                              {statistic.includes('percent') ? abbreviateNumber(propertyObj[statistic].toFixed(2)) + '%' : abbreviateNumber(propertyObj[statistic].toFixed(2))}
                            </div>
                          ) : <>0</>}
                        </div>);

                    })
                  }

                </div>
              );


            })
          }


          {
            symbol && symbolsPageTableData && symbolsPageTableData.map((data, i) => {


              const dataArr = Object.entries(data);

              const filteredDataArr = dataArr.filter(([key, value], index) => tableStatistics.includes(key) && [key, value]);

              console.log(filteredDataArr, 'filtered data aray');

              {/* This is the first cell which will be empty*/
              }
              return (
                <div id={i} className={'row'}>
                  <div className={'cell'}>
                    &nbsp;
                  </div>

                  {
                    filteredDataArr.map(([key, value], index) => {

                      console.log(key, value, 'key value');

                      return (

                        <>
                          {tableStatistics.includes(key.trim()) ? (
                            <div key={index} className={'cell'}>
                              <div
                                style={{color: key.includes('call') ? 'green' : key.includes('put') ? 'red' : darkMode.value ? 'white' : 'black'}}>
                                <div style={{
                                  color: value === 'CALL' ? 'green' : value === 'PUT' ? 'red' : '',
                                }}>
                                  <div style={{
                                    color: value === 'BLOCK' ? 'green' : value === 'SWEEP' ? 'rgb(255, 193, 7)' : '',
                                  }}>
                                    {
                                      key.includes('implied_volatility') ? Math.round(data[key] * 100) + '%' :
                                        (key === 'volume' || key === 'premium' || key === 'mkt_cap' || key === 'oi')
                                          ?
                                          abbreviateNumber((data[key]))
                                          :
                                          (data[key])
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : <>0</>}
                        </>
                      );

                    })
                  }
                </div>
              );

            })
          }


          {/*{showDistricts && !districts && <TableLoader />}*/}

        </div>
      </div>

    </div>
  );
}

export default memo(Table);
